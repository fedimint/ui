import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Text } from '@chakra-ui/react';
import { AuditSummary } from '@fedimint/types';
import { useTranslation } from '@fedimint/utils';
import { useAdminContext } from '../hooks';
import BalanceTable from './BalanceTable';

export const BalanceCard: React.FC = () => {
  const { t } = useTranslation();
  const { api } = useAdminContext();
  const [auditSummary, setAuditSummary] = useState<AuditSummary>();

  useEffect(() => {
    const fetchBalance = () => {
      api.audit().then(setAuditSummary).catch(console.error);
    };
    fetchBalance();
    const interval = setInterval(fetchBalance, 5000);
    return () => clearInterval(interval);
  }, [api]);

  return (
    <Card w='100%'>
      <CardHeader>
        <Text size='lg' fontWeight='600'>
          {t('federation-dashboard.balance.label')}
        </Text>
      </CardHeader>
      <CardBody>
        {auditSummary ? (
          <BalanceTable auditSummary={auditSummary} />
        ) : (
          <Text>Loading...</Text>
        )}
      </CardBody>
    </Card>
  );
};
