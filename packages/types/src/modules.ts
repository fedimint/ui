import { Network } from './bitcoin';
import { ModuleConsensusVersion } from './federation';
export enum ModuleKind {
  Ln = 'ln',
  LnV2 = 'lnv2',
  Mint = 'mint',
  Wallet = 'wallet',
  Meta = 'meta',
  Unknown = 'unknown',
}

export type ModuleConfigs = {
  [ModuleKind.Ln]: {
    kind: ModuleKind.Ln;
    fee_consensus: {
      contract_input: number;
      contract_output: number;
    };
    network: Network;
    threshold_pub_key: string;
  };
  [ModuleKind.Mint]: {
    kind: ModuleKind.Mint;
    fee_consensus: {
      note_issuance_abs: number;
      note_spend_abs: number;
    };
    max_notes_per_denomination: number;
    peer_tbs_pks: Record<number, Record<number, string>>;
  };
  [ModuleKind.Wallet]: {
    kind: ModuleKind.Wallet;
    default_bitcoin_rpc: BitcoinRpc;
    fee_consensus: {
      peg_in_abs: number;
      peg_out_abs: number;
    };
    finality_delay: number;
    network: Network;
    peg_in_descriptor: string;
  };
  [ModuleKind.LnV2]: {
    kind: ModuleKind.LnV2;
    fee_consensus: {
      input: number;
      output: number;
    };
    network: Network;
    tpe_agg_pk: string;
    tpe_pks: Record<number, string>;
  };
  [ModuleKind.Meta]: {
    kind: ModuleKind.Meta;
  };
  [ModuleKind.Unknown]: {
    kind: ModuleKind.Unknown;
  };
};

// FIXME: why doesn't this have API versions? seems like it should ...
export interface FedimintModule {
  config: string;
  kind: ModuleKind;
  version: ModuleConsensusVersion;
}

export interface BitcoinRpc {
  kind: string;
  url: string;
}

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
export type MetaModuleParams = [
  ModuleKind.Meta,
  {
    consensus?: object;
    local?: object;
  }
];
export type OtherModuleParams = [
  string,
  { consensus?: object; local?: object }
];
export type AnyModuleParams =
  | LnModuleParams
  | MintModuleParams
  | WalletModuleParams
  | OtherModuleParams;
