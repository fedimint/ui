import React, { useEffect, useState } from 'react';
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Text,
  Flex,
} from '@chakra-ui/react';
import { AuditSummary } from '@fedimint/types';
import { useTranslation } from '@fedimint/utils';
import { BalanceTable } from './BalanceTable';
import { useGuardianAdminApi } from '../../../../context/hooks';

export const BalanceCard: React.FC = () => {
  const { t } = useTranslation();
  const api = useGuardianAdminApi();
  const [auditSummary, setAuditSummary] = useState<AuditSummary>();
  const [unit, setUnit] = useState<'msats' | 'sats' | 'btc'>('msats');

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
        <Flex justifyContent='space-between' alignItems='center'>
          <Text size='lg' fontWeight='600'>
            {t('federation-dashboard.balance.label')}
          </Text>
          <ButtonGroup size='xs' borderRadius='md'>
            <Button
              onClick={() => setUnit('msats')}
              variant={unit === 'msats' ? 'solid' : 'ghost'}
            >
              msats
            </Button>
            <Button
              onClick={() => setUnit('sats')}
              variant={unit === 'sats' ? 'solid' : 'ghost'}
            >
              sats
            </Button>
            <Button
              onClick={() => setUnit('btc')}
              variant={unit === 'btc' ? 'solid' : 'ghost'}
            >
              BTC
            </Button>
          </ButtonGroup>
        </Flex>
      </CardHeader>
      <CardBody>
        {auditSummary ? (
          <BalanceTable auditSummary={auditSummary} unit={unit} />
        ) : (
          <Text>Loading...</Text>
        )}
      </CardBody>
    </Card>
  );
};
