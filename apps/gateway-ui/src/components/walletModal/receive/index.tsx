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
  Box,
} from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { FederationInfo, Sats } from '@fedimint/types';
import { WalletModalState } from '../WalletModal';
import QRCode from 'qrcode.react';
import { FiCopy } from 'react-icons/fi';

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
    <Flex
      direction='column'
      alignItems='center'
      gap={4}
      maxWidth='300px'
      mx='auto'
    >
      <Tabs width='100%' isFitted>
        <TabList>
          <Tab>{uriLabel}</Tab>
          <Tab>{addressLabel}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <QRCodePanel value={uriValue} onCopy={onCopyUri} />
          </TabPanel>
          <TabPanel>
            <QRCodePanel value={addressValue} onCopy={onCopyAddress} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

const QRCodePanel: React.FC<{ value: string; onCopy: () => void }> = ({
  value,
  onCopy,
}) => {
  const { t } = useTranslation();

  return (
    <Flex
      direction='column'
      alignItems='center'
      justifyContent='center'
      width='100%'
    >
      <QRCode value={value} size={200} />
      <Flex direction='column' gap={2} width='100%' mt={4}>
        <Button
          onClick={onCopy}
          leftIcon={<FiCopy />}
          width='100%'
          variant='outline'
        >
          {t('common.copy')}
        </Button>
        <Box
          borderWidth={1}
          borderRadius='md'
          p={2}
          bg='gray.50'
          color='gray.600'
          fontSize='sm'
          wordBreak='break-all'
        >
          {value}
        </Box>
      </Flex>
    </Flex>
  );
};
