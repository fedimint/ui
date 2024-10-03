import React, { useState } from 'react';
import { Flex } from '@chakra-ui/react';
import { ConnectFederationModal, LightningCard } from './components';
import { FederationsTable } from './components/federations/FederationsTable';
import { Loading } from './components/Loading';
import { HeaderWithUnitSelector } from './components/HeaderWithUnitSelector';
import { WalletCard } from './components/walletCard/WalletCard';
import {
  WalletModal,
  WalletModalAction,
  WalletModalState,
  WalletModalType,
} from './components/walletModal/WalletModal';
import { useGatewayContext, useLoadGateway } from '../context/hooks';
import { ErrorMessage } from './components/ErrorMessage';
import { Login } from '@fedimint/ui';
import { GATEWAY_APP_ACTION_TYPE } from '../types/gateway';
import { useAuthContext } from '../hooks/useAuthContext';

export const Gateway = () => {
  const { state, dispatch, api, id } = useGatewayContext();
  const { storeGatewayPassword } = useAuthContext();
  const [showConnectFed, setShowConnectFed] = useState(false);
  const [walletModalState, setWalletModalState] = useState<WalletModalState>({
    isOpen: false,
    action: WalletModalAction.Receive,
    type: WalletModalType.Onchain,
    selectedFederation: null,
  });

  useLoadGateway();
  if (state.needsAuth) {
    return (
      <Login
        checkAuth={(password) => api.testPassword(password ?? '')}
        setAuthenticated={(password) => {
          storeGatewayPassword(id, password);
          dispatch({
            type: GATEWAY_APP_ACTION_TYPE.SET_NEEDS_AUTH,
            payload: false,
          });
        }}
        parseError={(err) => (err as Error).message}
      />
    );
  }
  if (state.gatewayError) return <ErrorMessage error={state.gatewayError} />;
  if (state.gatewayInfo === null) return <Loading />;

  return (
    <Flex direction='column' gap={4}>
      <HeaderWithUnitSelector />
      {state.balances && (
        <WalletCard
          unit={state.unit}
          balances={state.balances}
          setWalletModalState={setWalletModalState}
          federations={state.gatewayInfo.federations}
        />
      )}
      <LightningCard
        nodeId={state.gatewayInfo.gateway_id}
        network={state.gatewayInfo.network}
        alias={state.gatewayInfo.lightning_alias}
        mode={state.gatewayInfo.lightning_mode}
        pubkey={state.gatewayInfo.lightning_pub_key}
        blockHeight={state.gatewayInfo.block_height}
        syncedToChain={state.gatewayInfo.synced_to_chain}
      />
      <FederationsTable
        unit={state.unit}
        federations={state.gatewayInfo.federations}
        onConnectFederation={() => setShowConnectFed(true)}
        setWalletModalState={setWalletModalState}
      />
      <ConnectFederationModal
        isOpen={showConnectFed}
        onClose={() => setShowConnectFed(false)}
      />
      <WalletModal
        federations={state.gatewayInfo.federations}
        walletModalState={walletModalState}
        setWalletModalState={setWalletModalState}
      />
    </Flex>
  );
};
