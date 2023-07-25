import React, { useEffect, useState } from 'react';
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

export interface DepositTabProps {
  federationId: string;
}

export const DepositTab = React.memo(function DepositTab({
  federationId,
}: DepositTabProps): JSX.Element {
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

  return (
    <GatewayCard>
      <Stack spacing='12px'>
        <Text
          fontSize='lg'
          fontWeight='600'
          color={theme.colors.gray[900]}
          fontFamily={theme.fonts.body}
        >
          {t('deposit-tab.tab_header')}
        </Text>
        <Text
          fontSize='md'
          color={theme.colors.gray[600]}
          fontFamily={theme.fonts.body}
        >
          {t('deposit-tab.sentence-one')}
        </Text>
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
            href={`https://mempool.space/address/${address}`}
            target='_blank'
            rel='noreferrer'
            w='fit-content'
          >
            {t('deposit-tab.mempool_deposit_link_text')}
          </Link>
          <LinkIcon color={theme.colors.blue[600]} />
        </Flex>
      </Stack>
    </GatewayCard>
  );
});
