import React from 'react';
import { Box, Stack, TabPanel, Text } from '@chakra-ui/react';
import { TabHeader } from '.';
import { useTranslation } from '@fedimint/utils';

export const InfoTabHeader = (): JSX.Element => {
  const { t } = useTranslation();
  return <TabHeader>{t('info_tab.tab_header')}</TabHeader>;
};

interface InfoTabProps {
  balance_msat: number;
}

export const InfoTab = React.memo(function InfoTab(
  props: InfoTabProps
): JSX.Element {
  const { t } = useTranslation();
  const { balance_msat } = props;
  return (
    <TabPanel>
      <Stack spacing={2}>
        <Box>
          <Text fontWeight='500' fontSize='15px'>
            {t('info_tab.balance')};
          </Text>
          <Text>{balance_msat}</Text>
        </Box>
      </Stack>
    </TabPanel>
  );
});
