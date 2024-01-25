import React, { useContext, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Flex,
} from '@chakra-ui/react';
import { ApiContext } from '../ApiProvider';
import { useTranslation } from '@fedimint/utils';

export interface FedNameCardProps {
  title: string;
  federationId?: string;
  balanceMsat?: number;
  children: React.ReactNode;
}

export const FedNameCard = React.memo(function FedNameCard({
  title,
  federationId,
  balanceMsat,
  children,
}: FedNameCardProps) {
  const [confirmLeaveFed, setConfirmLeaveFed] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { t } = useTranslation();
  const { gateway } = useContext(ApiContext);

  const handleDisconnectFederation = async () => {
    try {
      if (federationId) {
        await gateway.leaveFederation(federationId);
        return;
      } else {
        throw new Error('Federation ID is null');
      }
    } catch (error) {
      setErrorMessage((error as Error).message);
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  const handleConfirmLeaveFed = () => {
    if (balanceMsat && balanceMsat > 0) {
      setErrorMessage(t('federation-card.leave-fed-error'));
      setTimeout(() => setErrorMessage(null), 3000);
    } else {
      setConfirmLeaveFed(true);
    }
  };

  return (
    <Card w='100%' maxWidth='100%'>
      <CardHeader>
        <Text variant='secondary' size='sm'>
          {title}
        </Text>
        {federationId && (
          <Flex justifyContent='space-between' alignItems='center'>
            <Text size='xl' fontWeight='600'>
              {federationId.slice(0, 6) + '...' + federationId.slice(-6)}
            </Text>
            <Text
              as='span'
              textDecoration='underline'
              colorScheme='red'
              onClick={handleConfirmLeaveFed}
              cursor='pointer'
            >
              Leave
            </Text>
          </Flex>
        )}
        {errorMessage && <Text color='red.500'>{errorMessage}</Text>}
        <Modal
          isOpen={confirmLeaveFed}
          onClose={() => setConfirmLeaveFed(false)}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {t('federation-card.leave-fed-modal-title')}
            </ModalHeader>
            <ModalBody>
              {federationId &&
                t('federation-card.leave-fed-modal-text') +
                  ' ' +
                  federationId.slice(0, 6) +
                  '...' +
                  federationId.slice(-6) +
                  '?'}
            </ModalBody>
            <ModalFooter>
              <Button
                mr={3}
                onClick={() => {
                  setConfirmLeaveFed(false);
                  handleDisconnectFederation();
                }}
              >
                Confirm
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </CardHeader>
      <CardBody>{children}</CardBody>
    </Card>
  );
});
