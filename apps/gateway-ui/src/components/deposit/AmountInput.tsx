import React from 'react';
import {
  Text,
  useTheme,
  InputGroup,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';

interface AmountInputProps {
  amount: number;
  setAmount: (amount: number) => void;
}

export const AmountInput: React.FC<AmountInputProps> = ({
  amount,
  setAmount,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <InputGroup flexDir='column'>
      <Text
        fontSize='sm'
        fontWeight='500'
        color={theme.colors.gray[700]}
        fontFamily={theme.fonts.body}
        pb='6px'
      >
        {`${t('common.amount')} ${t('common.sats')}`}
      </Text>
      <NumberInput
        min={0}
        value={amount}
        onChange={(value) => setAmount(parseInt(value) || 0)}
      >
        <NumberInputField
          height='44px'
          p='14px'
          border={`1px solid ${theme.colors.gray[300]}`}
          bgColor={theme.colors.white}
          boxShadow={theme.shadows.xs}
          borderRadius='8px'
          w='100%'
        />
      </NumberInput>
    </InputGroup>
  );
};
