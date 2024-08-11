// TODO: Shared components for receive and send, should move out into multiple components
import React from 'react';
import {
  NumberInput,
  NumberInputField,
  Button,
  Flex,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Text,
  Box,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { FederationInfo, Sats } from '@fedimint/types';
import { WalletModalState } from './WalletModal';
import QRCode from 'qrcode.react';
import { FiCheck, FiCopy } from 'react-icons/fi';
import { motion } from 'framer-motion';

export interface ReceiveProps {
  federations: FederationInfo[];
  walletModalState: WalletModalState;
  setWalletModalState: (state: WalletModalState) => void;
  setShowSelector: (show: boolean) => void;
}

export const AmountInput: React.FC<{
  amount: Sats;
  setAmount: (amount: Sats) => void;
}> = ({ amount, setAmount }) => {
  const { t } = useTranslation();
  return (
    <FormControl>
      <FormLabel>{t('wallet-modal.receive.enter-amount-sats')}</FormLabel>
      <NumberInput
        value={amount}
        onChange={(_, value) => setAmount(value as Sats)}
        min={0}
      >
        <NumberInputField
          placeholder={t('wallet-modal.receive.enter-amount-sats')}
          height='60px'
          fontSize='md'
        />
      </NumberInput>
    </FormControl>
  );
};

export const CreateButton: React.FC<{
  onClick: () => void;
  label: string;
}> = ({ onClick, label }) => (
  <Button onClick={onClick} size='lg' width='100%'>
    {label}
  </Button>
);

interface QRCodeTabsProps {
  uriValue: string;
  addressValue: string;
  onCopyUri: () => void;
  onCopyAddress: () => void;
  uriLabel: string;
  addressLabel: string;
}

export const QRCodeTabs: React.FC<QRCodeTabsProps> = ({
  uriValue,
  addressValue,
  onCopyUri,
  onCopyAddress,
  uriLabel,
  addressLabel,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Flex
        direction='column'
        alignItems='center'
        gap={4}
        maxWidth='300px'
        mx='auto'
      >
        <Tabs width='100%' isFitted>
          <TabList>
            <Tab>{addressLabel}</Tab>
            <Tab>{uriLabel}</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <QRCodePanel value={addressValue} onCopy={onCopyAddress} />
            </TabPanel>
            <TabPanel>
              <QRCodePanel value={uriValue} onCopy={onCopyUri} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </motion.div>
  );
};

const QRCodePanel: React.FC<{ value: string; onCopy: () => void }> = ({
  value,
  onCopy,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Flex
      direction='column'
      alignItems='center'
      justifyContent='center'
      width='100%'
    >
      <QRCode value={value} size={200} />
      <Flex
        borderWidth={1}
        borderRadius='md'
        p={3}
        bg='gray.50'
        color='gray.600'
        fontSize='sm'
        mt={4}
        width='100%'
        alignItems='center'
        cursor='pointer'
        onClick={handleCopy}
        _hover={{ bg: 'gray.100' }}
        transition='background-color 0.2s'
      >
        <Text
          flex={1}
          pr={2}
          letterSpacing='0.05em'
          lineHeight='1.5'
          overflowWrap='break-word'
          wordBreak='break-all'
        >
          {value}
        </Text>
        <Box ml={2} flexShrink={0}>
          {copied ? <FiCheck /> : <FiCopy />}
        </Box>
      </Flex>
    </Flex>
  );
};

interface InfoFieldProps {
  label: string;
  value: string | number;
}

export const InfoField: React.FC<InfoFieldProps> = ({ label, value }) => (
  <Flex
    direction='column'
    align='center'
    width='100%'
    bg='gray.50'
    p={4}
    borderRadius='md'
  >
    <Text fontSize='sm' color='gray.500'>
      {label}
    </Text>
    <Text
      fontSize='md'
      fontWeight='medium'
      textAlign='center'
      wordBreak='break-all'
    >
      {value}
    </Text>
  </Flex>
);
