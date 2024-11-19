import React, { useState } from 'react';
import { Box, Text, Button, Flex } from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { motion } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';
import { decode, DecodedInvoice } from 'light-bolt11-decoder';
import { useGatewayApi } from '../../../../hooks/gateway/useGateway';
import { InfoField } from '..';

interface InvoiceDetails {
  amount: number;
  description: string;
  paymentHash: string;
}

const SendLightning: React.FC = () => {
  const { t } = useTranslation();
  const api = useGatewayApi();
  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetails | null>(
    null
  );
  const [paymentStatus, setPaymentStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');

  const parseInvoice = (decodedInvoice: DecodedInvoice): InvoiceDetails => {
    const getSection = (name: string) =>
      decodedInvoice.sections.find(
        (section: { name: string }) => section.name === name
      );
    const amountSection = getSection('amount');
    const descriptionSection = getSection('description');
    const paymentHashSection = getSection('payment_hash');

    return {
      amount:
        amountSection && 'value' in amountSection
          ? parseInt(amountSection.value as string) / 1000
          : 0,
      description:
        descriptionSection && 'value' in descriptionSection
          ? (descriptionSection.value as string)
          : '',
      paymentHash:
        paymentHashSection && 'value' in paymentHashSection
          ? (paymentHashSection.value as string)
          : '',
    };
  };

  const handlePasteInvoice = async () => {
    try {
      const invoice = await navigator.clipboard.readText();
      const decodedInvoice = decode(invoice);
      const details = parseInvoice(decodedInvoice);
      setInvoiceDetails(details);
      await handlePayInvoice(invoice);
    } catch (err) {
      console.error('Failed to parse or pay invoice:', err);
      setPaymentStatus('error');
    }
  };

  const handlePayInvoice = async (invoice: string) => {
    try {
      await api.payInvoiceFromSelf({ invoice, max_delay: 100, max_fee: 1000 });
      setPaymentStatus('success');
    } catch (err) {
      console.error('Failed to pay invoice:', err);
      setPaymentStatus('error');
    }
  };

  if (paymentStatus === 'success' && invoiceDetails) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Flex direction='column' align='center'>
          <FiCheckCircle size={80} color='green.500' />
          <Text fontSize='2xl' fontWeight='bold' color='green.500'>
            {t('wallet-modal.send.lightning-payment-success')}
          </Text>
          <InfoField
            label={t('wallet.paid-amount')}
            value={`${invoiceDetails.amount} ${t('common.sats')}`}
          />
        </Flex>
      </motion.div>
    );
  }

  if (paymentStatus === 'error') {
    return (
      <Box>
        <Text color='red.500'>{t('wallet-modal.send.payment-error')}</Text>
        <Button onClick={() => setPaymentStatus('idle')}>
          {t('common.try-again')}
        </Button>
      </Box>
    );
  }

  return (
    <Flex direction='column' gap={4}>
      <Text>{t('wallet-modal.send.lightning-instructions')}</Text>
      <Button onClick={handlePasteInvoice}>
        {t('wallet-modal.send.paste-invoice-button')}
      </Button>
    </Flex>
  );
};

export default SendLightning;
