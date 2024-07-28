import React from 'react';
import {
  Text,
  useTheme,
  Flex,
  Link,
  Box,
  useClipboard,
} from '@chakra-ui/react';
import { Network } from '@fedimint/types';
import { formatEllipsized, getNodeUrl, useTranslation } from '@fedimint/utils';
import { GatewayCard } from '.';
import { ReactComponent as CopyIcon } from '../assets/svgs/copy.svg';
import { ReactComponent as LinkIcon } from '../assets/svgs/linkIcon.svg';

interface InfoCardProps {
  nodeId: string;
  network?: Network;
}

export const InfoCard = React.memo(function InfoCard({
  nodeId,
  network,
}: InfoCardProps): JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();
  const { onCopy, hasCopied } = useClipboard(nodeId);
  const url = getNodeUrl(nodeId, network);

  return (
    <GatewayCard title={t('info-card.card_header')}>
      <Flex alignItems='center' mb='4'>
        <Text
          fontSize='md'
          color={theme.colors.gray[900]}
          fontFamily={theme.fonts.body}
          mr='2'
        >
          {formatEllipsized(nodeId, 24)}
        </Text>
        <Box>
          {hasCopied ? (
            <Text
              fontSize='xs'
              fontWeight='semibold'
              color={theme.colors.green[500]}
              bgColor={theme.colors.green[50]}
              p='1'
              px='2'
              borderRadius='full'
            >
              {t('common.copied')}
            </Text>
          ) : (
            <Box
              as={CopyIcon}
              color={theme.colors.gray[500]}
              height='20px'
              width='20px'
              onClick={onCopy}
              cursor='pointer'
              _hover={{ color: theme.colors.gray[700] }}
            />
          )}
        </Box>
      </Flex>
      <Link
        fontSize='sm'
        color={theme.colors.blue[600]}
        fontFamily={theme.fonts.body}
        href={url.toString()}
        target='_blank'
        rel='noreferrer'
        display='flex'
        alignItems='center'
        _hover={{ textDecoration: 'underline', color: theme.colors.blue[700] }}
      >
        {t('federation-card.view-link-on', { host: url.host })}
        <Box as={LinkIcon} ml='1' boxSize='4' />
      </Link>
    </GatewayCard>
  );
});
