// Meta congig entries
export type MetaConfig = { federation_name?: string } & Record<
  string,
  string | undefined
>;

// Meta config entries in list format
export type MetaFields = [string, string][];

// Meta submission entries with the values encoded as hex strings
export interface MetaSubmissions {
  [peerId: string]: string;
}

// Meta properties in consensus, with the values encoded as hex strings
export interface ConsensusMeta {
  revision: number;
  value: string;
}
