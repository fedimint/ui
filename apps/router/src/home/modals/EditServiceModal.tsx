import React, { useCallback, useEffect, useState } from 'react';
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
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { sha256Hash, useTranslation } from '@fedimint/utils';
import { useAppContext } from '../../context/hooks';
import { APP_ACTION_TYPE, AppAction } from '../../context/AppContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { decrypt } from '../../utils/crypto';
import { useMasterPassword } from '../../hooks/useMasterPassword';

interface EditServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: { type: 'guardian' | 'gateway'; id: string };
  serviceUrl: string;
}

export const EditServiceModal: React.FC<EditServiceModalProps> = ({
  isOpen,
  onClose,
  service,
  serviceUrl,
}) => {
  const { t } = useTranslation();
  const [configUrl, setConfigUrl] = useState(serviceUrl);
  const [passwordFetched, setPasswordFetched] = useState(false);
  const [password, setPassword] = useState('');
  const { masterPassword } = useMasterPassword();
  const [showPassword, setShowPassword] = useState(false);
  const { dispatch, guardians, gateways } = useAppContext();
  const {
    storeGuardianPassword,
    storeGatewayPassword,
    getEncryptedGuardianPassword,
    getEncryptedGatewayPassword,
  } = useAuthContext();
  const toast = useToast();
  const getPassword = useCallback(async () => {
    if (!masterPassword) {
      return '';
    }
    const encryptedPassword =
      service.type === 'guardian'
        ? getEncryptedGuardianPassword(service.id)
        : getEncryptedGatewayPassword(service.id);
    return encryptedPassword
      ? await decrypt(masterPassword, encryptedPassword)
      : '';
  }, [
    service.type,
    service.id,
    getEncryptedGuardianPassword,
    getEncryptedGatewayPassword,
    masterPassword,
  ]);

  useEffect(() => {
    const fetchPassword = async () => {
      if (!passwordFetched) {
        const currentPassword = await getPassword();
        setPassword(currentPassword || '');
        setPasswordFetched(true);
      }
    };
    fetchPassword();
  }, [getPassword, passwordFetched]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setPasswordFetched(false);
      setPassword('');
      setConfigUrl(serviceUrl);
    }
  }, [isOpen, serviceUrl]);

  const handleSubmit = async () => {
    if (service) {
      try {
        console.log(`Attempting to update ${service.type} service`);

        // Check if only the password has changed
        const isOnlyPasswordChanged = configUrl === serviceUrl;

        if (isOnlyPasswordChanged) {
          console.log(
            `Updating password for ${service.type} service with ID: ${service.id}`
          );
          if (service.type === 'guardian') {
            storeGuardianPassword(service.id, password);
          } else {
            storeGatewayPassword(service.id, password);
          }
        } else {
          const newId = await sha256Hash(configUrl);
          console.log(`New service ID: ${newId}`);

          // Check if the new URL already exists
          const serviceExists = Object.values({
            ...guardians,
            ...gateways,
          }).some((s) => s.config.baseUrl === configUrl && s.id !== service.id);

          if (serviceExists) {
            console.error('Service with this URL already exists');
            throw new Error('A service with this URL already exists');
          }

          console.log(
            `Removing old ${service.type} service with ID: ${service.id}`
          );
          // Remove old service
          dispatch({
            type:
              service.type === 'guardian'
                ? APP_ACTION_TYPE.REMOVE_GUARDIAN
                : APP_ACTION_TYPE.REMOVE_GATEWAY,
            payload: service.id,
          });

          // Add new service
          const newPayload = {
            id: newId,
            [service.type]: { config: { baseUrl: configUrl } },
          };
          console.log(`Adding new ${service.type} service:`, newPayload);

          dispatch({
            type:
              service.type === 'guardian'
                ? APP_ACTION_TYPE.ADD_GUARDIAN
                : APP_ACTION_TYPE.ADD_GATEWAY,
            payload: newPayload,
          } as AppAction);

          // Update password for the new service
          console.log(
            `Updating password for ${service.type} service with ID: ${newId}`
          );
          if (service.type === 'guardian') {
            storeGuardianPassword(newId, password);
          } else {
            storeGatewayPassword(newId, password);
          }
        }

        onClose();
        console.log('Service update completed successfully');
        toast({
          title: 'Service updated',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error('Error updating service:', error);
        toast({
          title: 'Error updating service',
          description:
            error instanceof Error
              ? error.message
              : 'An unknown error occurred',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {t('home.edit-service-modal.title', {
            type: service.type.charAt(0).toUpperCase() + service.type.slice(1),
          })}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>{t('home.edit-service-modal.url-label')}</FormLabel>
            <Input
              value={configUrl}
              onChange={(e) => setConfigUrl(e.target.value)}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>{t('home.edit-service-modal.password-label')}</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputRightElement>
                <IconButton
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  icon={showPassword ? <FiEyeOff /> : <FiEye />}
                  onClick={() => setShowPassword(!showPassword)}
                  variant='ghost'
                  size='sm'
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Button mt={4} colorScheme='blue' onClick={handleSubmit}>
            {t('common.save')}
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
