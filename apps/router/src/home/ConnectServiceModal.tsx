import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { GuardianConfig } from '../guardian-ui/GuardianApi';
import { useAppContext } from '../context/hooks';
import { APP_ACTION_TYPE } from '../context/AppContext';
import { GatewayConfig } from '../gateway-ui/types';

interface ConnectServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConnectServiceModal: React.FC<ConnectServiceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const [configUrl, setConfigUrl] = useState('');
  const { dispatch } = useAppContext();

  const handleSubmit = () => {
    const isWebSocket =
      configUrl.startsWith('ws://') || configUrl.startsWith('wss://');
    const isHttp =
      configUrl.startsWith('http://') || configUrl.startsWith('https://');

    if (isWebSocket) {
      const guardianConfig: GuardianConfig = { fm_config_api: configUrl };
      dispatch({
        type: APP_ACTION_TYPE.ADD_GUARDIAN,
        payload: {
          id: configUrl,
          guardian: { config: guardianConfig },
        },
      });
    } else if (isHttp) {
      const gatewayConfig: GatewayConfig = { baseUrl: configUrl };
      dispatch({
        type: APP_ACTION_TYPE.ADD_GATEWAY,
        payload: {
          id: configUrl,
          gateway: { config: gatewayConfig },
        },
      });
    } else {
      console.error('Invalid URL format');
      // You might want to show an error message to the user here
      return;
    }

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('home.addService', 'Add Service')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>{t('notConfigured.urlLabel')}</FormLabel>
            <Input
              placeholder='wss://fedimintd.my-awesome-domain.com:6000'
              value={configUrl}
              onChange={(e) => setConfigUrl(e.target.value)}
            />
          </FormControl>
          <Button mt={4} colorScheme='blue' onClick={handleSubmit}>
            {t('common.submit')}
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
