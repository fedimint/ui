import React, { useState, useEffect, useMemo } from 'react';
import { Flex } from '@chakra-ui/react';
import { GatewayInfo, FederationInfo, GatewayBalances } from '@fedimint/types';
import { ConnectFederationModal, LightningCard } from './components';
import { ApiContext } from './ApiProvider';
import { Wrapper, Login } from '@fedimint/ui';
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
import { ErrorMessage } from './components/ErrorMessage';

export const UNIT_OPTIONS = ['msats', 'sats', 'btc'] as const;
export type Unit = (typeof UNIT_OPTIONS)[number];

export const Main = React.memo(function Admin(): JSX.Element {
  const { gateway } = React.useContext(ApiContext);
  const [balances, setBalances] = useState<GatewayBalances | null>(null);
  const [gatewayInfo, setGatewayInfo] = useState<GatewayInfo | null>(null);

  // Whether the user has successfully authenticated with the gateway.
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  // Whether we are currently checking the authentication status.
  const [runningInitialAuthCheck, setRunningInitialAuthCheck] = useState(false);
  const [error, setError] = useState<string>('');
  const [showConnectFed, setShowConnectFed] = useState(false);
  const [unit, setUnit] = useState<Unit>('sats');
  const [walletModalState, setWalletModalState] = useState<WalletModalState>({
    isOpen: false,
    action: WalletModalAction.Receive,
    type: WalletModalType.Onchain,
    selectedFederation: null,
  });

  // Attempt to authenticate with the saved password on initial load and skip the login screen if successful.
  useEffect(() => {
    setRunningInitialAuthCheck(true);
    gateway
      .testPassword()
      .then((authed) => {
        setIsAuthenticated(authed);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setRunningInitialAuthCheck(false));
  }, [gateway]);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchInfoAndConfigs = async () => {
        try {
          const gatewayInfo = await gateway.fetchInfo();

          const configs = await gateway.fetchConfigs();

          const updatedFederations = gatewayInfo.federations.map(
            (federation) => ({
              ...federation,
              config: configs.federations[federation.federation_id],
            })
          );

          setGatewayInfo({ ...gatewayInfo, federations: updatedFederations });
        } catch (error: unknown) {
          console.error(error);
          setError((error as Error).message);
        }
      };

      const fetchBalances = () => {
        gateway
          .fetchBalances()
          .then((balances) => {
            setBalances(balances);
          })
          .catch(({ message, error }) => {
            console.error(error);
            setError(message);
          });
      };

      fetchInfoAndConfigs();
      fetchBalances();

      const interval = setInterval(fetchInfoAndConfigs, 5000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, gateway]);

  const content = useMemo(() => {
    if (runningInitialAuthCheck) return <Loading />;
    if (error) return <ErrorMessage error={error} />;
    if (!isAuthenticated) {
      return (
        <Login
          checkAuth={gateway.testPassword}
          setAuthenticated={() => setIsAuthenticated(true)}
          parseError={(err) => (err as Error).message}
        />
      );
    }

    if (!gatewayInfo) return <Loading />;

    return (
      <Flex direction='column' gap={4}>
        <HeaderWithUnitSelector setUnit={setUnit} />
        {balances && (
          <WalletCard
            unit={unit}
            balances={balances}
            setWalletModalState={setWalletModalState}
            federations={gatewayInfo.federations}
          />
        )}
        <LightningCard
          nodeId={gatewayInfo.gateway_id}
          network={gatewayInfo.network}
          alias={gatewayInfo.lightning_alias}
          mode={gatewayInfo.lightning_mode}
          pubkey={gatewayInfo.lightning_pub_key}
          blockHeight={gatewayInfo.block_height}
          syncedToChain={gatewayInfo.synced_to_chain}
        />
        <FederationsTable
          unit={unit}
          federations={gatewayInfo.federations}
          onConnectFederation={() => setShowConnectFed(true)}
          setWalletModalState={setWalletModalState}
        />
        <ConnectFederationModal
          isOpen={showConnectFed}
          onClose={() => setShowConnectFed(false)}
          renderConnectedFedCallback={(federation: FederationInfo) => {
            setGatewayInfo({
              ...gatewayInfo,
              federations: [...gatewayInfo.federations, federation],
            });
            setShowConnectFed(false);
          }}
        />
        <WalletModal
          federations={gatewayInfo.federations}
          walletModalState={walletModalState}
          setWalletModalState={setWalletModalState}
        />
      </Flex>
    );
  }, [
    runningInitialAuthCheck,
    isAuthenticated,
    showConnectFed,
    error,
    gatewayInfo,
    unit,
    walletModalState,
    balances,
    gateway,
  ]);

  return <Wrapper size='lg'>{content}</Wrapper>;
});
