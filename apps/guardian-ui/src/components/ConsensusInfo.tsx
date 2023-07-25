import React from 'react';
import { Tooltip } from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';

export const ConsensusInfo = () => {
  const totalGuardians = 10;
  const potentialMaliciousGuardians = 3;

  const consensusInfoText = `
    If the total number of guardians is ${totalGuardians}, 
    the expected number of potential malicious guardians is ${potentialMaliciousGuardians}. 
    This is according to the formula 3*f + 1 = n, 
    where f is the number of potential malicious guardians, 
    and n the total number of guardians.
  `;

  return (
    <Tooltip
      label={consensusInfoText}
      aria-label='Guardian Information'
      hasArrow
      bg='#575b60'
    >
      <InfoOutlineIcon viewBox='5 0 20 30' boxSize={5} />
    </Tooltip>
  );
};
