import React from 'react';
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
import ReceiveLightning from './receive/ReceiveLightning';
import ReceiveOnchain from './receive/ReceiveOnchain';
import SendEcash from './send/SendEcash';
import SendLightning from './send/SendLightning';
import SendOnchain from './send/SendOnchain';
import { useGatewayContext } from '../../../hooks';
import { GATEWAY_APP_ACTION_TYPE } from '../../../types/gateway';

export const WalletModal: React.FC = () => {
  const { t } = useTranslation();
  const { state, dispatch } = useGatewayContext();

  const renderActionComponent = () => {
    const components = {
      receive: {
        ecash: ReceiveEcash,
        lightning: ReceiveLightning,
        onchain: ReceiveOnchain,
      },
      send: {
        ecash: SendEcash,
        lightning: SendLightning,
        onchain: SendOnchain,
      },
    };

    const Component =
      components[state.walletModalState.action][state.walletModalState.type];
    return Component ? <Component /> : null;
  };

  const getModalTitle = () => {
    const action = t(`wallet.${state.walletModalState.action}`);
    const type = t(`wallet.${state.walletModalState.type}`);

    // Special cases for peg-in/peg-out
    if (state.walletModalState.type === 'onchain') {
      if (state.walletModalState.action === 'receive') {
        return t('wallet.peg-in');
      }
      if (state.walletModalState.action === 'send') {
        return t('wallet.peg-out');
      }
    }

    return capitalizeFirstLetters(`${action} ${type}`);
  };

  return (
    <Modal
      isOpen={state.walletModalState.isOpen}
      onClose={() => {
        dispatch({
          type: GATEWAY_APP_ACTION_TYPE.SET_WALLET_MODAL_STATE,
          payload: {
            ...state.walletModalState,
            isOpen: false,
          },
        });
      }}
      size='md'
      isCentered
    >
      <ModalOverlay bg='blackAlpha.700' backdropFilter='blur(5px)' />
      <ModalContent>
        <ModalHeader fontSize='xl' fontWeight='bold'>
          {getModalTitle()}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>{renderActionComponent()}</ModalBody>
      </ModalContent>
    </Modal>
  );
};
