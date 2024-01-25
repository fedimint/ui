import React from 'react';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { GuardiansTable } from './GuardiansTable';
import { GatewaysTable } from './GatewaysTable';
import { useTranslation } from '@fedimint/utils';
import {
  ClientConfig,
  ModulesConfigResponse,
  StatusResponse,
} from '@fedimint/types';
import { AdminCards } from './AdminCards';

interface TabsCardProps {
  status: StatusResponse | undefined;
  config: ClientConfig | undefined;
  modulesConfigs: ModulesConfigResponse | undefined;
}

export const TabsCard: React.FC<TabsCardProps> = ({
  status,
  config,
  modulesConfigs,
}) => {
  const { t } = useTranslation();

  return (
    <Tabs>
      <TabList>
        <Tab>Admin</Tab>
        <Tab>{t('federation-dashboard.guardians.label')}</Tab>
        <Tab>{t('federation-dashboard.gateways.label')}</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <AdminCards
            status={status}
            config={config}
            modulesConfigs={modulesConfigs}
          />
        </TabPanel>
        <TabPanel>
          <GuardiansTable status={status} config={config} />
        </TabPanel>
        <TabPanel>
          <GatewaysTable config={config} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
