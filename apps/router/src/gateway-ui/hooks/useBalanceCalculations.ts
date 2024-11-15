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

    const onchainMsats = balances.onchain_balance_sats * 1000;

    return {
      ecash: ecashTotal,
      lightning: balances.lightning_balance_msats,
      onchain: onchainMsats,
      total: ecashTotal + balances.lightning_balance_msats + onchainMsats,
    } as const;
  }, [balances]);
}
