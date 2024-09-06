import React from 'react';
import {
  Text,
  Flex,
  Link,
  Box,
  useClipboard,
  SimpleGrid,
} from '@chakra-ui/react';
import { LightningMode, Network } from '@fedimint/types';
import { formatEllipsized, getNodeUrl, useTranslation } from '@fedimint/utils';
import { GatewayCard } from '..';
import { ReactComponent as CopyIcon } from '../../assets/svgs/copy.svg';
import { ReactComponent as LinkIcon } from '../../assets/svgs/linkIcon.svg';

interface LightningCardProps {
  nodeId: string;
  network: Network;
  alias: string;
  mode: LightningMode;
  pubkey: string;
  blockHeight: number;
  syncedToChain: boolean;
}

export const LightningCard = React.memo(function LightningCard({
  nodeId,
  network,
  alias,
  mode,
  pubkey,
  blockHeight,
  syncedToChain,
}: LightningCardProps): JSX.Element {
  const { t } = useTranslation();
  const { onCopy, hasCopied } = useClipboard(nodeId);
  const url = getNodeUrl(nodeId, network);

  const InfoItem = ({
    label,
    value,
  }: {
    label: string;
    value: React.ReactNode;
  }) => (
    <Flex>
      <Text fontWeight='bold' mr={2}>
        {label}:
      </Text>
      <Text>{value}</Text>
    </Flex>
  );

  return (
    <GatewayCard title={t('info-card.card-header')}>
      <SimpleGrid columns={2} spacing={4}>
        <InfoItem
          label={t('info-card.node-id')}
          value={
            <Flex alignItems='center' gap={2}>
              {formatEllipsized(nodeId, 8)}
              <Box
                ml={2}
                as={CopyIcon}
                color='gray.500'
                height='20px'
                width='20px'
                onClick={onCopy}
                cursor='pointer'
                _hover={{ color: 'gray.700' }}
              />
              {hasCopied && (
                <Text fontSize='xs' color='green.500' ml={2}>
                  {t('common.copied')}
                </Text>
              )}
              <Link
                fontSize='sm'
                color='blue.600'
                href={url.toString()}
                target='_blank'
                rel='noreferrer'
                display='flex'
                alignItems='center'
                _hover={{ textDecoration: 'underline', color: 'blue.700' }}
              >
                {t('federation-card.view-link-on', { host: url.host })}
                <Box as={LinkIcon} ml={1} boxSize={4} />
              </Link>
            </Flex>
          }
        />

        <InfoItem label={t('info-card.alias')} value={alias} />
        <InfoItem
          label={t('info-card.pubkey')}
          value={formatEllipsized(pubkey, 8)}
        />
        <InfoItem label={t('info-card.network')} value={network} />
        <InfoItem label={t('info-card.block-height')} value={blockHeight} />
        <InfoItem
          label={t('info-card.synced-to-chain')}
          value={syncedToChain ? 'Yes' : 'No'}
        />
        <InfoItem label={t('info-card.mode')} value={Object.keys(mode)[0]} />
      </SimpleGrid>
    </GatewayCard>
  );
});
