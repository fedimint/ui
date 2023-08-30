import React from 'react';
import {
  Text,
  useTheme,
  Flex,
  Link,
  Box,
  useClipboard,
} from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { GatewayCard } from '.';
import { ReactComponent as CopyIcon } from '../assets/svgs/copy.svg';
import { ReactComponent as LinkIcon } from '../assets/svgs/linkIcon.svg';

interface InfoCardProps {
  nodeId: string;
  nodeLink: string;
}

export const InfoCard = React.memo(function InfoCard(
  props: InfoCardProps
): JSX.Element {
  const { t } = useTranslation();
  const { nodeId, nodeLink } = props;
  const theme = useTheme();
  const { onCopy, hasCopied } = useClipboard(nodeId);

  return (
    <GatewayCard title={t('info-card.card_header')}>
      <Flex gap='8px'>
        <Text
          fontSize='md'
          color={theme.colors.gray[900]}
          fontFamily={theme.fonts.body}
          overflowWrap='break-word'
          wordBreak='break-word'
          cursor='pointer'
          onClick={onCopy}
        >
          {nodeId}
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
      <Flex gap='4px'>
        <Link
          fontSize='md'
          color={theme.colors.blue[600]}
          fontFamily={theme.fonts.body}
          _hover={{ textDecoration: 'underline' }}
          transition={`text-decoration 1s ease-in-out`}
          href={`https://amboss.space/node/${nodeLink}`}
          target='_blank'
          rel='noreferrer'
          w='fit-content'
        >
          {t('info-card.amboss_node_link_text')}
        </Link>
        <LinkIcon color={theme.colors.blue[600]} />
      </Flex>
    </GatewayCard>
  );
});
