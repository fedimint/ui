import React from 'react';
import { Tooltip } from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import { useTranslation } from '@fedimint/utils';

interface Props {
  numberOfGuardians: string;
}

export const ConsensusInfo = ({ numberOfGuardians }: Props) => {
  const { t } = useTranslation();

  const totalGuardians = numberOfGuardians;
  const potentialMaliciousGuardians = (parseInt(totalGuardians) - 1) / 3;

  const consensusInfoText = `
    If the total number of guardians is ${totalGuardians}, 
    the expected number of potential malicious guardians 
    is ${Math.floor(potentialMaliciousGuardians)}. 
    This is according to the formula 3*f + 1 = n, 
    where f is the number of potential malicious guardians, 
    and n the total number of guardians.
  `;

  return (
    <Tooltip
      label={consensusInfoText}
      aria-label={t('set-config.guardian-information')}
      hasArrow
      bg='#575b60'
    >
      <InfoOutlineIcon viewBox='5 0 20 30' boxSize={5} />
    </Tooltip>
  );
};
