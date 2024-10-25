import { useMemo } from 'react';

interface BalanceItem {
  ecash_balance_msats: number;
}

interface Balances {
  ecash_balances: BalanceItem[];
  lightning_balance_msats: number;
  onchain_balance_sats: number;
}

export function useBalanceCalculations(balances: Balances | undefined) {
  return useMemo(() => {
    if (!balances) {
      return {
        ecash: 0,
        lightning: 0,
        onchain: 0,
        total: 0,
      };
    }

    const ecashTotal = balances.ecash_balances.reduce(
      (total, item) => total + item.ecash_balance_msats,
      0
    );

    const onchainMsats = Number.isSafeInteger(balances.onchain_balance_sats * 1000)
      ? balances.onchain_balance_sats * 1000
      : throw new Error('Onchain balance too large for safe conversion');

    return {
      ecash: ecashTotal,
      lightning: balances.lightning_balance_msats,
      onchain: onchainMsats,
      total: [ecashTotal, balances.lightning_balance_msats, onchainMsats].reduce(
        (sum, value) => {
          const newSum = sum + value;
          if (!Number.isSafeInteger(newSum)) throw new Error('Balance overflow');
          return newSum;
        }, 0),
    } as const;
  }, [balances]);
}
