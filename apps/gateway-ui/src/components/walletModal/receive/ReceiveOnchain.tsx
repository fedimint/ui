import React, { useCallback, useState } from 'react';
import {
  NumberInput,
  NumberInputField,
  Button,
  Flex,
  useClipboard,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Box,
} from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { Bip21Uri, FederationInfo, Sats } from '@fedimint/types';
import { WalletModalState } from '../WalletModal';
import FederationSelector from '../FederationSelector';
import { ApiContext } from '../../../ApiProvider';
import QRCode from 'qrcode.react';
import { FiCopy } from 'react-icons/fi';
import { AmountInput, CreateButton, QRCodeTabs } from '.';

interface ReceiveOnchainProps {
  federations: FederationInfo[];
  walletModalState: WalletModalState;
  setWalletModalState: (state: WalletModalState) => void;
  setShowSelector: (show: boolean) => void;
}

const ReceiveOnchain: React.FC<ReceiveOnchainProps> = ({
  federations,
  walletModalState,
  setWalletModalState,
  setShowSelector,
}) => {
  const { t } = useTranslation();
  const { gateway } = React.useContext(ApiContext);
  const [amount, setAmount] = useState<Sats>(0 as Sats);
  const [bip21Uri, setBip21Uri] = useState<Bip21Uri>();
  const [showAddressInfo, setShowAddressInfo] = useState(false);
  const { onCopy: onCopyUri } = useClipboard(bip21Uri?.toString() ?? '');
  const { onCopy: onCopyAddress } = useClipboard(bip21Uri?.address ?? '');

  const handleCreateDepositAddress = useCallback(() => {
    if (!walletModalState.selectedFederation) return;
    gateway
      .fetchAddress(walletModalState.selectedFederation.federation_id)
      .then((newAddress) => {
        const bip21Uri = new Bip21Uri(newAddress, amount);
        setBip21Uri(bip21Uri);
        setShowSelector(false);
        setShowAddressInfo(true);
      })
      .catch(({ message, error }) => {
        console.error(error, message);
      });
  }, [gateway, walletModalState.selectedFederation, amount, setShowSelector]);

  if (showAddressInfo) {
    return (
      <QRCodeTabs
        uriValue={bip21Uri?.toString() ?? ''}
        addressValue={bip21Uri?.address ?? ''}
        onCopyUri={onCopyUri}
        onCopyAddress={onCopyAddress}
        uriLabel={t('common.uri')}
        addressLabel={t('common.address')}
      />
    );
  }

  return (
    <Flex direction='column' gap={4}>
      <FederationSelector
        federations={federations}
        walletModalState={walletModalState}
        setWalletModalState={setWalletModalState}
      />
      <AmountInput amount={amount} setAmount={setAmount} />
      <CreateButton
        onClick={handleCreateDepositAddress}
        label={t('wallet-modal.receive.create-deposit-address')}
      />
    </Flex>
  );
};

interface AddressInfoProps {
  bip21Uri: Bip21Uri | undefined;
  onCopyUri: () => void;
  onCopyAddress: () => void;
}

const AddressInfo: React.FC<AddressInfoProps> = ({
  bip21Uri,
  onCopyUri,
  onCopyAddress,
}) => {
  const { t } = useTranslation();

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
          <Tab>{t('common.uri')}</Tab>
          <Tab>{t('common.address')}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Flex
              direction='column'
              alignItems='center'
              justifyContent='center'
              width='100%'
            >
              <QRCode value={bip21Uri?.toString() ?? ''} size={200} />
              <Flex direction='column' gap={2} width='100%' mt={4}>
                <Button
                  onClick={onCopyUri}
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
                  {bip21Uri?.toString() ?? ''}
                </Box>
              </Flex>
            </Flex>
          </TabPanel>
          <TabPanel>
            <Flex
              direction='column'
              alignItems='center'
              justifyContent='center'
              width='100%'
            >
              <QRCode value={bip21Uri?.address ?? ''} size={200} />
              <Flex direction='column' gap={2} width='100%' mt={4}>
                <Button
                  onClick={onCopyAddress}
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
                  {bip21Uri?.address ?? ''}
                </Box>
              </Flex>
            </Flex>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

export default ReceiveOnchain;
