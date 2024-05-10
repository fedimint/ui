import React from 'react';
import { Box, Text, Flex, theme } from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { bftHonest, bftFaulty } from '../utils';

interface BftInfoProps {
  numPeers: number;
}

export const BftInfo: React.FC<BftInfoProps> = ({ numPeers }) => {
  const { t } = useTranslation();

  return (
    <Box bg='blue.50' p={4} borderRadius='md' w={['100%', '50%']}>
      <Text
        mb='6px'
        fontSize='16px'
        fontWeight='500'
        color={theme.colors.gray[700]}
      >
        {t('set-config.bft-explanation-title', { total: numPeers })}
      </Text>
      <Flex direction='column' gap='6px'>
        <Text fontSize='sm'>
          {t('set-config.bft-explanation', {
            total: numPeers,
            honest: bftHonest(numPeers),
            faulty: bftFaulty(numPeers),
          })}
        </Text>
        <Text fontSize='sm'>
          {t('set-config.bft-faulty', {
            faulty: bftFaulty(numPeers),
          })}
        </Text>
      </Flex>
    </Box>
  );
};
