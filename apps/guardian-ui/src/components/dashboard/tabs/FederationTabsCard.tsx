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
} from '@chakra-ui/react';
import { githubLight } from '@uiw/codemirror-theme-github';
import { json } from '@codemirror/lang-json';
import CodeMirror from '@uiw/react-codemirror';
import {
  ClientConfig,
  MetaFields,
  ModuleKind,
  SignedApiAnnouncement,
} from '@fedimint/types';
import { useTranslation } from '@fedimint/utils';
import { MetaManager } from './meta/MetaManager';
import { ConsensusMetaFields } from './meta/ViewConsensusMeta';

interface FederationTabsCardProps {
  config: ClientConfig | undefined;
  ourPeer: { id: number; name: string };
  signedApiAnnouncements: Record<string, SignedApiAnnouncement>;
}

export const FederationTabsCard: React.FC<FederationTabsCardProps> = ({
  config,
  ourPeer,
  signedApiAnnouncements,
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
      const peers = Object.entries(config.global.api_endpoints).map(
        ([id, endpoint]) => ({
          id: Number.parseInt(id, 10),
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
      <Tabs variant='soft-rounded' colorScheme='blue'>
        <CardHeader>
          <Flex direction='column' gap='4'>
            <Flex justify='space-between' align='center'>
              <TabList>
                <Tab>
                  {t('federation-dashboard.config.manage-meta.tab-label')}
                </Tab>
                <Tab>{t('federation-dashboard.config.api-announcements')}</Tab>
                <Tab>{t('federation-dashboard.config.view-config')}</Tab>
              </TabList>
            </Flex>
          </Flex>
        </CardHeader>
        <CardBody>
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
            <TabPanel>
              <CodeMirror
                value={JSON.stringify(signedApiAnnouncements, null, 2)}
                theme={githubLight}
                extensions={[json()]}
                basicSetup={{ autocompletion: true }}
                minWidth={'500px'}
                minHeight={'500px'}
                readOnly
              />
            </TabPanel>
          </TabPanels>
        </CardBody>
      </Tabs>
    </Card>
  ) : null;
};
