import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardBody, CardHeader, Skeleton, Text } from '@chakra-ui/react';
import { MSats, AuditSummary, ModuleKind } from '@fedimint/types';
import { KeyValues } from '@fedimint/ui';
import { formatMsatsToBtc, useTranslation } from '@fedimint/utils';
import { useAdminContext } from '../hooks';

export const BalanceCard: React.FC = () => {
  const { t } = useTranslation();
  const { api } = useAdminContext();
  const [auditSummary, setAuditSummary] = useState<AuditSummary>();

  // FIXME: we shouldn't default to 0 balance
  const walletBalance = auditSummary
    ? Object.entries(auditSummary.module_summaries).find(
        (m) => m[1].kind === ModuleKind.Wallet
      )?.[1].net_assets
    : (0 as MSats);

  useEffect(() => {
    const fetchBalance = () => {
      api.audit().then(setAuditSummary).catch(console.error);
    };
    fetchBalance();
    const interval = setInterval(fetchBalance, 5000);
    return () => clearInterval(interval);
  }, [api]);

  const keyValues = useMemo(
    () => [
      {
        key: 'bitcoin',
        label: t('common.bitcoin'),
        value:
          typeof walletBalance === 'number' ? (
            formatMsatsToBtc(walletBalance)
          ) : (
            <Skeleton height='20px' />
          ),
      },
    ],
    [walletBalance, t]
  );

  return (
    <Card w='100%'>
      <CardHeader>
        <Text size='lg' fontWeight='600'>
          {t('federation-dashboard.balance.label')}
        </Text>
      </CardHeader>
      <CardBody>
        <KeyValues direction='row' keyValues={keyValues} />
      </CardBody>
    </Card>
  );
};
