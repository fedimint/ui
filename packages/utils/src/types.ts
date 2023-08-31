// Opaque numeric types to avoid mixing different denominations of bitcoin
type BitcoinUnit<K, T> = K & { _: T };
export type Btc = BitcoinUnit<number, 'Btc'>;
export type Sats = BitcoinUnit<number, 'Sats'>;
export type MSats = BitcoinUnit<number, 'MSats'>;
