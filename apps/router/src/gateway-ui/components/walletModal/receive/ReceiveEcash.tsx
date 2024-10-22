import React, { useState } from 'react';
import { Flex, Text, Button } from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { FederationInfo } from '@fedimint/types';
import { motion } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';
import { InfoField } from '..';
import { useGatewayApi } from '../../../../context/hooks';
import { WalletModalState } from '../../../../types/gateway';

interface ReceiveEcashProps {
  federations: FederationInfo[];
  walletModalState: WalletModalState;
  setWalletModalState: (state: WalletModalState) => void;
  setShowSelector: (show: boolean) => void;
}

const ReceiveEcash: React.FC<ReceiveEcashProps> = ({ setShowSelector }) => {
  const { t } = useTranslation();
  const [ecashNote, setEcashNote] = useState('');
  const [claimedAmount, setClaimedAmount] = useState<number | null>(null);
  const api = useGatewayApi();

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setEcashNote(text);
      const result = await api.receiveEcash(text);
      setClaimedAmount(result);
      setShowSelector(false);
    } catch (err) {
      console.error('Failed to receive ecash: ', err);
    }
  };

  if (claimedAmount !== null) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Flex direction='column' align='center' justify='center' gap={6}>
          <FiCheckCircle size={80} color='green.500' />
          <Text fontSize='2xl' fontWeight='bold' color='green.500'>
            {t('wallet-modal.receive.ecash-claimed-success')}
          </Text>
          <Flex direction='column' align='center' gap={4} width='100%'>
            <InfoField
              label={t('wallet.claimed-amount')}
              value={`${claimedAmount} ${t('common.msats')}`}
            />
            <InfoField label={t('wallet.claimed-note')} value={ecashNote} />
          </Flex>
        </Flex>
      </motion.div>
    );
  }

  return (
    <Flex direction='column' gap={4}>
      <Button onClick={handlePaste}>
        {t('wallet-modal.receive.paste-ecash-button')}
      </Button>
    </Flex>
  );
};

export default ReceiveEcash;
