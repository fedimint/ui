import React, { useCallback, useState } from 'react';
import {
  Box,
  Button,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  VStack,
  useTheme,
} from '@chakra-ui/react';
import { ApiContext } from '../ApiProvider';
import { useTranslation } from '@fedimint/utils';
import { GatewayCard } from '.';

interface WithdrawObject {
  amount: number;
  address: string;
}

export interface WithdrawCardProps {
  federationId: string;
}

const truncateStringFormat = (arg: string): string => {
  return `${arg.substring(0, 15)}......${arg.substring(
    arg.length,
    arg.length - 15
  )}`;
};

export const WithdrawCard = React.memo(function WithdrawCard({
  federationId,
}: WithdrawCardProps): JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();
  const { gateway } = React.useContext(ApiContext);
  const [withdrawObject, setWithdrawObject] = useState<WithdrawObject>({
    amount: 0,
    address: '',
  });
  const [error, setError] = useState<string>('');
  const [modalState, setModalState] = useState<boolean>(false);
  const { amount, address } = withdrawObject;

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      const { value, name } = event.target;
      // FIXME this is a hack
      if (name === 'amount') {
        setWithdrawObject((prevState) => ({
          ...prevState,
          [name]: parseInt(value),
        }));
      } else {
        setWithdrawObject((prevState) => ({ ...prevState, [name]: value }));
      }
    },
    []
  );

  const createWithdrawal = () => {
    if (!amount && amount === 0 && typeof amount === 'number') {
      setError(`${t('withdraw-card.error-amount')}`);
      return;
    }
    if (!address) {
      setError(`${t('withdraw-card.error-address')}`);
      return;
    }
    // TODO: address validation
    setError('');
    setModalState(true);
  };

  const startWithdrawal = () => {
    gateway
      .requestWithdrawal(federationId, amount, address)
      .then((txId) => {
        // FIXME: show this in a better way
        alert(`${t('withdraw-card.your-transaction')} ${txId}`);
        setWithdrawObject({ ...withdrawObject, amount: 0, address: '' });
        setModalState(false);
      })
      .catch(({ error }) => {
        console.error(error);
        setError(`${t('withdraw-card.error-request')}`);
      });
  };

  return (
    <Box w='100%'>
      <GatewayCard>
        <Stack spacing='4px' h='100%'>
          <Text
            fontSize='lg'
            fontWeight='600'
            color={theme.colors.gray[900]}
            fontFamily={theme.fonts.body}
          >
            {t('withdraw-card.card-header')}
          </Text>
          <Text
            fontSize='md'
            color={theme.colors.gray[600]}
            fontFamily={theme.fonts.body}
          >
            {t('withdraw-card.total_bitcoin')} {withdrawObject.amount / 100000}{' '}
            {t('common.btc')}
          </Text>
          <Text
            cursor='pointer'
            fontSize='sm'
            color={theme.colors.blue[600]}
            fontFamily={theme.fonts.body}
          >
            {t('withdraw-card.withdraw_all')}
          </Text>
        </Stack>
        <Stack spacing='20px'>
          <InputGroup flexDir='column'>
            <Text
              fontSize='sm'
              fontWeight='500'
              color={theme.colors.gray[700]}
              fontFamily={theme.fonts.body}
              pb='6px'
            >
              {t('common.amount')}
            </Text>
            <Input
              height='44px'
              p='14px'
              border={`1px solid ${theme.colors.gray[300]}`}
              bgColor={theme.colors.white}
              boxShadow={theme.shadows.xs}
              borderRadius='8px'
              w='100%'
              placeholder={t('withdraw-card.amount-placeholder')}
              // FIXME: this is a hack
              value={withdrawObject.amount.toString()}
              onChange={(e) => handleInputChange(e)}
              name='amount'
            />
          </InputGroup>
          <InputGroup flexDir='column'>
            <Text
              fontSize='sm'
              fontWeight='500'
              color={theme.colors.gray[700]}
              fontFamily={theme.fonts.body}
              pb='6px'
            >
              {t('common.address')}
            </Text>
            <Input
              height='44px'
              p='14px'
              border={`1px solid ${theme.colors.gray[300]}`}
              bgColor={theme.colors.white}
              boxShadow={theme.shadows.xs}
              borderRadius='8px'
              w='100%'
              placeholder={t('withdraw-card.address-placeholder')}
              value={withdrawObject.address}
              onChange={(e) => handleInputChange(e)}
              name='address'
            />
          </InputGroup>

          {error && (
            <Box>
              <Text textAlign='center' color='red' fontSize='14'>
                {t('withdraw-card.error')}: {error}
              </Text>
            </Box>
          )}

          <Button
            borderRadius='8px'
            maxW='145px'
            isDisabled={!address}
            fontSize='sm'
            onClick={createWithdrawal}
          >
            {t('withdraw-card.card-header')}
          </Button>
        </Stack>
      </GatewayCard>

      {modalState && (
        <ConfirmWithdrawModal
          open={modalState}
          txRequest={{ amount, address }}
          onModalClickCallback={() => {
            setModalState(false);
          }}
          onCloseClickCallback={() => {
            setModalState(false);
          }}
          startWithdrawalCallback={startWithdrawal}
        />
      )}
    </Box>
  );
});

export interface ConfirmWithdrawModalProps {
  open: boolean;
  txRequest: {
    amount: number;
    address: string;
  };
  onModalClickCallback: () => void;
  onCloseClickCallback: () => void;
  startWithdrawalCallback: () => void;
}

const ConfirmWithdrawModal = (
  props: ConfirmWithdrawModalProps
): JSX.Element => {
  const { t } = useTranslation();
  const { open, txRequest, onModalClickCallback, startWithdrawalCallback } =
    props;

  return (
    <div>
      <>
        <Modal onClose={onModalClickCallback} isOpen={open} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{t('withdraw-card.confirm-withdraw')}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack alignItems='flex-start' justifyContent='space-between'>
                <Box>
                  <Text>{t('common.amount')}:</Text>
                  <Text>
                    {txRequest.amount} {t('common.sats')}
                  </Text>
                </Box>
                <Text>{t('withdraw-card.to')}</Text>
                <Box>
                  <Text>{t('common.address')}:</Text>
                  <Text>{truncateStringFormat(txRequest.address)}</Text>
                </Box>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button
                onClick={() => {
                  if (startWithdrawalCallback) {
                    startWithdrawalCallback();
                  }
                }}
                fontSize={{ base: '12px', md: '13px', lg: '16px' }}
                p={{ base: '10px', md: '13px', lg: '16px' }}
              >
                {t('common.confirm')}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    </div>
  );
};

export interface TransactionViewProps {
  amount: number;
  address: string;
  txId: string;
  confirmationsRequired: number;
  federationId?: string;
}

export interface TransactionInfoProps {
  title: string;
  detail?: string | number;
  children?: React.ReactNode;
  onClick?: () => void;
  color?: string;
}
