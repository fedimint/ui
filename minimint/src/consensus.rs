use crate::database::{
    AllConsensusItemsKeyPrefix, AllPartialSignaturesKey, ConsensusItemKeyPrefix, DummyValue,
    FinalizedSignatureKey, PartialSignatureKey,
};
use crate::net::api::ClientRequest;
use crate::rng::RngGenerator;
use config::ServerConfig;
use counter::Counter;
use database::batch::{BatchItem, BatchTx, DbBatch};
use database::{BatchDb, BincodeSerialized, Database, DatabaseError, PrefixSearchable};
use fedimint::{FediMint, MintError};
use fediwallet::{Wallet, WalletConsensusItem};
use hbbft::honey_badger::Batch;
use itertools::Itertools;
use mint_api::{
    Amount, BitcoinHash, Coin, InvalidAmountTierError, PartialSigResponse, PegInRequest,
    PegOutRequest, ReissuanceRequest, TransactionId, TxId,
};
use musig;
use rand::{CryptoRng, RngCore};
use rayon::prelude::*;
use serde::{Deserialize, Serialize};
use thiserror::Error;
use tracing::{debug, error, info, trace, warn};

#[derive(Debug, Clone, Eq, PartialEq, Hash, Serialize, Deserialize)]
pub enum ConsensusItem {
    ClientRequest(ClientRequest),
    PartiallySignedRequest(TransactionId, mint_api::PartialSigResponse),
    Wallet(WalletConsensusItem),
}

pub type HoneyBadgerMessage = hbbft::honey_badger::Message<u16>;
pub type ConsensusOutcome = Batch<Vec<ConsensusItem>, u16>;

pub struct FediMintConsensus<R, D, M>
where
    R: RngCore + CryptoRng,
    D: Database + PrefixSearchable + Sync,
    M: FediMint + Sync,
{
    /// Cryptographic random number generator used for everything
    pub rng_gen: Box<dyn RngGenerator<Rng = R>>,
    /// Configuration describing the federation and containing our secrets
    pub cfg: ServerConfig, // TODO: make custom config

    /// Our local mint
    pub mint: M, //TODO: box dyn trait
    pub wallet: Wallet<D>,

    /// KV Database into which all state is persisted to recover from in case of a crash
    pub db: D,
}

