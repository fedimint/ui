import React, { useCallback, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  NumberInput,
  NumberInputField,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useTheme,
  Link,
  Icon,
} from '@chakra-ui/react';
import { MSats, Network } from '@fedimint/types';
import {
  useTranslation,
  formatEllipsized,
  formatMsatsToBtc,
} from '@fedimint/utils';
import { ApiContext } from '../ApiProvider';
import { GatewayCard } from '.';
import { ReactComponent as CheckCircleIcon } from '../assets/svgs/check-circle.svg';

export interface WithdrawCardProps {
  federationId: string;
  balanceMsat: number;
}

export const WithdrawCard = React.memo(function WithdrawCard({
  federationId,
  balanceMsat,
}: WithdrawCardProps): JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();
  const { gateway } = React.useContext(ApiContext);

  const [error, setError] = useState<string>('');
  const [modalState, setModalState] = useState<boolean>(false);
  const [address, setAddress] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [withdrawTxUrl, setWithdrawTxUrl] = useState<URL | null>(null);

  const handleChangeAddress = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const address = ev.currentTarget.value;
    if (address.toLowerCase().startsWith('bitcoin:')) {
      const uri = new URL(address);
      const amt = uri.searchParams.get('amount');
      if (amt) {
        setAmount(Math.round(parseFloat(amt) * 100_000_000));
      }
      setAddress(uri.pathname);
    } else {
      setAddress(address);
    }
  };

  const createWithdrawal = useCallback(() => {
    if (amount <= 0) {
      return setError(`${t('withdraw-card.error-amount')}`);
    }
    if (!address) {
      return setError(`${t('withdraw-card.error-address')}`);
    }
    setError('');
    setModalState(true);
  }, [amount, address, t]);

  const startWithdrawal = useCallback(() => {
    gateway
      .requestWithdrawal(federationId, amount, address)
      .then((txId) => {
        setWithdrawTxUrl(getTxUrl(txId));
        setAddress('');
        setAmount(0);
        setModalState(false);
      })
      .catch(({ error }) => {
        console.error(error);
        setError(`${t('withdraw-card.error-request')}`);
      });
  }, [gateway, federationId, amount, address, t]);

  return (
    <>
      <GatewayCard
        title={t('withdraw-card.card-header') + '(eCash -> BTC)'}
        description={`${t('withdraw-card.total_bitcoin')} ${formatMsatsToBtc(
          balanceMsat as MSats
        )} ${t('common.btc')}`}
      >
        <Stack spacing='20px'>
          <InputGroup flexDir='column'>
            <Text
              fontSize='sm'
              fontWeight='500'
              color={theme.colors.gray[700]}
              fontFamily={theme.fonts.body}
              pb='6px'
            >
              {`${t('common.amount')} ${t('common.sats')}`}
            </Text>
            <NumberInput
              min={0}
              max={balanceMsat / 1000}
              value={amount}
              onChange={(value) => {
                value && setAmount(parseInt(value));
              }}
            >
              <NumberInputField
                height='44px'
                p='14px'
                border={`1px solid ${theme.colors.gray[300]}`}
                bgColor={theme.colors.white}
                boxShadow={theme.shadows.xs}
                borderRadius='8px'
                w='100%'
              />
            </NumberInput>
            <Text
              mt='4px'
              cursor='pointer'
              fontSize='sm'
              color={theme.colors.blue[600]}
              fontFamily={theme.fonts.body}
              onClick={() => setAmount(balanceMsat / 1000)}
            >
              {t('withdraw-card.withdraw_all')}
            </Text>
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
              value={address}
              onChange={handleChangeAddress}
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
            {t('withdraw-card.withdraw')}
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

      {withdrawTxUrl && (
        <Modal
          isOpen={!!withdrawTxUrl}
          onClose={() => setWithdrawTxUrl(null)}
          isCentered
        >
          <ModalOverlay />
          <ModalContent textAlign='center'>
            <ModalHeader>{t('withdraw-card.transaction-sent')}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Icon as={CheckCircleIcon} color='green.500' w={24} h={24} />
              <Text>
                {t('withdraw-card.view-it-on')}
                <Link
                  href={withdrawTxUrl.toString()}
                  isExternal
                  color='blue.500'
                >
                  {' '}
                  {withdrawTxUrl.host}
                </Link>
              </Text>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
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
              <Flex
                direction='column'
                alignItems='flex-start'
                justifyContent='space-between'
                gap={2}
              >
                <Box>
                  <Text>{t('common.amount')}:</Text>
                  <Text>
                    {txRequest.amount} {t('common.sats')}
                  </Text>
                </Box>
                <Text>{t('withdraw-card.to')}</Text>
                <Box>
                  <Text>{t('common.address')}:</Text>
                  <Text>{formatEllipsized(txRequest.address)}</Text>
                </Box>
              </Flex>
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

const getTxUrl = (txId: string, network: Network = Network.Bitcoin): URL => {
  switch (network) {
    case Network.Signet:
      return new URL(`https://mutinynet.com/tx/${txId}`);
    case Network.Testnet:
      return new URL(`https://mempool.space/testnet/tx/${txId}`);
    case Network.Bitcoin:
    case Network.Regtest:
      return new URL(`https://mempool.space/tx/${txId}`);
  }
};
