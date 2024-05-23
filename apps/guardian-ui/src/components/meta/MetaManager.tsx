import React, { useCallback } from 'react';
import {
  Flex,
  Text,
  Button,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Modal,
  useDisclosure,
  ModalFooter,
  useTheme,
  Divider,
} from '@chakra-ui/react';
import { fieldsToMeta, metaToHex, useTranslation } from '@fedimint/utils';
import { MetaFields } from '@fedimint/types';
import { ViewConsensusMeta, ConsensusMetaFields } from './ViewConsensusMeta';
import { ProposedMetas } from './ProposedMetas';
import { EditMetaField } from './EditMetaField';
import { useAdminContext } from '../../hooks';
import { ModuleRpc } from '../../types';

export const DEFAULT_META_KEY = 0;
const POLL_TIMEOUT_MS = 2000;

const metaArrayToObject = (
  metaArray: [string, string][]
): Record<string, string> => {
  return metaArray.reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);
};

interface MetaManagerProps {
  metaModuleId?: string;
  consensusMeta?: ConsensusMetaFields;
  setConsensusMeta: (meta: ConsensusMetaFields) => void;
  editedMetaFields: MetaFields;
  setEditedMetaFields: (fields: MetaFields) => void;
  ourPeer: { id: number; name: string };
  peers: { id: number; name: string }[];
}

export const MetaManager = React.memo(function MetaManager({
  metaModuleId,
  ourPeer,
  peers,
  consensusMeta,
  setConsensusMeta,
  editedMetaFields,
  setEditedMetaFields,
}: MetaManagerProps): JSX.Element {
  const { t } = useTranslation();
  const { api } = useAdminContext();
  const { isOpen, onOpen: originalOnOpen, onClose } = useDisclosure();
  const theme = useTheme();

  const onOpen = useCallback(() => {
    if (consensusMeta) {
      setEditedMetaFields([...consensusMeta.value]); // Ensure a new array reference
    }
    originalOnOpen();
  }, [consensusMeta, originalOnOpen, setEditedMetaFields]);

  const proposeMetaEdits = useCallback(() => {
    if (metaModuleId === undefined) {
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
  }, [api, metaModuleId, editedMetaFields, onClose, setEditedMetaFields]);

  return metaModuleId ? (
    <Flex
      flexDir={{ base: 'column', sm: 'column', md: 'row' }}
      gap={6}
      width='100%'
    >
      <ViewConsensusMeta
        metaKey={DEFAULT_META_KEY}
        metaModuleId={metaModuleId}
        consensusMeta={consensusMeta}
        updateConsensusMeta={(meta: ConsensusMetaFields) =>
          setConsensusMeta(meta)
        }
        pollTimeout={POLL_TIMEOUT_MS}
      />
      <Flex
        flexDir='column'
        width='100%'
        borderLeft={`1px solid ${theme.colors.border.input}`}
        pl={4}
      >
        <ProposedMetas
          ourPeer={ourPeer}
          peers={peers}
          metaModuleId={metaModuleId}
          consensusMeta={
            consensusMeta ? metaArrayToObject(consensusMeta.value) : {}
          }
          updateEditedMetaFields={(fields: MetaFields) => {
            setEditedMetaFields([...fields]);
          }}
          pollTimeout={POLL_TIMEOUT_MS}
          onOpen={onOpen}
        />
      </Flex>
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
            <Text fontSize='md' fontWeight='bold'>
              Proposing Updates to Federation Meta
            </Text>
            <Text fontSize='sm'>
              Fedimint allows you to propose updates to the meta fields, which
              are key-value pairs containing arbitrary information you might
              want to share with clients. These meta fields are consensus
              relevant, meaning they must be consistent across all federation
              members to ensure reliability.
            </Text>
            <Text fontSize='sm'>
              As a Fedimint guardian, you can propose updates to the meta
              fields. These updates will be reviewed and accepted by other
              guardians. Once a threshold of guardians accepts the update, it
              will become the new consensus meta for the federation.
            </Text>
            <Text fontSize='sm' mt={2}>
              The following meta fields are part of the core Fedimint protocol
              and are useful for your federation&apos;s meta:
            </Text>
            <Flex flexDir='column' pl={4} mt={2}>
              <Text fontSize='sm'>
                - <b>federation_expiry_timestamp</b>: A timestamp after which
                the federation will shut down. This is a Unix timestamp in
                seconds.
              </Text>
              <Text fontSize='sm'>
                - <b>federation_name</b>: The human-readable name of the
                federation.
              </Text>
              <Text fontSize='sm'>
                - <b>federation_icon_url</b>: A URL to a logo icon for the
                federation.
              </Text>
              <Text fontSize='sm'>
                - <b>welcome_message</b>: A welcome message for new users
                joining the federation.
              </Text>
              <Text fontSize='sm'>
                - <b>vetted_gateways</b>: A list of gateway identifiers vetted
                by the federation.
              </Text>
            </Flex>
            <Divider mt={4} />
            <EditMetaField
              metaFields={editedMetaFields}
              onChangeMetaFields={setEditedMetaFields}
              protectDerivedMeta={false}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={proposeMetaEdits}>
              {t('federation-dashboard.config.manage-meta.propose-meta')}
            </Button>
            <Button variant='ghost' onClick={onClose}>
              {t('common.cancel')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  ) : (
    <Text>{t('federation-dashboard.config.missing-meta-module')}</Text>
  );
});
