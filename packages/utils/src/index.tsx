import { Network } from '@fedimint/types';

export * from './i18n';
export * from './format';
export * from './meta';

export const getNodeUrl = (
  nodeId: string,
  network: Network = Network.Bitcoin
): URL => {
  switch (network) {
    case Network.Signet:
      return new URL(`https://mutinynet.com/lightning/node/${nodeId}`);
    case Network.Testnet:
      return new URL(`https://mempool.space/testnet/lightning/node/${nodeId}`);
    case Network.Bitcoin:
    case Network.Regtest:
      return new URL(`https://mempool.space/lightning/node/${nodeId}`);
  }
};
