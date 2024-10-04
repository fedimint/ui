import React, { useState } from 'react';
import { Box, Button, Flex, Heading, useDisclosure } from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { ConnectServiceModal } from './modals/connectServiceModal/ConnectServiceModal';
import { useAppContext } from '../context/hooks';
import { EditServiceModal } from './modals/EditServiceModal';
import { RemoveServiceModal } from './modals/RemoveServiceModal';
import { NoConnectedServices } from './services/NoConnectedServices';
import { useMasterPassword } from '../hooks/useMasterPassword';
import { SetMasterPassword } from './SetMasterPassword';
import { ServicesList } from './services/ServicesList';
import { EnterMasterPassword } from './EnterMasterPassword';

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { guardians, gateways } = useAppContext();
  const { isMasterPasswordSet, masterPassword } = useMasterPassword();
  const [editingService, setEditingService] = useState<{
    type: 'guardian' | 'gateway';
    id: string;
  } | null>(null);
  const [removingService, setRemovingService] = useState<{
    type: 'guardian' | 'gateway';
    id: string;
  } | null>(null);
  const {
    isOpen: isConnectServiceOpen,
    onOpen: onConnectServiceOpen,
    onClose: onConnectServiceClose,
  } = useDisclosure();
  const {
    isOpen: isSetMasterPasswordOpen,
    onOpen: onSetMasterPasswordOpen,
    onClose: onSetMasterPasswordClose,
  } = useDisclosure();

  if (isMasterPasswordSet && !masterPassword) {
    return <EnterMasterPassword />;
  }

  const renderContent = () => {
    return (
      <>
        <Flex
          justifyContent='space-between'
          alignItems='center'
          marginBottom='6'
        >
          <Heading as='h1' size='xl'>
            {t('home.services')}
          </Heading>
          {masterPassword ? (
            <Button onClick={onConnectServiceOpen} colorScheme='blue'>
              {t('home.connect-service-modal.label')}
            </Button>
          ) : (
            <Button onClick={onSetMasterPasswordOpen} colorScheme='blue'>
              {t('home.master-password.create-master-password')}
            </Button>
          )}
        </Flex>
        {Object.keys(guardians).length > 0 && (
          <ServicesList
            guardians={guardians}
            gateways={gateways}
            setEditingService={setEditingService}
            setRemovingService={setRemovingService}
          />
        )}
        {Object.keys(guardians).length + Object.keys(gateways).length === 0 && (
          <NoConnectedServices />
        )}
      </>
    );
  };

  return (
    <Box width='100%' maxWidth='1200px' margin='auto' paddingY='8'>
      {renderContent()}

      <ConnectServiceModal
        isOpen={isConnectServiceOpen}
        onClose={onConnectServiceClose}
      />
      <SetMasterPassword
        isOpen={isSetMasterPasswordOpen}
        onClose={onSetMasterPasswordClose}
      />
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
