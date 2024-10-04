import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@chakra-ui/react';
import { FiExternalLink } from 'react-icons/fi';
import { useTranslation } from '@fedimint/utils';
import { ServiceCheckApi } from '../../api/ServiceCheckApi';
import { useUnlockedService } from '../../hooks/useUnlockedService';

interface ViewServiceButtonProps {
  type: 'guardian' | 'gateway';
  id: string;
  baseUrl: string;
}

export const ViewServiceButton: React.FC<ViewServiceButtonProps> = ({
  type,
  id,
  baseUrl,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { decryptedServicePassword } = useUnlockedService(id, type);

  const handleClick = async () => {
    setIsLoading(true);
    const api = new ServiceCheckApi();

    try {
      if (!decryptedServicePassword) {
        throw new Error('Service password not found');
      }

      await api.check(baseUrl, decryptedServicePassword);
      navigate(`/${type}/${id}`);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Service password not found') {
          setErrorMessage(t('errors.service-password-not-found'));
        } else {
          setErrorMessage(t('errors.check-service-password'));
        }
      } else {
        setErrorMessage(t('errors.unknown-error'));
      }
      onOpen();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        rightIcon={<FiExternalLink />}
        size='sm'
        colorScheme='blue'
        onClick={handleClick}
        isLoading={isLoading}
      >
        {t('common.view')}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('errors.auth-error')}</ModalHeader>
          <ModalBody>
            <Text>{errorMessage}</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              {t('common.close')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
