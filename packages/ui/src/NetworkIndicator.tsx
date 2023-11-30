import React, { FC } from 'react';

interface NetworkIndicatorProps {
  network: string;
  bitcoinRpcUrl: string;
}

export const NetworkIndicator: FC<NetworkIndicatorProps> = ({
  network,
  bitcoinRpcUrl,
}) => {
  let color: string;
  let name: string;

  switch (network) {
    case 'bitcoin':
      color = '#FF9900';
      name = 'Mainnet';
      break;
    case 'testnet':
      color = '#6BED33';
      name = 'Testnet';
      break;
    case 'signet':
      if (bitcoinRpcUrl === 'https://mutinynet.com/api') {
        color = 'red';
        name = 'Mutinynet';
      } else {
        color = 'purple';
        name = 'Signet';
      }
      break;
    case 'regtest':
      color = '#33C6EC';
      name = 'Regtest';
      break;
    default:
      color = 'gray';
      name = 'Unknown';
  }

  return <span style={{ color }}>{name}</span>;
};
