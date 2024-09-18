import React from 'react';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';

interface NoPendingProposalsProps {
  setActiveTab: (tab: number) => void;
}

export const NoPendingProposals: React.FC<NoPendingProposalsProps> = ({
  setActiveTab,
}) => {
  const { t } = useTranslation();

  return (
    <Flex flexDirection='column' gap={6}>
      <Text fontSize='xl' fontWeight='bold'>
        {t(
          'federation-dashboard.config.manage-meta.no-pending-proposals-header'
        )}
      </Text>
      <Box bg='gray.100' p={6} borderRadius='md'>
        <Flex flexDirection='column' gap={4}>
          <Text>
            {t(
              'federation-dashboard.config.manage-meta.no-pending-proposals-description'
            )}
          </Text>
          <Button
            colorScheme='blue'
            onClick={() => setActiveTab(1)}
            alignSelf='flex-start'
          >
            {t(
              'federation-dashboard.config.manage-meta.propose-new-meta-button'
            )}
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
};
