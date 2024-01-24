import React from 'react';
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
  federationName?: string;
  balanceMsat?: number;
  children: React.ReactNode;
}

export const FedNameCard = React.memo(function FedNameCard({
  title,
  federationId,
  federationName,
  balanceMsat,
  children,
}: FedNameCardProps) {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const { gateway } = React.useContext(ApiContext);

  const handleDisconnectFederation = async () => {
    try {
      if (federationId) {
        await gateway.leaveFederation(federationId);
        return;
      } else {
        throw new Error('Federation ID is null');
      }
    } catch (error: any) {
      setErrorMessage(error.message);
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  const handleConfirmLeaveFed = () => {
    if (balanceMsat && balanceMsat > 0) {
      setErrorMessage(t('federation-card.leave-fed-error'));
      setTimeout(() => setErrorMessage(null), 3000);
    } else {
      setIsOpen(true);
    }
  };

  return (
    <Card w='100%' maxWidth='100%'>
      <CardHeader>
        <Text variant='secondary' size='sm'>
          {title}
        </Text>
        {federationName && (
          <Flex justifyContent='space-between' alignItems='center'>
            <Text size='xl' fontWeight='600'>
              {federationName}
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
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {t('federation-card.leave-fed-modal-title')}
            </ModalHeader>
            <ModalBody>
              {t('federation-card.leave-fed-modal-text') +
                ' ' +
                federationName +
                '?'}
            </ModalBody>
            <ModalFooter>
              <Button
                mr={3}
                onClick={() => {
                  setIsOpen(false);
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
