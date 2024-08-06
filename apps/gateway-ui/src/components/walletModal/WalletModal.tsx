import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Flex,
} from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { FederationInfo } from '@fedimint/types';
import { capitalizeFirstLetters } from '../../utils';
import DepositEcash from './deposit/DepositEcash';
import DepositLightning from './deposit/DepositLightning';
import DepositOnchain from './deposit/DepositOnchain';
import WithdrawEcash from './withdraw/WithdrawEcash';
import WithdrawLightning from './withdraw/WithdrawLightning';
import WithdrawOnchain from './withdraw/WithdrawOnchain';

export enum WalletModalAction {
  Deposit = 'deposit',
  Withdraw = 'withdraw',
}
export enum WalletModalType {
  Ecash = 'ecash',
  Lightning = 'lightning',
  Onchain = 'onchain',
}

export interface WalletModalState {
  isOpen: boolean;
  action: WalletModalAction;
  type: WalletModalType;
  selectedFederation: FederationInfo | null;
}

interface WalletModalProps {
  walletModalState: WalletModalState;
  setWalletModalState: (state: WalletModalState) => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  walletModalState,
  setWalletModalState,
}) => {
  const { t } = useTranslation();

  const handleActionChange = (index: number) => {
    setWalletModalState({
      ...walletModalState,
      action:
        index === 0 ? WalletModalAction.Deposit : WalletModalAction.Withdraw,
    });
  };

  const handleTypeChange = (index: number) => {
    setWalletModalState({
      ...walletModalState,
      type: Object.values(WalletModalType)[index],
    });
  };

  const renderActionComponent = () => {
    const components = {
      [WalletModalAction.Deposit]: {
        [WalletModalType.Ecash]: DepositEcash,
        [WalletModalType.Lightning]: DepositLightning,
        [WalletModalType.Onchain]: DepositOnchain,
      },
      [WalletModalAction.Withdraw]: {
        [WalletModalType.Ecash]: WithdrawEcash,
        [WalletModalType.Lightning]: WithdrawLightning,
        [WalletModalType.Onchain]: WithdrawOnchain,
      },
    };

    const Component =
      components[walletModalState.action][walletModalState.type];
    return Component ? <Component /> : null;
  };

  return (
    <Modal
      isOpen={walletModalState.isOpen}
      onClose={() =>
        setWalletModalState({ ...walletModalState, isOpen: false })
      }
      size='md'
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('wallet-modal.title')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex gap={2} flexDir='column'>
            <Flex justifyContent='space-between'>
              <Button
                variant={
                  walletModalState.action === WalletModalAction.Deposit
                    ? 'solid'
                    : 'outline'
                }
                colorScheme='blue'
                onClick={() => handleActionChange(0)}
                flex={1}
                mr={2}
                borderRadius='full'
              >
                {t('wallet.deposit')}
              </Button>
              <Button
                variant={
                  walletModalState.action === WalletModalAction.Withdraw
                    ? 'solid'
                    : 'outline'
                }
                colorScheme='blue'
                onClick={() => handleActionChange(1)}
                flex={1}
                ml={2}
                borderRadius='full'
              >
                {t('wallet.withdraw')}
              </Button>
            </Flex>

            <Flex justifyContent='space-between' flexWrap='wrap'>
              {Object.values(WalletModalType).map((type, index) => (
                <Button
                  key={type}
                  variant={walletModalState.type === type ? 'solid' : 'outline'}
                  colorScheme={'blue'}
                  onClick={() => handleTypeChange(index)}
                  flex='1 0 30%'
                  mx={1}
                  borderRadius='full'
                >
                  {t(type)}
                </Button>
              ))}
            </Flex>
          </Flex>
          <ModalHeader fontSize='xl' fontWeight='bold' textAlign='center'>
            {capitalizeFirstLetters(
              t(`wallet.${walletModalState.action}`) +
                ' ' +
                t(`wallet.${walletModalState.type}`)
            )}
          </ModalHeader>
          {renderActionComponent()}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
