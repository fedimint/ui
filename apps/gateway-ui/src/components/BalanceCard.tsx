import React from 'react';
import { Text, useTheme } from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { FedNameCard } from './FedNameCard';

interface BalanceCardProps {
  balance_msat: number;
  federationName: string;
  federationId?: string;
}

export const BalanceCard = React.memo(function BalanceCard(
  props: BalanceCardProps
): JSX.Element {
  const { t } = useTranslation();
  const { balance_msat } = props;
  const theme = useTheme();

  return (
    <FedNameCard
      title={t('federation-card.default-federation-name')}
      federationName={props.federationName}
      federationId={props.federationId}
      balanceMsat={balance_msat}
    >
      <Text variant='secondary' size='sm'>
        {t('balance-card.your-balance')}
      </Text>
      <Text
        fontSize='xl'
        fontWeight='600'
        color={theme.colors.gray[800]}
        fontFamily={theme.fonts.body}
      >
        {balance_msat / 1000} {'sats'}
      </Text>
    </FedNameCard>
  );
});