impl<R, D, M> FediMintConsensus<R, D, M>
where
    R: RngCore + CryptoRng,
    D: Database + PrefixSearchable + BatchDb + Sync + Send + Clone + 'static,
    M: FediMint + Sync,
{
    pub fn submit_client_request(&self, cr: ClientRequest) -> Result<(), ClientRequestError> {
        debug!("Received client request of type {}", cr.dbg_type_name());
        match cr {
            ClientRequest::Reissuance(ref reissuance_req) => {
                let pub_keys = reissuance_req
                    .coins
                    .iter()
                    .map(|(_, coin)| coin.spend_key())
                    .collect::<Vec<_>>();

                if !musig::verify(
                    reissuance_req.id().into_inner(),
                    reissuance_req.sig.clone(),
                    &pub_keys,
                ) {
                    return Err(ClientRequestError::InvalidTransactionSignature);
                }

                reissuance_req.coins.check_tiers(&self.cfg.tbs_sks)?;
                reissuance_req
                    .blind_tokens
                    .0
                    .check_tiers(&self.cfg.tbs_sks)?;

                self.mint.validate(&self.db, &reissuance_req.coins)?;
            }
            ClientRequest::PegIn(ref peg_in) => {
                self.wallet
                    .verify_pigin(&peg_in.proof)
                    .ok_or(ClientRequestError::InvalidPegIn)?;
                // TODO: pre-check amounts, preferably without redundancy

                if !musig::verify(
                    peg_in.id().as_hash().into_inner(),
                    peg_in.sig.clone(),
                    &[peg_in.proof.tweak_contract_key()],
                ) {
                    return Err(ClientRequestError::InvalidPegIn);
                }

                peg_in.blind_tokens.0.check_tiers(&self.cfg.tbs_sks)?;
            }
            ClientRequest::PegOut(ref peg_out) => {
                // TODO: remove redundancy with reissuance
                let pub_keys = peg_out
                    .coins
                    .iter()
                    .map(|(_, coin)| coin.spend_key())
                    .collect::<Vec<_>>();
                if !musig::verify(peg_out.id().into_inner(), peg_out.sig.clone(), &pub_keys) {
                    return Err(ClientRequestError::InvalidTransactionSignature);
                }

                peg_out.coins.check_tiers(&self.cfg.tbs_sks)?;
            }
        }

        let new = self
            .db
            .insert_entry(&ConsensusItem::ClientRequest(cr), &())
            .expect("DB error");

        if new.is_some() {
            warn!("Added consensus item was already in consensus queue");
        }

        Ok(())
    }

    pub async fn process_consensus_outcome(
        &self,
        consensus_outcome: ConsensusOutcome,
    ) -> WalletConsensusItem {
        info!("Processing output of epoch {}", consensus_outcome.epoch);

        let mut db_batch = DbBatch::new();

        let wallet_consensus = consensus_outcome
            .contributions
            .iter()
            .flat_map(|(&peer, cis)| cis.iter().map(move |ci| (peer, ci)))
            .filter_map(|(peer, ci)| match ci {
                ConsensusItem::ClientRequest(_) => None,
                ConsensusItem::PartiallySignedRequest(_, _) => None,
                ConsensusItem::Wallet(wci) => Some((peer, wci.clone())),
            })
            .collect::<Vec<_>>();
        let (wallet_ci, wallet_sig_ci) = self
            .wallet
            .process_consensus_proposals(
                db_batch.transaction(),
                wallet_consensus,
                self.rng_gen.get_rng(),
            )
            .await
            .expect("wallet error");

        if let Some(wci) = wallet_sig_ci {
            db_batch.autocommit(|tx| tx.append_insert_new(ConsensusItem::Wallet(wci), ()));
        }

        // Since the changes to the database will happen all at once we won't be able to handle
        // conflicts between consensus items in one batch there. Thus we need to make sure that
        // all items in a batch are consistent/deterministically filter out inconsistent ones.
        // There are two item types that need checking:
        //  * peg-ins that each peg-in tx is only used to issue coins once
        //  * coin spends to avoid double spends in one batch

        // TODO: check if spent coins are the only thing needing a sanity cross tx check
        // Make sure every coin appears only in one request
        let spent_coins = consensus_outcome
            .contributions
            .iter()
            .flat_map(|(_, cis)| cis.iter())
            .unique()
            .filter_map(|ci| {
                match ci {
                    ConsensusItem::ClientRequest(ClientRequest::Reissuance(req)) => {
                        Some(&req.coins) // TODO: get rid of clone once MuSig2 lands
                    }
                    ConsensusItem::ClientRequest(ClientRequest::PegOut(req)) => Some(&req.coins),
                    _ => None,
                }
                .map(|coins| coins.iter().map(|(_, coin): (Amount, &Coin)| coin.clone()))
            })
            .flatten()
            .collect::<Counter<_>>();

        let used_peg_in_proofs = consensus_outcome
            .contributions
            .iter()
            .flat_map(|(_, cis)| cis.iter())
            .unique()
            .filter_map(|ci| match ci {
                ConsensusItem::ClientRequest(ClientRequest::PegIn(req)) => {
                    Some(req.proof.identity())
                }
                _ => None,
            })
            .collect::<Counter<_>>();

        // Filter batch for consistency
        let filtered_consensus_outcome = consensus_outcome
            .contributions
            .into_iter()
            .flat_map(|(peer, cis)| {
                debug!("Peer {} contributed {} items", peer, cis.len());

                // TODO: possibly clean DB afterwards/burn coins
                // Filter out any double spends
                cis.into_iter()
                    .filter(|ci| match ci {
                        ConsensusItem::ClientRequest(ClientRequest::Reissuance(req)) => req
                            .coins
                            .iter()
                            .all(|(_, coin)| *spent_coins.get(&coin).unwrap() == 1),
                        ConsensusItem::ClientRequest(ClientRequest::PegOut(req)) => req
                            .coins
                            .iter()
                            .all(|(_, coin)| *spent_coins.get(&coin).unwrap() == 1),
                        ConsensusItem::ClientRequest(ClientRequest::PegIn(req)) => {
                            *used_peg_in_proofs.get(&req.proof.identity()).unwrap() == 1
                        }
                        _ => true,
                    })
                    .map(move |ci| (peer, ci))
            })
            .unique_by(|(_, contribution)| contribution.clone())
            .collect::<Vec<_>>();

        // TODO: implement own parallel execution to avoid allocations and get rid of rayon
        let par_db_batches = filtered_consensus_outcome
            .into_par_iter()
            .map(|(peer, ci)| {
                trace!("Processing consensus item {:?} from peer {}", ci, peer);
                let mut db_batch = DbBatch::new();
                db_batch.autocommit(|batch_tx| batch_tx.append_maybe_delete(ci.clone()));

                match ci {
                    ConsensusItem::ClientRequest(client_request) => {
                        self.process_client_request(db_batch.transaction(), peer, client_request);
                    }
                    ConsensusItem::PartiallySignedRequest(id, psig) => {
                        self.process_partial_signature(db_batch.transaction(), peer, id, psig);
                    }
                    ConsensusItem::Wallet(_) => {}
                }
                db_batch
            })
            .collect::<Vec<_>>();
        db_batch.autocommit(|tx| tx.append_from_accumulators(par_db_batches.into_iter()));

        // Apply all consensus-critical changes atomically to the DB
        self.db.apply_batch(db_batch).expect("DB error");

        // Now that we have updated the DB with the epoch results also try to combine signatures
        let mut db_batch = DbBatch::new();
        self.finalize_signatures(db_batch.transaction());
        self.db.apply_batch(db_batch).expect("DB error");

        wallet_ci
    }

    pub async fn get_consensus_proposal(
        &self,
        wallet_consensus: WalletConsensusItem,
    ) -> Vec<ConsensusItem> {
        debug!("Wallet proposal: {:?}", wallet_consensus);

        // Fetch long lived CIs and concatenate with transient wallet CI
        self.db
            .find_by_prefix(&AllConsensusItemsKeyPrefix)
            .map(|res| res.map(|(ci, ())| ci))
            .chain(std::iter::once(Ok(ConsensusItem::Wallet(wallet_consensus))))
            .collect::<Result<_, DatabaseError>>()
            .expect("DB error")
    }

    fn process_client_request(&self, batch: BatchTx, peer: u16, cr: ClientRequest) {
        match cr {
            ClientRequest::PegIn(peg_in) => self.process_peg_in_request(batch, peg_in),
            ClientRequest::Reissuance(reissuance) => {
                self.process_reissuance_request(batch, peer, reissuance)
            }
            ClientRequest::PegOut(req) => self.process_peg_out_request(batch, peer, req),
        }
    }

    fn process_peg_in_request(&self, mut batch: BatchTx, peg_in: PegInRequest) {
        // TODO: maybe deduplicate verification logic
        let peg_in_amount = match self
            .wallet
            .claim_pegin(batch.subtransaction(), &peg_in.proof)
        {
            Some(res) => res,
            None => {
                warn!("Received invalid peg-in request from consensus: invalid proof");
                return;
            }
        };

        if !musig::verify(
            peg_in.id().as_hash().into_inner(),
            peg_in.sig.clone(),
            &[peg_in.proof.tweak_contract_key()],
        ) {
            warn!("Received invalid peg-in request from consensus: invalid signature");
            return;
        }

        if peg_in_amount != peg_in.blind_tokens.0.amount() {
            // TODO: improve abort communication
            warn!("Received invalid peg-in request from consensus: mismatching amount");
            return;
        }

        let peg_in_id = peg_in.id();
        debug!("Signing peg-in request {}", peg_in_id);
        let signed_req = match self.mint.sign(peg_in.blind_tokens) {
            Ok(signed_req) => signed_req,
            Err(e) => {
                warn!(
                    "Error signing a proposed peg-in, proposing peer might be faulty: {}",
                    e
                );
                return;
            }
        };

        batch.append_insert_new(
            ConsensusItem::PartiallySignedRequest(peg_in_id, signed_req.clone()),
            (),
        );
        batch.append_insert_new(
            PartialSignatureKey {
                request_id: peg_in_id,
                peer_id: self.cfg.identity,
            },
            BincodeSerialized::owned(signed_req),
        );
        batch.commit()
    }

    fn process_reissuance_request(
        &self,
        mut batch: BatchTx,
        peer: u16,
        reissuance: ReissuanceRequest,
    ) {
        let reissuance_id = reissuance.id();

        let signed_request = match self.mint.reissue(
            &self.db,
            batch.subtransaction(),
            reissuance.coins.clone(),
            reissuance.blind_tokens.clone(),
        ) {
            Ok(psr) => psr,
            Err(e) => {
                warn!(
                    "Rejected reissuance request proposed by peer {}, reason: {} (id: {})",
                    peer, e, reissuance_id
                );
                return;
            }
        };
        debug!("Signed reissuance request {}", reissuance_id);

        batch.append_insert_new(
            ConsensusItem::PartiallySignedRequest(reissuance_id, signed_request.clone()),
            (),
        );

        let our_sig_key = PartialSignatureKey {
            request_id: reissuance_id,
            peer_id: self.cfg.identity,
        };
        let our_sig = BincodeSerialized::owned(signed_request);
        batch.append_insert_new(our_sig_key, our_sig);
        batch.commit()
    }

    fn process_peg_out_request(&self, mut batch: BatchTx, peer: u16, peg_out: PegOutRequest) {
        let id = peg_out.id();

        let pub_keys = peg_out
            .coins
            .iter()
            .map(|(_, coin)| coin.spend_key())
            .collect::<Vec<_>>();
        if !musig::verify(peg_out.id().into_inner(), peg_out.sig.clone(), &pub_keys) {
            warn!("Peer {} proposed an invalid peg-out request: sig.", peer);
            return;
        }

        let amount = bitcoin::Amount::from_sat(
            (peg_out.coins.amount().milli_sat / 1000) - self.cfg.wallet.per_utxo_fee.as_sat(),
        );

        if let Err(e) = self
            .mint
            .spend(&self.db, batch.subtransaction(), peg_out.coins)
        {
            warn!("Peer {} proposed an invalid peg-out: {}", peer, e);
            return;
        }

        if let Err(e) =
            self.wallet
                .queue_pegout(batch.subtransaction(), id, peg_out.address, amount)
        {
            warn!("Queuing of peg-out failed: {}", e);
            return;
        }

        batch.commit()
    }

    fn process_partial_signature(
        &self,
        mut batch: BatchTx,
        peer: u16,
        req_id: TransactionId,
        partial_sig: PartialSigResponse,
    ) {
        let is_finalized = self
            .db
            .get_value::<_, DummyValue>(&FinalizedSignatureKey {
                issuance_id: req_id,
            })
            .expect("DB error")
            .is_some();

        if peer == self.cfg.identity {
            trace!("Received own sig share for issuance {}, ignoring", req_id);
        } else if is_finalized {
            trace!(
                "Received sig share for finalized issuance {}, ignoring",
                req_id
            );
        } else {
            debug!(
                "Received sig share from peer {} for issuance {}",
                peer, req_id
            );
            batch.append_insert_new(
                PartialSignatureKey {
                    request_id: req_id,
                    peer_id: peer,
                },
                BincodeSerialized::owned(partial_sig),
            );
            batch.commit();
        }
    }

    fn finalize_signatures(&self, mut batch: BatchTx) {
        let req_psigs = self
            .db
            .find_by_prefix::<_, PartialSignatureKey, BincodeSerialized<PartialSigResponse>>(
                &AllPartialSignaturesKey,
            )
            .map(|entry_res| {
                let (key, value) = entry_res.expect("DB error");
                (key.request_id, (key.peer_id as usize, value.into_owned()))
            })
            .into_group_map();

        // TODO: use own par iter impl that allows efficient use of accumulators
        let par_batches = req_psigs
            .into_par_iter()
            .filter_map(|(issuance_id, shares)| {
                let mut batch = DbBatch::new();
                let mut batch_tx = batch.transaction();

                if shares.len() > self.tbs_threshold() {
                    debug!(
                        "Trying to combine sig shares for issuance request {}",
                        issuance_id
                    );
                    let (bsig, errors) = self.mint.combine(shares.clone());
                    // FIXME: validate shares before writing to DB to make combine infallible
                    if !errors.0.is_empty() {
                        warn!("Peer sent faulty share: {:?}", errors);
                    }

                    match bsig {
                        Ok(bsig) => {
                            debug!(
                                "Successfully combined signature shares for issuance request {}",
                                issuance_id
                            );

                            batch_tx.append_from_iter(
                                self.db
                                    .find_by_prefix::<_, ConsensusItem, ()>(
                                        &ConsensusItemKeyPrefix(issuance_id),
                                    )
                                    .map(|res| {
                                        let key = res.expect("DB error").0;
                                        BatchItem::delete(key)
                                    }),
                            );

                            batch_tx.append_from_iter(shares.into_iter().map(|(peer, _)| {
                                BatchItem::delete(PartialSignatureKey {
                                    request_id: issuance_id,
                                    peer_id: peer as u16,
                                })
                            }));

                            let sig_key = FinalizedSignatureKey { issuance_id };
                            let sig_value = BincodeSerialized::owned(bsig);
                            batch_tx.append_insert_new(sig_key, sig_value);
                            batch_tx.commit();
                            Some(batch)
                        }
                        Err(e) => {
                            error!("Could not combine shares: {}", e);
                            None
                        }
                    }
                } else {
                    None
                }
            })
            .collect::<Vec<_>>();
        batch.append_from_accumulators(par_batches.into_iter());
        batch.commit();
    }

    fn tbs_threshold(&self) -> usize {
        self.cfg.peers.len() - self.cfg.max_faulty() - 1
    }
}

#[derive(Debug, Error)]
pub enum ClientRequestError {
    #[error("Client Reuqest was not authorized with a valid signature")]
    InvalidTransactionSignature,
    #[error("Client request was denied by mint: {0}")]
    DeniedByMint(MintError),
    #[error("Invalid peg-in")]
    InvalidPegIn,
    #[error("Client request uses invalid amount tier: {0}")]
    InvalidAmountTier(Amount),
}

impl From<MintError> for ClientRequestError {
    fn from(e: MintError) -> Self {
        ClientRequestError::DeniedByMint(e)
    }
}

impl From<InvalidAmountTierError> for ClientRequestError {
    fn from(e: InvalidAmountTierError) -> Self {
        ClientRequestError::InvalidAmountTier(e.0)
    }
}
