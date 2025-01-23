import React from 'react';
import { Button, Flex, Link, Text } from '@chakra-ui/react';
import { Sats } from '@fedimint/types';
import { useTranslation } from '@fedimint/utils';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiSend } from 'react-icons/fi';
import { InfoField } from '../../form/InfoField';

type SendOnchainSuccessProps = {
  txid: string;
  amount: Sats;
  address: string;
};

const SendOnchainSuccess: React.FC<SendOnchainSuccessProps> = ({
  txid,
  amount,
  address,
}) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Flex direction='column' align='center' justify='center' gap={6}>
        <FiCheckCircle size={80} color='green.500' />
        <Text fontSize='2xl' fontWeight='bold' color='green.500'>
          {t('wallet-modal.send.peg-out-success')}
        </Text>
        <Flex direction='column' align='center' gap={4} width='100%'>
          <InfoField
            label={t('wallet.sent')}
            value={`${amount} ${t('common.sats')}`}
          />
          <InfoField label={t('wallet.to-address')} value={address} />
          <InfoField label={t('wallet.txid')} value={txid} />
          <Button
            as={Link}
            href={`https://mempool.space/tx/${txid}`}
            isExternal
            colorScheme='blue'
            leftIcon={<FiSend />}
            mt={2}
          >
            {t('common.view-on-mempool')}
          </Button>
        </Flex>
      </Flex>
    </motion.div>
  );
};

export default SendOnchainSuccess;
