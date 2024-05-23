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
import { ClientConfig, MetaFields, ModuleKind } from '@fedimint/types';
import { useTranslation } from '@fedimint/utils';
import { MetaManager } from './meta/MetaManager';
import { ConsensusMetaFields } from './meta/ViewConsensusMeta';

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
  const [consensusMeta, setConsensusMeta] = useState<ConsensusMetaFields>();
  const [editedMetaFields, setEditedMetaFields] = useState<MetaFields>([]);
  const [peers, setPeers] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    if (config) {
      const peers = Object.entries(config.api_endpoints).map(
        ([id, endpoint]) => ({
          id: parseInt(id, 10),
          name: endpoint.name,
        })
      );
      setPeers(peers);
    }
  }, [config]);

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
            <Flex justify='space-between' align='center'>
              <TabList>
                <Tab>
                  {t('federation-dashboard.config.manage-meta.tab-label')}
                </Tab>
                <Tab>{t('federation-dashboard.config.view-config')}</Tab>
              </TabList>
            </Flex>
          </Flex>
          <TabPanels>
            <TabPanel>
              <MetaManager
                metaModuleId={metaModuleId}
                consensusMeta={consensusMeta}
                setConsensusMeta={setConsensusMeta}
                editedMetaFields={editedMetaFields}
                setEditedMetaFields={setEditedMetaFields}
                ourPeer={ourPeer}
                peers={peers}
              />
            </TabPanel>
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
          </TabPanels>
        </Tabs>
      </CardBody>
    </Card>
  ) : null;
};
