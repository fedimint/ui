import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
} from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { MetaFields } from '@fedimint/types';
import { Table, TableColumn } from '@fedimint/ui';
import { formatJsonValue } from './ProposedMetas';

interface ConfirmNewMetaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedMeta: MetaFields | null;
}

export const ConfirmNewMetaModal: React.FC<ConfirmNewMetaModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  selectedMeta,
}) => {
  const { t } = useTranslation();

  const columnsWithoutEffect: TableColumn<'metaKey' | 'value'>[] = [
    {
      key: 'metaKey',
      heading: t('set-config.meta-fields-key'),
    },
    {
      key: 'value',
      heading: t('set-config.meta-fields-value'),
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {t('federation-dashboard.config.manage-meta.confirm-modal.title')}
        </ModalHeader>
        <ModalBody>
          <Text mb={4}>
            {t(
              'federation-dashboard.config.manage-meta.confirm-modal.description'
            )}
          </Text>
          {selectedMeta && (
            <Table
              columns={columnsWithoutEffect}
              rows={selectedMeta.map(([key, value]) => ({
                key: `${key}-${value}`,
                metaKey: <Text>{key}</Text>,
                value: formatJsonValue(value),
              }))}
            />
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant='ghost' onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button colorScheme='green' ml={3} onClick={onConfirm}>
            {t('common.confirm')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
