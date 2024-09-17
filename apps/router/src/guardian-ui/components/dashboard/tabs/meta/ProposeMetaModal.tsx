import React from 'react';
import {
  Text,
  Button,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Modal,
  ModalFooter,
  Flex,
  Divider,
} from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { MetaFields } from '@fedimint/types';
import { EditMetaField } from './EditMetaField';

interface ProposeMetaModalProps {
  isOpen: boolean;
  onClose: () => void;
  editedMetaFields: MetaFields;
  setEditedMetaFields: (fields: MetaFields) => void;
  proposeMetaEdits: () => void;
}

export const ProposeMetaModal: React.FC<ProposeMetaModalProps> = ({
  isOpen,
  onClose,
  editedMetaFields,
  setEditedMetaFields,
  proposeMetaEdits,
}) => {
  const { t } = useTranslation();

  return (
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
              {t('federation-dashboard.config.manage-meta.meta-field-welcome')}
            </Text>
            <Text fontSize='sm'>
              - <b>vetted_gateways</b>:{' '}
              {t('federation-dashboard.config.manage-meta.meta-field-gateways')}
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
  );
};
