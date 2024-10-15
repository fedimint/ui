import React from 'react';
import { Text, Flex, Link, useTheme, Button } from '@chakra-ui/react';
import { FederationInfo, MSats } from '@fedimint/types';
import { useTranslation, formatEllipsized, formatValue } from '@fedimint/utils';
import { Table, TableColumn, TableRow } from '@fedimint/ui';
import { ViewConfigModal } from './ViewConfig';
import {
  WalletModalAction,
  WalletModalState,
  WalletModalType,
} from '../walletModal/WalletModal';
import { Unit } from '../../../types';

interface FederationsTableProps {
  federations: FederationInfo[];
  onConnectFederation: () => void;
  unit: Unit;
  setWalletModalState: (state: WalletModalState) => void;
}

export const FederationsTable: React.FC<FederationsTableProps> = ({
  federations,
  onConnectFederation,
  unit,
  setWalletModalState,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const columns: TableColumn<'name' | 'id' | 'balance' | 'actions'>[] = [
    { key: 'name', heading: t('federation-card.name') },
    { key: 'id', heading: t('federation-card.id') },
    { key: 'balance', heading: t('federation-card.balance') },
    { key: 'actions', heading: t('federation-card.actions') },
  ];

  const rows: TableRow<'name' | 'id' | 'balance' | 'actions'>[] =
    federations.map((federation) => ({
      key: federation.federation_id,
      name: federation.config.global.meta.federation_name,
      id: (
        <Flex direction='column' alignItems='flex-start'>
          <Text fontSize='sm' fontWeight='medium'>
            {formatEllipsized(federation.federation_id)}
          </Text>
          <Button
            as={ViewConfigModal}
            federationId={federation.federation_id}
            config={federation.config}
            variant='link'
            size='sm'
            colorScheme='blue'
            fontWeight='normal'
            padding='0'
            height='auto'
          >
            {t('federation-card.view-config')}
          </Button>
        </Flex>
      ),
      balance: formatValue(federation.balance_msat as MSats, unit, true),
      actions: (
        <Flex gap='8px'>
          <Link
            color={theme.colors.blue[600]}
            onClick={() =>
              setWalletModalState({
                action: WalletModalAction.Receive,
                type: WalletModalType.Onchain,
                selectedFederation: federation,
                isOpen: true,
              })
            }
          >
            {t('federation-card.receive')}
          </Link>
          <Link
            color={theme.colors.blue[600]}
            onClick={() =>
              setWalletModalState({
                action: WalletModalAction.Send,
                type: WalletModalType.Onchain,
                selectedFederation: federation,
                isOpen: true,
              })
            }
          >
            {t('federation-card.send')}
          </Link>
        </Flex>
      ),
    }));

  return (
    <Flex direction='column' gap={4}>
      <Flex alignItems='center' justifyContent='flex-end'>
        <Button onClick={onConnectFederation}>
          {t('connect-federation.connect-federation-button')}
        </Button>
      </Flex>
      <Table columns={columns} rows={rows} />
    </Flex>
  );
};
