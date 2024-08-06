import React from 'react';
import { Button, Flex } from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { WalletModalAction, WalletModalType } from './WalletModal';

interface WalletActionSelectorProps {
  action: WalletModalAction;
  type: WalletModalType;
  onActionChange: (index: number) => void;
  onTypeChange: (index: number) => void;
}

export const WalletActionSelector: React.FC<WalletActionSelectorProps> = ({
  action,
  type,
  onActionChange,
  onTypeChange,
}) => {
  const { t } = useTranslation();

  return (
    <Flex gap={2} flexDir='column'>
      <Flex justifyContent='space-between'>
        <Button
          variant={action === WalletModalAction.Receive ? 'solid' : 'outline'}
          colorScheme='blue'
          onClick={() => onActionChange(0)}
          flex={1}
          mr={2}
          borderRadius='full'
        >
          {t('wallet.receive')}
        </Button>
        <Button
          variant={action === WalletModalAction.Send ? 'solid' : 'outline'}
          colorScheme='blue'
          onClick={() => onActionChange(1)}
          flex={1}
          ml={2}
          borderRadius='full'
        >
          {t('wallet.send')}
        </Button>
      </Flex>

      <Flex justifyContent='space-between' flexWrap='wrap'>
        {Object.values(WalletModalType).map((modalType, index) => (
          <Button
            key={modalType}
            variant={type === modalType ? 'solid' : 'outline'}
            colorScheme={'blue'}
            onClick={() => onTypeChange(index)}
            flex='1 0 30%'
            mx={1}
            borderRadius='full'
          >
            {t(`wallet.${modalType}`)}
          </Button>
        ))}
      </Flex>
    </Flex>
  );
};
