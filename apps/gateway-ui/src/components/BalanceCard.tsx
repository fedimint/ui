import React from 'react';
import { Text, useTheme } from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { FedNameCard } from './FedNameCard';
import { Federation } from '@fedimint/types';

interface BalanceCardProps {
  balance_msat: number;
  federationId: string;
  setFederationId: (federation: string) => void;
  federations: Federation[];
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
      setFederationId={props.setFederationId}
      federationId={props.federationId}
      federations={props.federations}
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
