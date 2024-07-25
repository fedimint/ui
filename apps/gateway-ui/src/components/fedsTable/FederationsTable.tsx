import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Text,
  Flex,
  Link,
  useTheme,
} from '@chakra-ui/react';
import { FederationInfo } from '@fedimint/types';
import { useTranslation, formatEllipsized } from '@fedimint/utils';
import { Table, TableColumn, TableRow } from '@fedimint/ui';

interface FederationsTableProps {
  federations: FederationInfo[];
  onDeposit: (federation: FederationInfo) => void;
  onWithdraw: (federation: FederationInfo) => void;
}

export const FederationsTable: React.FC<FederationsTableProps> = ({
  federations,
  onDeposit,
  onWithdraw,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const columns: TableColumn<'id' | 'name' | 'balance' | 'actions'>[] = [
    { key: 'id', heading: t('federation-card.id') },
    { key: 'name', heading: t('federation-card.name') },
    { key: 'balance', heading: t('federation-card.balance') },
    { key: 'actions', heading: t('federation-card.actions') },
  ];

  const rows: TableRow<'id' | 'name' | 'balance' | 'actions'>[] =
    federations.map((federation) => ({
      key: federation.federation_id,
      id: (
        <Flex direction='column' gap='4px'>
          <Text>{formatEllipsized(federation.federation_id)}</Text>
          <Text size='xs'>
            <Link
              color={theme.colors.blue[600]}
              href={`#${federation.federation_id}`}
              target='_blank'
              rel='noreferrer'
            >
              {t('federation-card.view-details')}
            </Link>
          </Text>
        </Flex>
      ),
      name: federation.config.meta.federation_name,
      balance: `${federation.balance_msat / 1000} sats`,
      actions: (
        <Flex gap='8px'>
          <Link
            color={theme.colors.blue[600]}
            onClick={() => onDeposit(federation)}
          >
            {t('federation-card.deposit')}
          </Link>
          <Link
            color={theme.colors.blue[600]}
            onClick={() => onWithdraw(federation)}
          >
            {t('federation-card.withdraw')}
          </Link>
        </Flex>
      ),
    }));

  return (
    <Card>
      <CardHeader>
        <Text size='lg' fontWeight='600'>
          {t('federation-card.table-title')}
        </Text>
      </CardHeader>
      <CardBody>
        <Table columns={columns} rows={rows} />
      </CardBody>
    </Card>
  );
};
