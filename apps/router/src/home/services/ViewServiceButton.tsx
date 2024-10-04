import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  useDisclosure,
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  ModalBody,
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
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { decryptedServicePassword } = useUnlockedService(id, type);

  const handleClick = async () => {
    setIsLoading(true);
    const api = new ServiceCheckApi();

    try {
      const checkResult = await api.check(baseUrl, decryptedServicePassword);

      if (
        checkResult.status === 'awaiting_password' ||
        checkResult.status === 'Setup'
      ) {
        // Allow navigation if the service is awaiting password or in setup
        navigate(`/${type}/${id}`);
      } else if (checkResult.requiresPassword && !decryptedServicePassword) {
        throw new Error('Service password not found');
      } else {
        navigate(`/${type}/${id}`);
      }
    } catch (error) {
      console.error('Service check error:', error);
      onOpen();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Button
        rightIcon={<FiExternalLink />}
        size='sm'
        colorScheme='blue'
        onClick={handleClick}
        isLoading={isLoading}
        mb={2}
      >
        {t('common.view')}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <Alert status='warning' mt={2}>
              <AlertIcon />
              <Box>
                <AlertTitle>{t('errors.auth-error')}</AlertTitle>
                <AlertDescription>
                  {t('errors.auth-error-message')}
                </AlertDescription>
              </Box>
            </Alert>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              {t('common.close')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
