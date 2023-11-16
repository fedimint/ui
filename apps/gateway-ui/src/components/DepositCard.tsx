import React, { useEffect, useMemo, useState } from 'react';
import {
  Text,
  Flex,
  useTheme,
  Stack,
  Link,
  Box,
  useClipboard,
} from '@chakra-ui/react';
import { ApiContext } from '../ApiProvider';
import { QRCodeSVG } from 'qrcode.react';
import { useTranslation } from '@fedimint/utils';
import { GatewayCard } from './GatewayCard';
import { ReactComponent as CopyIcon } from '../assets/svgs/copy.svg';
import { ReactComponent as LinkIcon } from '../assets/svgs/linkIcon.svg';
import { Network } from '../types';

export interface DepositCardProps {
  federationId: string;
  network?: Network;
}

export const DepositCard = React.memo(function DepositCard({
  federationId,
  network,
}: DepositCardProps): JSX.Element {
  const { t } = useTranslation();
  const { gateway } = React.useContext(ApiContext);
  const [address, setAddress] = useState<string>('');
  const [error, setError] = useState<string>('');
  const theme = useTheme();
  const { onCopy, hasCopied } = useClipboard(address);

  useEffect(() => {
    !address &&
      gateway
        .fetchAddress(federationId)
        .then((newAddress) => {
          setAddress(newAddress);
          setError('');
        })
        .catch(({ message, error }) => {
          console.error(error);
          setError(message);
        });
  }, [address, federationId, gateway]);

  const url = useMemo(
    () => getAddressUrl(address, network),
    [address, network]
  );

  return (
    <GatewayCard
      title={t('deposit-card.card_header') + '(BTC -> eCash)'}
      description={t('deposit-card.sentence-one')}
    >
      <Stack spacing='24px'>
        <Flex gap='4px' alignItems='flex-start'>
          {address ? (
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
          ) : (
            <Text
              fontSize='md'
              color={theme.colors.red}
              fontFamily={theme.fonts.body}
            >
              {error}
            </Text>
          )}
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
        <Box>
          {address && (
            <QRCodeSVG height='200px' width='200px' value={address} />
          )}
        </Box>
      </Stack>
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
    </GatewayCard>
  );
});

const getAddressUrl = (
  address: string,
  network: Network = Network.Bitcoin
): URL => {
  switch (network) {
    case Network.Signet:
      return new URL(`https://mutinynet.com/address/${address}`);
    case Network.Testnet:
      return new URL(`https://mempool.space/testnet/address/${address}`);
    case Network.Bitcoin:
    case Network.Regtest:
      return new URL(`https://mempool.space/address/${address}`);
  }
};
