import React from 'react';
import { FormControl, FormLabel, Select } from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { useGatewayContext } from '../../../context/hooks';
import {
  GATEWAY_APP_ACTION_TYPE,
  WalletModalAction,
} from '../../../types/gateway';
const FederationSelector: React.FC = () => {
  const { t } = useTranslation();
  const { state, dispatch } = useGatewayContext();
  const labelText =
    state.walletModalState.action === WalletModalAction.Receive
      ? t('wallet.to-federation')
      : t('wallet.from-federation');

  return (
    <FormControl>
      <FormLabel>{labelText}</FormLabel>
      <Select
        value={state.walletModalState.selectedFederation?.federation_id || ''}
        onChange={(e) => {
          const selected = state.gatewayInfo?.federations.find(
            (fed) => fed.federation_id === e.target.value
          );
          if (selected)
            dispatch({
              type: GATEWAY_APP_ACTION_TYPE.SET_WALLET_MODAL_STATE,
              payload: {
                ...state.walletModalState,
                selectedFederation: selected,
              },
            });
        }}
      >
        {state.gatewayInfo?.federations.map((federation) => (
          <option
            key={federation.federation_id}
            value={federation.federation_id}
          >
            {federation.config.global.meta.federation_name ||
              federation.federation_id}
          </option>
        ))}
      </Select>
    </FormControl>
  );
};

export default FederationSelector;
