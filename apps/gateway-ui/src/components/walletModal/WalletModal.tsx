import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { FederationInfo } from '@fedimint/types';
import { capitalizeFirstLetters } from '../../utils';
import ReceiveEcash from './receive/ReceiveEcash';
// import ReceiveLightning from './receive/ReceiveLightning';
import ReceiveOnchain from './receive/ReceiveOnchain';
import SendEcash from './send/SendEcash';
// import SendLightning from './send/SendLightning';
import SendOnchain from './send/SendOnchain';
import { WalletActionSelector } from './WalletActionSelector';

export enum WalletModalAction {
  Receive = 'receive',
  Send = 'send',
}
export enum WalletModalType {
  Ecash = 'ecash',
  // Lightning = 'lightning',
  Onchain = 'onchain',
}

export interface WalletModalState {
  isOpen: boolean;
  action: WalletModalAction;
  type: WalletModalType;
  selectedFederation: FederationInfo | null;
}

interface WalletModalProps {
  federations: FederationInfo[];
  walletModalState: WalletModalState;
  setWalletModalState: (state: WalletModalState) => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  federations,
  walletModalState,
  setWalletModalState,
}) => {
  const { t } = useTranslation();
  const [showSelector, setShowSelector] = useState(true);

  const handleActionChange = (action: WalletModalAction) => {
    setWalletModalState({
      ...walletModalState,
      action,
    });
  };

  const handleTypeChange = (type: WalletModalType) => {
    setWalletModalState({
      ...walletModalState,
      type,
    });
  };

  const renderActionComponent = (
    federations: FederationInfo[],
    walletModalState: WalletModalState,
    setWalletModalState: (state: WalletModalState) => void
  ) => {
    const components = {
      [WalletModalAction.Receive]: {
        [WalletModalType.Ecash]: ReceiveEcash,
        // [WalletModalType.Lightning]: ReceiveLightning,
        [WalletModalType.Onchain]: ReceiveOnchain,
      },
      [WalletModalAction.Send]: {
        [WalletModalType.Ecash]: SendEcash,
        // [WalletModalType.Lightning]: SendLightning,
        [WalletModalType.Onchain]: SendOnchain,
      },
    };

    const Component =
      components[walletModalState.action][walletModalState.type];
    return Component ? (
      <Component
        {...{
          federations,
          walletModalState,
          setWalletModalState,
          setShowSelector,
        }}
      />
    ) : null;
  };

  return (
    <Modal
      isOpen={walletModalState.isOpen}
      onClose={() => {
        setWalletModalState({ ...walletModalState, isOpen: false });
        setShowSelector(true);
      }}
      size='md'
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {capitalizeFirstLetters(
            t(`wallet.${walletModalState.action}`) +
              ' ' +
              t(`wallet.${walletModalState.type}`)
          )}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={4}>
          {showSelector && (
            <WalletActionSelector
              action={walletModalState.action}
              type={walletModalState.type}
              onActionChange={handleActionChange}
              onTypeChange={handleTypeChange}
            />
          )}
          {renderActionComponent(
            federations,
            walletModalState,
            setWalletModalState
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
