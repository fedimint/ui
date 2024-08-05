import React from 'react';
import { FormControl, FormLabel, Input, Select } from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { FormGroup } from '@fedimint/ui';
import { ReactComponent as FedimintLogo } from '../../../../assets/svgs/fedimint.svg';
import { BftInfo } from '../../../BftInfo';

interface FederationSettingsFormProps {
  federationName: string;
  handleChangeFederationName: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  isHost: boolean;
  numPeers: string;
  setNumPeers: (value: string) => void;
}

export const FederationSettingsForm: React.FC<FederationSettingsFormProps> = ({
  federationName,
  handleChangeFederationName,
  isHost,
  numPeers,
  setNumPeers,
}) => {
  const { t } = useTranslation();

  const bftNumbers = [4, 7, 10, 13, 16, 19];

  return (
    <FormGroup
      icon={FedimintLogo}
      title={`${t('set-config.federation-settings')}`}
      isOpen={true}
    >
      <FormControl>
        <FormLabel>{t('set-config.federation-name')}</FormLabel>
        <Input value={federationName} onChange={handleChangeFederationName} />
      </FormControl>
      {isHost && (
        <FormControl>
          <FormLabel>{t('set-config.guardian-number')}</FormLabel>
          <Select
            value={numPeers}
            onChange={(e) => setNumPeers(e.target.value)}
          >
            {bftNumbers.map((num) => (
              <option key={num} value={num.toString()}>
                {num}
              </option>
            ))}
          </Select>
        </FormControl>
      )}
      <BftInfo numPeers={parseInt(numPeers)} />
    </FormGroup>
  );
};
