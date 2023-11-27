// Opaque numeric types to avoid mixing different denominations of bitcoin
type BitcoinUnit<K, T> = K & { _: T };
export type Btc = BitcoinUnit<number, 'Btc'>;
export type Sats = BitcoinUnit<number, 'Sats'>;
export type MSats = BitcoinUnit<number, 'MSats'>;

// Type adaptation from https://docs.rs/bitcoin/latest/bitcoin/network/enum.Network.html
export enum Network {
  Bitcoin = 'main',
  Testnet = 'test',
  Signet = 'signet',
  Regtest = 'regtest',
}
