import React from 'react';
import {
  NumberInput,
  NumberInputField,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { Sats } from '@fedimint/types';

export const AmountInput: React.FC<{
  amount: Sats;
  setAmount: (amount: Sats) => void;
  unit: 'sats' | 'msats' | 'btc';
}> = ({ amount, setAmount, unit }) => {
  const { t } = useTranslation();
  return (
    <FormControl>
      <FormLabel>{t('wallet-modal.receive.enter-amount', { unit })}</FormLabel>
      <NumberInput
        value={amount}
        onChange={(_, value) => setAmount((value ? value : 0) as Sats)}
      >
        <NumberInputField
          placeholder={t('wallet-modal.receive.enter-amount', { unit })}
          height='60px'
          fontSize='md'
        />
      </NumberInput>
    </FormControl>
  );
};
