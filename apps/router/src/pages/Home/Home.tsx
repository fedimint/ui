import React, { useState } from 'react';
import { Box, Button, Flex, useDisclosure } from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { FiPlus } from 'react-icons/fi';
import { ConnectServiceModal } from '../../modals/ConnectServiceModal';
import { useAppContext } from '../../hooks';
import { EditServiceModal } from '../../modals/EditServiceModal';
import { RemoveServiceModal } from '../../modals/RemoveServiceModal';
import { NoConnectedServices } from '../../components/NoConnectedServices';
import { ServiceTable } from '../../components/ServiceTable';

const HomePage: React.FC = () => {
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

  const numGuardians = Object.keys(guardians).length;
  const numGateways = Object.keys(gateways).length;
  const numServices = numGuardians + numGateways;

  return (
    <Box width='100%' maxWidth='1200px' margin='auto' paddingY='8'>
      {numServices > 0 && (
        <Flex justifyContent='flex-end' alignItems='center' marginBottom='6'>
          <Button
            leftIcon={<FiPlus />}
            onClick={onOpen}
            colorScheme='blue'
            aria-label='connect-service-btn'
          >
            {t('home.connect-service-modal.label')}
          </Button>
        </Flex>
      )}

      {numGuardians > 0 && (
        <ServiceTable
          services={guardians}
          type='guardian'
          heading='Guardians'
          setEditingService={setEditingService}
          setRemovingService={setRemovingService}
        />
      )}
      {numGateways > 0 && (
        <ServiceTable
          services={gateways}
          type='gateway'
          heading='Gateways'
          setEditingService={setEditingService}
          setRemovingService={setRemovingService}
        />
      )}
      {numServices === 0 && <NoConnectedServices onOpen={onOpen} />}

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

export default HomePage;
