import React, { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Stack,
  useTheme,
  Text,
  Input,
  InputGroup,
  InputRightElement,
  Center,
} from '@chakra-ui/react';
import { Network } from '@fedimint/types';
import { useTranslation } from '@fedimint/utils';
import { GatewayCard } from '../GatewayCard';
import { AmountInput } from './AmountInput';
import { AddressDisplay } from './AddressDisplay';
import { ErrorMessage } from '../ErrorMessage';
import { useDepositLogic } from './useDepositLogic';
import { QRCodeSVG } from 'qrcode.react';
import { ReactComponent as LinkIcon } from '../../assets/svgs/linkIcon.svg';
import { ReactComponent as CopyIcon } from '../../assets/svgs/copy.svg';
import { motion } from 'framer-motion';

export interface DepositCardProps {
  federationId: string;
  network?: Network;
}

export const DepositCard = React.memo(function DepositCard({
  federationId,
  network,
}: DepositCardProps): JSX.Element {
  const { t } = useTranslation();
  const {
    address,
    amount,
    error,
    setAmount,
    createDepositAddress,
    getAddressUrl,
  } = useDepositLogic(federationId, network);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const url = useMemo(() => getAddressUrl(address), [address, getAddressUrl]);

  return (
    <GatewayCard
      title={t('deposit-card.card_header') + '(BTC -> eCash)'}
      description={t('deposit-card.sentence-one')}
    >
      <Stack spacing='24px'>
        {!address ? (
          <>
            <AmountInput amount={amount} setAmount={setAmount} />
            <Button
              borderRadius='8px'
              maxW='200px'
              fontSize='sm'
              onClick={createDepositAddress}
            >
              {t('deposit-card.create-pegin-address')}
            </Button>
          </>
        ) : (
          <Flex direction='column' gap={4}>
            <InputGroup size='md'>
              <Input value={url.toString()} isReadOnly pr='4.5rem' />
            </InputGroup>
            <Flex justifyContent='space-between'>
              <Button onClick={() => handleCopy(address)}>Copy Address</Button>
              <Button onClick={() => handleCopy(url.toString())}>
                Copy URI
              </Button>
              <Button
                as='a'
                href={url.toString()}
                target='_blank'
                rel='noopener noreferrer'
              >
                View on Explorer <LinkIcon />
              </Button>
            </Flex>
            <Center>
              <Box>
                <QRCodeSVG height='200px' width='200px' value={address} />
              </Box>
            </Center>
          </Flex>
        )}
        <ErrorMessage error={error} />
      </Stack>
    </GatewayCard>
  );
});
