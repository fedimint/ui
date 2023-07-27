import React, { useCallback, useState } from 'react';
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  TabPanel,
  Text,
  VStack,
} from '@chakra-ui/react';
import { ApiContext } from '../ApiProvider';
import { TabHeader, Input } from '.';
import { useTranslation } from '@fedimint/utils';

export const WithdrawTabHeader = () => {
  const { t } = useTranslation();
  return <TabHeader>{t('withdraw-tab.tab-header')}</TabHeader>;
};

interface WithdrawObject {
  amount: number;
  address: string;
}

export interface WithdrawTabProps {
  federationId: string;
}

const truncateStringFormat = (arg: string): string => {
  return `${arg.substring(0, 15)}......${arg.substring(
    arg.length,
    arg.length - 15
  )}`;
};

export const WithdrawTab = React.memo(function WithdrawTab({
  federationId,
}: WithdrawTabProps): JSX.Element {
  const { t } = useTranslation();
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
      setError(`${t('withdraw-tab.error-amount')}`);
      return;
    }
    if (!address) {
      setError(`${t('withdraw-tab.error-address')}`);
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
        alert(`${t('withdraw-tab.your-transaction')} ${txId}`);
        setWithdrawObject({ ...withdrawObject, amount: 0, address: '' });
        setModalState(false);
      })
      .catch(({ error }) => {
        console.error(error);
        setError(`${t('withdraw-tab.error-request')}`);
      });
  };

  return (
    <TabPanel ml='1px' mr='1px' p={{ base: '4px', md: '16px', lg: '16px' }}>
      <Stack spacing='4' maxWidth={{ base: '100%', md: 'md', lg: 'md' }}>
        <Input
          labelName={t('withdraw-tab.amount-label')}
          placeHolder={t('withdraw-tab.amount-placeholder')}
          // FIXME: this is a hack
          value={withdrawObject.amount.toString()}
          onChange={(e) => handleInputChange(e)}
          name='amount'
        />
        <Input
          labelName={t('withdraw-tab.address-label')}
          placeHolder={t('withdraw-tab.address-placeholder')}
          value={withdrawObject.address}
          onChange={(e) => handleInputChange(e)}
          name='address'
        />

        {error && (
          <Box>
            <Text textAlign='center' color='red' fontSize='14'>
              {t('withdraw-tab.error')}: {error}
            </Text>
          </Box>
        )}

        <Button borderRadius='4' onClick={createWithdrawal}>
          {t('withdraw-tab.withdraw')}
        </Button>
      </Stack>

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
    </TabPanel>
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
            <ModalHeader>{t('withdraw-tab.confirm-withdraw')}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack alignItems='flex-start' justifyContent='space-between'>
                <Box>
                  <Text>{t('common.amount')}:</Text>
                  <Text>
                    {txRequest.amount} {t('common.sats')}
                  </Text>
                </Box>
                <Text>{t('withdraw-tab.to')}</Text>
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
