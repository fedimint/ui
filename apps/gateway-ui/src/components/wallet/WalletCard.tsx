import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Button,
  Flex,
  Input,
  NumberInput,
  NumberInputField,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useClipboard,
  Icon,
} from '@chakra-ui/react';
import { ApiContext } from '../../ApiProvider';
import { useTranslation, formatMsatsToBtc } from '@fedimint/utils';
import { GatewayCard } from '../GatewayCard';
import { QRCodeSVG } from 'qrcode.react';
import { ReactComponent as CopyIcon } from '../../assets/svgs/copy.svg';
import { ReactComponent as CheckCircleIcon } from '../../assets/svgs/check-circle.svg';
import { MSats, Network } from '@fedimint/types';

export interface WalletCardProps {
  federationId: string;
  balanceMsat: number;
  network?: Network;
}

export const WalletCard = React.memo(function WalletCard({
  federationId,
  balanceMsat,
  network,
}: WalletCardProps): JSX.Element {
  const { t } = useTranslation();
  const { gateway } = React.useContext(ApiContext);

  const [tabIndex, setTabIndex] = useState(0);
  const [amount, setAmount] = useState<number>(0);
  const [address, setAddress] = useState<string>('');
  const [bip21Uri, setBip21Uri] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

  const { onCopy, hasCopied } = useClipboard(address);

  const createDepositAddress = useCallback(() => {
    gateway
      .fetchAddress(federationId)
      .then((newAddress) => {
        setAddress(newAddress);
        const bip21Uri = `bitcoin:${newAddress}${
          amount > 0 ? `?amount=${amount / 100000000}` : ''
        }`;
        setBip21Uri(bip21Uri);
        setError('');
      })
      .catch(({ message, error }) => {
        console.error(error);
        setError(message);
      });
  }, [federationId, gateway, amount]);

  const getAddressUrl = useCallback(
    (address: string): URL => {
      const baseAddress = address.split(':')[1]?.split('?')[0] || '';
      switch (network) {
        case Network.Signet:
          return new URL(`https://mutinynet.com/address/${baseAddress}`);
        case Network.Testnet:
          return new URL(
            `https://mempool.space/testnet/address/${baseAddress}`
          );
        case Network.Bitcoin:
        case Network.Regtest:
        default:
          return new URL(`https://mempool.space/address/${baseAddress}`);
      }
    },
    [network]
  );

  const url = useMemo(() => getAddressUrl(address), [address, getAddressUrl]);

  const handleDeposit = useCallback(() => {
    createDepositAddress();
    setModalContent(
      <Box textAlign='center'>
        <Text fontSize='xl' mb={4}>
          {t('deposit.scan-qr')}
        </Text>
        <QRCodeSVG height='200px' width='200px' value={address} />
        <Flex mt={4} alignItems='center' justifyContent='center'>
          <Text mr={2}>{address}</Text>
          {hasCopied ? (
            <Text fontSize='sm' color='green.500'>
              {t('common.copied')}
            </Text>
          ) : (
            <CopyIcon cursor='pointer' onClick={onCopy} />
          )}
        </Flex>
      </Box>
    );
    setIsModalOpen(true);
  }, [address, createDepositAddress, hasCopied, onCopy, t]);

  const handleWithdraw = useCallback(() => {
    // ... (implement withdraw logic)
    setModalContent(
      <Box textAlign='center'>
        <Icon as={CheckCircleIcon} color='green.500' w={24} h={24} mb={4} />
        <Text fontSize='xl'>{t('withdraw.success')}</Text>
      </Box>
    );
    setIsModalOpen(true);
  }, [t]);

  return (
    <GatewayCard
      title={t('wallet-card.title')}
      description={`${t('wallet-card.balance')}: ${formatMsatsToBtc(
        balanceMsat as MSats
      )} BTC`}
    >
      <Tabs
        index={tabIndex}
        onChange={setTabIndex}
        isFitted
        variant='soft-rounded'
        colorScheme='blue'
      >
        <TabList mb='1em'>
          <Tab>{t('wallet-card.deposit')}</Tab>
          <Tab>{t('wallet-card.withdraw')}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Stack spacing='20px'>
              <NumberInput
                min={0}
                value={amount}
                onChange={(value) => setAmount(parseInt(value) || 0)}
              >
                <NumberInputField placeholder={t('common.amount')} />
              </NumberInput>
              <Button onClick={handleDeposit}>
                {t('wallet-card.create-address')}
              </Button>
            </Stack>
          </TabPanel>
          <TabPanel>
            <Stack spacing='20px'>
              <NumberInput
                min={0}
                max={balanceMsat / 1000}
                value={amount}
                onChange={(value) => setAmount(parseInt(value) || 0)}
              >
                <NumberInputField placeholder={t('common.amount')} />
              </NumberInput>
              <Input
                placeholder={t('common.address')}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <Button onClick={handleWithdraw}>
                {t('wallet-card.withdraw')}
              </Button>
            </Stack>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {error && (
        <Text color='red.500' mt={4}>
          {error}
        </Text>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {tabIndex === 0 ? t('deposit.title') : t('withdraw.title')}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>{modalContent}</ModalBody>
        </ModalContent>
      </Modal>
    </GatewayCard>
  );
});
