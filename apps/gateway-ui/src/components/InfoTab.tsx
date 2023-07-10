import React from 'react';
import { Box, Stack, TabPanel, Text } from '@chakra-ui/react';
import { TabHeader } from '.';

export const InfoTabHeader = (): JSX.Element => {
  return <TabHeader>Info</TabHeader>;
};

interface InfoTabProps {
  balance_msat: number;
}

export const InfoTab = React.memo(function InfoTab(
  props: InfoTabProps
): JSX.Element {
  const { balance_msat } = props;
  return (
    <TabPanel>
      <Stack spacing={2}>
        <Box>
          <Text fontWeight='500' fontSize='15px'>
            Balance:
          </Text>
          <Text>{balance_msat}</Text>
        </Box>
      </Stack>
    </TabPanel>
  );
});
