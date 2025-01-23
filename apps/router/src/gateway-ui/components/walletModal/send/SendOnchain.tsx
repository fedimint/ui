import React, { useState } from 'react';
import {
  Flex,
  Input,
  Button,
  useToast,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { Sats } from '@fedimint/types';
import FederationSelector from '../FederationSelector';
import SendOnchainSuccess from './SendOnchainSuccess';
import { useGatewayContext } from '../../../../hooks';
import { AmountInput } from '../../form/AmountInput';

const SendOnchain: React.FC = () => {
  const { t } = useTranslation();
  const { state, api } = useGatewayContext();
  const [bitcoinAddress, setBitcoinAddress] = useState('');
  const [amountSats, setAmountSats] = useState<Sats>(0 as Sats);
  const [successTxid, setSuccessTxid] = useState<string | null>(null);
  const toast = useToast();

  const handlePegOut = async () => {
    if (!state.walletModalState.selectedFederation) {
      toast({
        title: t('wallet-modal.send.select-federation'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!bitcoinAddress) {
      toast({
        title: t('wallet-modal.send.enter-bitcoin-address'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (amountSats <= 0) {
      toast({
        title: t('wallet-modal.send.enter-valid-amount'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const txid = await api.submitPegOut({
        federationId: state.walletModalState.selectedFederation.federation_id,
        satAmountOrAll: amountSats,
        address: bitcoinAddress,
      });
      setSuccessTxid(txid.txid);
    } catch (error) {
      console.error('Peg-out error:', error);
      toast({
        title: t('wallet-modal.send.peg-out-error'),
        description: error instanceof Error ? error.message : String(error),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (successTxid) {
    return (
      <SendOnchainSuccess
        txid={successTxid}
        amount={amountSats}
        address={bitcoinAddress}
      />
    );
  }

  return (
    <Flex direction='column' gap={4}>
      <FederationSelector />
      <FormControl>
        <FormLabel>{t('wallet-modal.send.to-onchain-address')}</FormLabel>
        <Input
          placeholder={t('wallet-modal.send.address-placeholder')}
          value={bitcoinAddress}
          onChange={(e) => setBitcoinAddress(e.target.value)}
        />
      </FormControl>
      <AmountInput amount={amountSats} setAmount={setAmountSats} unit='sats' />
      <Button onClick={handlePegOut} colorScheme='blue'>
        {t('wallet-modal.send.peg-out-to-onchain')}
      </Button>
    </Flex>
  );
};

export default SendOnchain;
