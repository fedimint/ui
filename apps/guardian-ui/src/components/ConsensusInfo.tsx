import React from 'react';
import { Tooltip } from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import { useTranslation } from '@fedimint/utils';

interface Props {
  totalNumberOfGuardians: string;
}

export const ConsensusInfo = ({ totalNumberOfGuardians }: Props) => {
  const { t } = useTranslation();

  const potentialMaliciousGuardians =
    (parseInt(totalNumberOfGuardians) - 1) / 3;

  const consensusInfoText = t('set-config.guardian-consensus-text', {
    numberOfGuardians: `${totalNumberOfGuardians}`,
    maliciousGuardians: `${Math.floor(potentialMaliciousGuardians)}`,
  });

  return (
    <Tooltip
      label={consensusInfoText}
      aria-label={t('set-config.guardian-information')}
      hasArrow
      bg='#575b60'
    >
      <InfoOutlineIcon viewBox='5 0 20 30' boxSize={5} ml={2} />
    </Tooltip>
  );
};
