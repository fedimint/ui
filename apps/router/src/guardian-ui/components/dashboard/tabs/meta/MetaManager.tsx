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
import { ModuleRpc } from '../../../../types';
import { useGuardianAdminApi } from '../../../../../context/hooks';

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
  const api = useGuardianAdminApi();
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
      .catch((error) => {
        console.error(error);
        alert('Failed to propose meta edits. Please try again.');
      });
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
              {t('federation-dashboard.config.manage-meta.setup-meta-title')}
            </Text>
            <Text fontSize='sm'>
              {t(
                'federation-dashboard.config.manage-meta.setup-meta-description'
              )}
            </Text>
            <Text fontSize='sm'>
              {t('federation-dashboard.config.manage-meta.propose-updates')}
            </Text>
            <Text fontSize='sm' mt={2}>
              {t('federation-dashboard.config.manage-meta.core-meta-fields')}
            </Text>
            <Flex flexDir='column' pl={4} mt={2}>
              <Text fontSize='sm'>
                - <b>federation_expiry_timestamp</b>:{' '}
                {t('federation-dashboard.config.manage-meta.meta-field-expiry')}
              </Text>
              <Text fontSize='sm'>
                - <b>federation_name</b>:{' '}
                {t('federation-dashboard.config.manage-meta.meta-field-name')}
              </Text>
              <Text fontSize='sm'>
                - <b>federation_icon_url</b>:{' '}
                {t('federation-dashboard.config.manage-meta.meta-field-icon')}
              </Text>
              <Text fontSize='sm'>
                - <b>welcome_message</b>:{' '}
                {t(
                  'federation-dashboard.config.manage-meta.meta-field-welcome'
                )}
              </Text>
              <Text fontSize='sm'>
                - <b>vetted_gateways</b>:{' '}
                {t(
                  'federation-dashboard.config.manage-meta.meta-field-gateways'
                )}
              </Text>
            </Flex>
            <Text fontSize='sm' mt={2}>
              {t('federation-dashboard.config.manage-meta.your-own-fields')}
            </Text>
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
