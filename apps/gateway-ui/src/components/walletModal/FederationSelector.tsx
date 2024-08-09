import React from 'react';
import { FormControl, FormLabel, Select } from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { FederationInfo } from '@fedimint/types';
import { WalletModalAction, WalletModalState } from './WalletModal';

interface FederationSelectorProps {
  federations: FederationInfo[];
  walletModalState: WalletModalState;
  setWalletModalState: (state: WalletModalState) => void;
}

const FederationSelector: React.FC<FederationSelectorProps> = ({
  federations,
  walletModalState,
  setWalletModalState,
}) => {
  const { t } = useTranslation();
  const labelText =
    walletModalState.action === WalletModalAction.Receive
      ? t('wallet.to-federation')
      : t('wallet.from-federation');

  return (
    <FormControl>
      <FormLabel>{labelText}</FormLabel>
      <Select
        value={walletModalState.selectedFederation?.federation_id || ''}
        onChange={(e) => {
          const selected = federations.find(
            (fed) => fed.federation_id === e.target.value
          );
          if (selected)
            setWalletModalState({
              ...walletModalState,
              selectedFederation: selected,
            });
        }}
      >
        {federations.map((federation) => (
          <option
            key={federation.federation_id}
            value={federation.federation_id}
          >
            {federation.config.meta.federation_name || federation.federation_id}
          </option>
        ))}
      </Select>
    </FormControl>
  );
};

export default FederationSelector;
