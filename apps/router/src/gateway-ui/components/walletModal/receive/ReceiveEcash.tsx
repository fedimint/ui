import React, { useState } from 'react';
import { Flex, Text, Button } from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { motion } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';
import { InfoField } from '..';
import { useGatewayContext } from '../../../../hooks';
import { GATEWAY_APP_ACTION_TYPE } from '../../../../types/gateway';

const ReceiveEcash: React.FC = () => {
  const { t } = useTranslation();
  const { state, dispatch, api } = useGatewayContext();
  const [ecashNote, setEcashNote] = useState('');
  const [claimedAmount, setClaimedAmount] = useState<number | null>(null);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setEcashNote(text);
      const result = await api.receiveEcash(text);
      setClaimedAmount(result);
      dispatch({
        type: GATEWAY_APP_ACTION_TYPE.SET_WALLET_MODAL_STATE,
        payload: { ...state.walletModalState, showSelector: false },
      });
    } catch (err) {
      console.error('Failed to receive ecash: ', err);
      dispatch({
        type: GATEWAY_APP_ACTION_TYPE.SET_ERROR,
        payload: err instanceof Error ? err.message : 'Failed to receive eCash',
      });
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
