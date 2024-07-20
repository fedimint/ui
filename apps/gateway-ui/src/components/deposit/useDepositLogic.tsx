import React from 'react';
import { useCallback, useState } from 'react';
import { Network } from '@fedimint/types';
import { ApiContext } from '../../ApiProvider';

export const useDepositLogic = (federationId: string, network?: Network) => {
  const { gateway } = React.useContext(ApiContext);
  const [address, setAddress] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [error, setError] = useState<string>('');

  const createDepositAddress = useCallback(() => {
    gateway
      .fetchAddress(federationId)
      .then((newAddress) => {
        const bip21Uri = `bitcoin:${newAddress}${
          amount > 0 ? `?amount=${amount / 100000000}` : ''
        }`;
        setAddress(bip21Uri);
        setError('');
      })
      .catch(({ message, error }) => {
        console.error(error);
        setError(message);
      });
  }, [federationId, gateway, amount]);

  const getAddressUrl = useCallback(
    (address: string): URL => {
      const baseAddress = address.split(':')[1]?.split('?')[0] || '';
      switch (network) {
        case Network.Signet:
          return new URL(`https://mutinynet.com/address/${baseAddress}`);
        case Network.Testnet:
          return new URL(
            `https://mempool.space/testnet/address/${baseAddress}`
          );
        case Network.Bitcoin:
        case Network.Regtest:
        default:
          return new URL(`https://mempool.space/address/${baseAddress}`);
      }
    },
    [network]
  );

  return {
    address,
    amount,
    error,
    setAmount,
    createDepositAddress,
    getAddressUrl,
  };
};
