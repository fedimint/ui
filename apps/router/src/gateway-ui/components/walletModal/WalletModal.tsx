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
import { capitalizeFirstLetters } from '../../utils';
import ReceiveEcash from './receive/ReceiveEcash';
// import ReceiveLightning from './receive/ReceiveLightning';
import ReceiveOnchain from './receive/ReceiveOnchain';
import SendEcash from './send/SendEcash';
// import SendLightning from './send/SendLightning';
import SendOnchain from './send/SendOnchain';
import { WalletActionSelector } from './WalletActionSelector';
import {
  GATEWAY_APP_ACTION_TYPE,
  WalletModalAction,
  WalletModalType,
} from '../../../types/gateway';
import { useGatewayContext } from '../../../hooks';

export const WalletModal: React.FC = () => {
  const { t } = useTranslation();
  const { state, dispatch } = useGatewayContext();
  const [showSelector, setShowSelector] = useState(true);

  const handleActionChange = (action: WalletModalAction) => {
    dispatch({
      type: GATEWAY_APP_ACTION_TYPE.SET_WALLET_MODAL_STATE,
      payload: {
        ...state.walletModalState,
        action,
      },
    });
  };

  const handleTypeChange = (type: WalletModalType) => {
    dispatch({
      type: GATEWAY_APP_ACTION_TYPE.SET_WALLET_MODAL_STATE,
      payload: {
        ...state.walletModalState,
        type,
      },
    });
  };

  const renderActionComponent = () => {
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
      components[state.walletModalState.action][state.walletModalState.type];
    return Component ? <Component /> : null;
  };

  return (
    <Modal
      isOpen={state.walletModalState.isOpen}
      onClose={() => {
        dispatch({
          type: GATEWAY_APP_ACTION_TYPE.SET_WALLET_MODAL_STATE,
          payload: { ...state.walletModalState, isOpen: false },
        });
        setShowSelector(true);
      }}
      size='md'
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {capitalizeFirstLetters(
            t(`wallet.${state.walletModalState.action}`) +
              ' ' +
              t(`wallet.${state.walletModalState.type}`)
          )}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {showSelector && (
            <WalletActionSelector
              action={state.walletModalState.action}
              type={state.walletModalState.type}
              onActionChange={handleActionChange}
              onTypeChange={handleTypeChange}
            />
          )}
          {renderActionComponent()}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
