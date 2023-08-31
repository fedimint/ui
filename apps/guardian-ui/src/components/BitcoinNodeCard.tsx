import { Card, CardBody, CardHeader, Text } from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import React, { useMemo } from 'react';
import { ConfigResponse } from '../types';
import { KeyValues } from '@fedimint/ui';

interface Props {
  config: ConfigResponse | undefined;
}

export const BitcoinNodeCard: React.FC<Props> = () => {
  const { t } = useTranslation();

  // TODO: Populate values from config.client_config.modules.config
  // It's currently mysteriously hex encoded
  const keyValues = useMemo(
    () => [
      {
        key: 'url',
        label: t('federation-dashboard.bitcoin-node.url-label'),
        value: t('common.unknown'),
      },
      {
        key: 'blockHeight',
        label: t('federation-dashboard.bitcoin-node.block-height-label'),
        value: t('common.unknown'),
      },
    ],
    [t]
  );

  return (
    <Card w='100%'>
      <CardHeader>
        <Text size='lg' fontWeight='600'>
          {t('federation-dashboard.bitcoin-node.label')}
        </Text>
      </CardHeader>
      <CardBody>
        <KeyValues direction='row' keyValues={keyValues} />
      </CardBody>
    </Card>
  );
};
