import React, { useCallback, useEffect, useState } from 'react';
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
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@chakra-ui/react';
import { githubLight } from '@uiw/codemirror-theme-github';
import { json } from '@codemirror/lang-json';
import CodeMirror from '@uiw/react-codemirror';
import { ClientConfig, MetaFields, ModuleKind } from '@fedimint/types';
import { fieldsToMeta, metaToHex, useTranslation } from '@fedimint/utils';
import { DEFAULT_META_KEY, MetaManager } from './meta/MetaManager';
import { EditMetaField } from './meta/EditMetaField';
import { ConsensusMetaFields } from './meta/ViewConsensusMeta';
import { useAdminContext } from '../hooks';
import { ModuleRpc } from '../types';

interface FederationConfigCardProps {
  config: ClientConfig | undefined;
  ourPeer: { id: number; name: string };
}

export const FederationConfigCard: React.FC<FederationConfigCardProps> = ({
  config,
  ourPeer,
}) => {
  const { t } = useTranslation();
  const { api } = useAdminContext();
  const [metaModuleId, setMetaModuleId] = useState<string | undefined>(
    undefined
  );
  const [consensusMeta, setConsensusMeta] = useState<ConsensusMetaFields>();
  const [editedMetaFields, setEditedMetaFields] = useState<MetaFields>([]);
  const { isOpen, onOpen: originalOnOpen, onClose } = useDisclosure();

  useEffect(() => {
    const metaModuleId = config
      ? Object.entries(config.modules).find(
          (m) => m[1].kind === ModuleKind.Meta
        )?.[0]
      : undefined;
    setMetaModuleId(metaModuleId);
  }, [config]);

  const onOpen = useCallback(() => {
    if (consensusMeta) {
      setEditedMetaFields([...consensusMeta.value]); // Ensure a new array reference
    }
    originalOnOpen();
  }, [consensusMeta, originalOnOpen]);

  const proposeMetaEdits = useCallback(() => {
    if (metaModuleId === undefined) {
      return;
    }

    if (editedMetaFields === consensusMeta?.value) {
      console.log('Meta fields proposed are already in consensus');
      setEditedMetaFields([]);
      return;
    }

    api
      .moduleApiCall<{ metaValue: string }[]>(
        Number(metaModuleId),
        ModuleRpc.submitMeta,
        {
          key: DEFAULT_META_KEY,
          value: metaToHex(fieldsToMeta(editedMetaFields)),
        }
      )
      .then(() => {
        setEditedMetaFields([]);
        onClose();
      })
      .catch(console.error);
  }, [api, metaModuleId, editedMetaFields, consensusMeta, onClose]);

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
                <Tab>{t('federation-dashboard.config.view-config')}</Tab>
                <Tab>
                  {t('federation-dashboard.config.manage-meta.tab-label')}
                </Tab>
              </TabList>
              <Button onClick={onOpen}>
                {t(
                  'federation-dashboard.config.manage-meta.propose-new-meta-button'
                )}
              </Button>
            </Flex>
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
                consensusMeta={consensusMeta}
                setConsensusMeta={setConsensusMeta}
                editedMetaFields={editedMetaFields}
                setEditedMetaFields={setEditedMetaFields}
                ourPeer={ourPeer}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent
            maxWidth={{ base: '100%', md: '80%' }}
            width={{ base: '100%', md: '80%' }}
          >
            <ModalHeader>
              {t('federation-dashboard.config.manage-meta.edit-meta-label')}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <EditMetaField
                metaFields={editedMetaFields}
                onChangeMetaFields={setEditedMetaFields}
                protectDerivedMeta={false}
              />
            </ModalBody>
            <ModalFooter>
              <Button onClick={proposeMetaEdits}>
                {t(
                  'federation-dashboard.config.manage-meta.submit-meta-proposal'
                )}
              </Button>
              <Button onClick={onClose} ml={3} variant='ghost'>
                {t('common.cancel')}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </CardBody>
    </Card>
  ) : null;
};
