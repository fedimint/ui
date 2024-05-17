import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
} from '@chakra-ui/react';
import { githubLight } from '@uiw/codemirror-theme-github';
import { json } from '@codemirror/lang-json';
import CodeMirror from '@uiw/react-codemirror';
import { ClientConfig, ModuleKind } from '@fedimint/types';
import { useTranslation } from '@fedimint/utils';
import { MetaManager } from './meta/MetaManager';

interface FederationConfigCardProps {
  config: ClientConfig | undefined;
  ourPeer: { id: number; name: string };
}

export const FederationConfigCard: React.FC<FederationConfigCardProps> = ({
  config,
  ourPeer,
}) => {
  const { t } = useTranslation();
  const [metaModuleId, setMetaModuleId] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    const metaModuleId = config
      ? Object.entries(config.modules).find(
          (m) => m[1].kind === ModuleKind.Meta
        )?.[0]
      : undefined;
    setMetaModuleId(metaModuleId);
  }, [config]);

  return config ? (
    <Card flex='1'>
      <CardHeader>
        <Text size='lg' fontWeight='600'>
          {t('federation-dashboard.config.label')}
        </Text>
      </CardHeader>
      <CardBody>
        <Tabs variant='soft-rounded' colorScheme='blue'>
          <Flex direction='column' gap='4'>
            <TabList justifySelf='center'>
              <Tab>{t('federation-dashboard.config.view-config')}</Tab>
              <Tab>
                {t('federation-dashboard.config.manage-meta.tab-label')}
              </Tab>
            </TabList>
          </Flex>
          <TabPanels>
            <TabPanel>
              <CodeMirror
                value={JSON.stringify(config, null, 2)}
                theme={githubLight}
                extensions={[json()]}
                basicSetup={{ autocompletion: true }}
                minWidth={'500px'}
                minHeight={'500px'}
                readOnly
              />
            </TabPanel>
            <TabPanel>
              <MetaManager
                metaModuleId={metaModuleId}
                metaConfig={config.meta}
                ourPeer={ourPeer}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </CardBody>
    </Card>
  ) : null;
};
