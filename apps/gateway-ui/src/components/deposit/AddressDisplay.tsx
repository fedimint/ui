import React from 'react';
import { Text, Flex, Box, useTheme, useClipboard } from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { ReactComponent as CopyIcon } from '../../assets/svgs/copy.svg';

interface AddressDisplayProps {
  address: string;
}

export const AddressDisplay: React.FC<AddressDisplayProps> = ({ address }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { onCopy, hasCopied } = useClipboard(address);

  return (
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
  );
};
