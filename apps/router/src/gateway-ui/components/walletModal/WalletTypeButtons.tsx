import React from 'react';
import { Button, Flex } from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { FaRegMoneyBillAlt, FaBitcoin, FaBolt } from 'react-icons/fa';
import { WalletModalType } from '../../../types/gateway';

interface WalletTypeButtonsProps {
  type: WalletModalType;
  onTypeChange: (type: WalletModalType) => void;
}

export const WalletTypeButtons: React.FC<WalletTypeButtonsProps> = ({
  type,
  onTypeChange,
}) => {
  const { t } = useTranslation();

  return (
    <Flex justifyContent='space-between' flexWrap='wrap'>
      {Object.values(WalletModalType).map((modalType) => (
        <Button
          key={modalType}
          variant={type === modalType ? 'solid' : 'outline'}
          colorScheme={type === modalType ? 'blue' : 'gray'}
          color={type === modalType ? 'white' : 'gray.500'}
          onClick={() => onTypeChange(modalType)}
          flex='1 0 30%'
          mx={1}
          my={2}
          borderRadius='full'
          leftIcon={
            modalType === WalletModalType.Ecash ? (
              <FaRegMoneyBillAlt />
            ) : modalType === WalletModalType.Onchain ? (
              <FaBitcoin />
            ) : (
              <FaBolt />
            )
          }
        >
          {t(`wallet.${modalType}`)}
        </Button>
      ))}
    </Flex>
  );
};
