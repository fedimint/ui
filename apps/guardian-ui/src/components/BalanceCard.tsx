import { Card, CardBody, CardHeader, Text } from '@chakra-ui/react';
import { KeyValues } from '@fedimint/ui';
import { useTranslation } from '@fedimint/utils';
import React, { useMemo } from 'react';

export const BalanceCard: React.FC = () => {
  const { t } = useTranslation();

  const keyValues = useMemo(
    () => [
      {
        key: 'bitcoin',
        label: t('common.bitcoin'),
        // TODO: Use `audit` api to fill this in
        value: '0.00000000',
      },
    ],
    [t]
  );

  return (
    <Card>
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
