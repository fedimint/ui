import React from 'react';
import { Text, useTheme } from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { GatewayCard } from './GatewayCard';

interface BalanceCardProps {
  balance_msat: number;
}

export const BalanceCard = React.memo(function BalanceCard(
  props: BalanceCardProps
): JSX.Element {
  const { t } = useTranslation();
  const { balance_msat } = props;
  const theme = useTheme();

  return (
    <GatewayCard
      title={t('balance-card.card_header')}
      description={t('balance-card.sentence')}
    >
      <Text
        fontSize='24px'
        fontWeight='600'
        color={theme.colors.gray[800]}
        fontFamily={theme.fonts.body}
      >
        {balance_msat}
      </Text>
    </GatewayCard>
  );
});
