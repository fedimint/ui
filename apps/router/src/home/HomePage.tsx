import React, { useState, useEffect } from 'react';
import { Box, Button, Flex, Heading, useDisclosure } from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { ConnectServiceModal } from './ConnectServiceModal';
import { useAppContext } from '../context/hooks';
import { EditServiceModal } from './EditServiceModal';
import { RemoveServiceModal } from './RemoveServiceModal';
import { NoConnectedServices } from './NoConnectedServices';
import { ServiceTable } from './ServiceTable';
import { useNotification } from './NotificationProvider';

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { guardians, gateways } = useAppContext();
  const [editingService, setEditingService] = useState<{
    type: 'guardian' | 'gateway';
    id: string;
  } | null>(null);
  const [removingService, setRemovingService] = useState<{
    type: 'guardian' | 'gateway';
    id: string;
  } | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { showError, showSuccess } = useNotification();

  useEffect(() => {
    try {
      // Simulate error
      throw new Error('Failed to connect to the service.');
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message);
      } else {
        showError('An unknown error occurred.');
      }
    }

    try {
      // Simulate a success
      showSuccess('Service connected successfully!');
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message);
      } else {
        showError('An unknown error occurred.');
      }
    }
  }, [showError, showSuccess]);

  return (
    <Box width='100%' maxWidth='1200px' margin='auto' paddingY='8'>
      <Flex justifyContent='space-between' alignItems='center' marginBottom='6'>
        <Heading as='h1' size='xl'>
          {t('home.services')}
        </Heading>
        <Button onClick={onOpen} colorScheme='blue'>
          {t('home.connect-service-modal.label')}
        </Button>
      </Flex>

      {Object.keys(guardians).length > 0 && (
        <ServiceTable
          services={guardians}
          type='guardian'
          setEditingService={setEditingService}
          setRemovingService={setRemovingService}
        />
      )}
      {Object.keys(gateways).length > 0 && (
        <ServiceTable
          services={gateways}
          type='gateway'
          setEditingService={setEditingService}
          setRemovingService={setRemovingService}
        />
      )}
      {Object.keys(guardians).length + Object.keys(gateways).length === 0 && (
        <NoConnectedServices />
      )}

      <ConnectServiceModal isOpen={isOpen} onClose={onClose} />
      {editingService && (
        <EditServiceModal
          isOpen={true}
          onClose={() => setEditingService(null)}
          service={editingService}
          serviceUrl={
            editingService.type === 'guardian'
              ? guardians[editingService.id].config.baseUrl
              : gateways[editingService.id].config.baseUrl
          }
        />
      )}
      {removingService && (
        <RemoveServiceModal
          isOpen={true}
          onClose={() => setRemovingService(null)}
          service={removingService}
        />
      )}
    </Box>
  );
};
