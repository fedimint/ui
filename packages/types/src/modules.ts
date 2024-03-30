import { Network } from './bitcoin';
import { ModuleConsensusVersion } from './federation';
export enum ModuleKind {
  Ln = 'ln',
  Mint = 'mint',
  Wallet = 'wallet',
}

// FIXME: why doesn't this have API versions? seems like it should ...
export interface FedimintModule {
  config: string;
  kind: ModuleKind;
  version: ModuleConsensusVersion;
}

// Consider sharing these types with types/setup.ts *ModuleParams? Need to
// confirm that setup API returns identical types to the admin API.
interface ModuleConfigs {
  [ModuleKind.Ln]: {
    network: Network;
    fee_consensus: {
      contract_input: number;
      contract_output: number;
    };
  };
  [ModuleKind.Mint]: {
    fee_consensus: {
      note_issuance_abs: number;
      note_spend_abs: number;
    };
    max_notes_per_denomination: number;
    peer_tbs_pks: Record<number, Record<number, string>>;
  };
  [ModuleKind.Wallet]: {
    client_default_bitcoin_rpc: BitcoinRpc;
    default_fee: { sats_per_kvb: number };
    fee_consensus: {
      peg_in_abs: number;
      peg_out_abs: number;
    };
    finality_delay: number;
    network: Network;
    peer_peg_in_keys: Record<number, { key: string }>;
    peg_in_descriptor: number;
  };
}

export interface BitcoinRpc {
  kind: string;
  url: string;
}

export type ModuleConfig<T extends ModuleKind = ModuleKind> = {
  kind: T;
} & ModuleConfigs[T];

export type LnModuleParams = [
  ModuleKind.Ln,
  {
    consensus: object;
    local: object;
  }
];
export type MintModuleParams = [
  ModuleKind.Mint,
  {
    consensus: { mint_amounts: number[] };
    local: object;
  }
];
export type WalletModuleParams = [
  ModuleKind.Wallet,
  {
    consensus: {
      finality_delay: number;
      network: Network;
      client_default_bitcoin_rpc: BitcoinRpc;
    };
    local: {
      bitcoin_rpc: BitcoinRpc;
    };
  }
];
export type OtherModuleParams = [string, { consensus: object; local: object }];
export type AnyModuleParams =
  | LnModuleParams
  | MintModuleParams
  | WalletModuleParams
  | OtherModuleParams;
