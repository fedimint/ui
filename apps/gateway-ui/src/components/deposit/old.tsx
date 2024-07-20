import React, { useCallback, useMemo, useState } from 'react';
import {
  Text,
  Flex,
  useTheme,
  Stack,
  Link,
  Box,
  useClipboard,
} from '@chakra-ui/react';
import { ApiContext } from '../../ApiProvider';
import { QRCodeSVG } from 'qrcode.react';
import { MSats, Network } from '@fedimint/types';
import { formatMsatsToBtc } from '@fedimint/utils';
import { useTranslation } from '@fedimint/utils';
import { GatewayCard } from '../GatewayCard';
import { ReactComponent as CopyIcon } from '../assets/svgs/copy.svg';
import { ReactComponent as LinkIcon } from '../assets/svgs/linkIcon.svg';

export interface DepositCardProps {
  federationId: string;
  network?: Network;
}
import {
  Button,
  InputGroup,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';

export const DepositCard = React.memo(function DepositCard({
  federationId,
  network,
}: DepositCardProps): JSX.Element {
  const { t } = useTranslation();
  const { gateway } = React.useContext(ApiContext);
  const [address, setAddress] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const theme = useTheme();
  const { onCopy, hasCopied } = useClipboard(address);

  const createDepositAddress = useCallback(() => {
    gateway
      .fetchAddress(federationId)
      .then((newAddress) => {
        const bip21Uri = `bitcoin:${newAddress}${
          amount > 0
            ? `?amount=${formatMsatsToBtc((amount * 1000) as MSats)}`
            : ''
        }`;
        setAddress(bip21Uri);
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

  return (
    <GatewayCard
      title={t('deposit-card.card_header') + '(BTC -> eCash)'}
      description={t('deposit-card.sentence-one')}
    >
      <Stack spacing='24px'>
        <InputGroup flexDir='column'>
          <Text
            fontSize='sm'
            fontWeight='500'
            color={theme.colors.gray[700]}
            fontFamily={theme.fonts.body}
            pb='6px'
          >
            {`${t('common.amount')} ${t('common.sats')}`}
          </Text>
          <NumberInput
            min={0}
            value={amount}
            onChange={(value) => setAmount(parseInt(value) || 0)}
          >
            <NumberInputField
              height='44px'
              p='14px'
              border={`1px solid ${theme.colors.gray[300]}`}
              bgColor={theme.colors.white}
              boxShadow={theme.shadows.xs}
              borderRadius='8px'
              w='100%'
            />
          </NumberInput>
        </InputGroup>

        <Button
          borderRadius='8px'
          maxW='200px'
          fontSize='sm'
          onClick={createDepositAddress}
        >
          {t('deposit-card.create-pegin-address')}
        </Button>

        {address && (
          <Flex gap='4px' alignItems='flex-start'>
            <Text
              fontSize='md'
              color={theme.colors.gray[900]}
              fontFamily={theme.fonts.body}
              overflowWrap='break-word'
              wordBreak='break-word'
              cursor='pointer'
              onClick={onCopy}
            >
              {address}
            </Text>
            <Box>
              {hasCopied ? (
                <Text
                  fontSize='xs'
                  fontWeight='semibold'
                  color={theme.colors.gray[900]}
                  bgColor={theme.colors.gray[25]}
                  fontFamily={theme.fonts.body}
                  onClick={onCopy}
                  p='4px 12px'
                  borderRadius='16px'
                  border={`1px solid ${theme.colors.gray[400]}`}
                >
                  {t('common.copied')}
                </Text>
              ) : (
                <CopyIcon
                  color={theme.colors.gray[900]}
                  height='20px'
                  width='20px'
                  onClick={onCopy}
                  cursor='pointer'
                />
              )}
            </Box>
          </Flex>
        )}

        {error && (
          <Text
            fontSize='md'
            color={theme.colors.red}
            fontFamily={theme.fonts.body}
          >
            {error}
          </Text>
        )}

        {address && (
          <Box>
            <QRCodeSVG height='200px' width='200px' value={address} />
          </Box>
        )}
      </Stack>
      {address && (
        <Flex gap='4px'>
          <Link
            fontSize='md'
            color={theme.colors.blue[600]}
            fontFamily={theme.fonts.body}
            _hover={{ textDecoration: 'underline' }}
            transition={`text-decoration 1s ease-in-out`}
            href={url.toString()}
            target='_blank'
            rel='noreferrer'
            w='fit-content'
          >
            {t('federation-card.view-link-on', { host: url.host })}
          </Link>
          <LinkIcon color={theme.colors.blue[600]} />
        </Flex>
      )}
    </GatewayCard>
  );
});
