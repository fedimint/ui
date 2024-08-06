import React, { useState, useEffect, useMemo } from 'react';
import { Flex } from '@chakra-ui/react';
import { GatewayInfo, FederationInfo } from '@fedimint/types';
import { ConnectFederationModal, LightningCard } from './components';
import { GatewayApi } from './GatewayApi';
import { ApiProvider } from './ApiProvider';
import { Wrapper, Login } from '@fedimint/ui';
import { FederationsTable } from './components/federations/FederationsTable';
import { Loading } from './components/Loading';
import { Error } from './components/Error';
import { HeaderWithUnitSelector } from './components/HeaderWithUnitSelector';
import { WalletCard } from './components/walletCard/WalletCard';

export const UNIT_OPTIONS = ['msats', 'sats', 'btc'] as const;
export type Unit = (typeof UNIT_OPTIONS)[number];

export interface WalletModalState {
  isOpen: boolean;
  action: 'deposit' | 'withdraw';
  type: 'ecash' | 'lightning' | 'onchain';
  selectedFederation: FederationInfo | null;
}

export const App = React.memo(function Admin(): JSX.Element {
  const gateway = useMemo(() => new GatewayApi(), []);

  const [gatewayInfo, setGatewayInfo] = useState<GatewayInfo>({
    federations: [],
    fees: {
      base_msat: 0,
      proportional_millionths: 0,
    },
    gateway_id: '',
    gateway_state: '',
    lightning_alias: '',
    lightning_pub_key: '',
    route_hints: [],
    version_hash: '',
    network: undefined,
  });
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showConnectFed, setShowConnectFed] = useState(false);
  const [unit, setUnit] = useState<Unit>('sats');
  const [walletModalState, setWalletModalState] = useState<WalletModalState>({
    isOpen: false,
    action: 'deposit',
    type: 'ecash',
    selectedFederation: null,
  });

  useEffect(() => {
    setLoading(true);
    if (!authenticated) {
      gateway
        .testPassword()
        .then((authed) => {
          setAuthenticated(authed);
          if (!authed) {
            setLoading(false);
          }
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    } else {
      const fetchInfo = () => {
        gateway
          .fetchInfo()
          .then((gatewayInfo) => {
            setGatewayInfo(gatewayInfo);
          })
          .catch(({ message, error }) => {
            console.error(error);
            setError(message);
          });
      };

      fetchInfo();
      setLoading(false);
      const interval = setInterval(fetchInfo, 5000);
      return () => clearInterval(interval);
    }
  }, [gateway, authenticated]);

  const handleDeposit = (federation: FederationInfo) => {
    // Implement deposit logic here
    console.log('Deposit for federation:', federation.federation_id);
  };

  const handleWithdraw = (federation: FederationInfo) => {
    // Implement withdraw logic here
    console.log('Withdraw from federation:', federation.federation_id);
  };

  const content = useMemo(() => {
    if (loading) return <Loading />;
    if (error) return <Error error={error} />;
    if (!authenticated) {
      return (
        <Login
          checkAuth={gateway.testPassword}
          setAuthenticated={() => setAuthenticated(true)}
          parseError={(err) => (err as Error).message}
        />
      );
    }

    return (
      <Flex direction='column' gap={4}>
        <HeaderWithUnitSelector setUnit={setUnit} />
        <WalletCard
          federations={gatewayInfo.federations}
          setWalletModalState={setWalletModalState}
        />
        <LightningCard
          nodeId={gatewayInfo.gateway_id}
          network={gatewayInfo.network}
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
      </Flex>
    );
  }, [
    gateway,
    loading,
    authenticated,
    showConnectFed,
    error,
    gatewayInfo,
    unit,
  ]);

  return (
    <ApiProvider props={{ gateway }}>
      <Wrapper size='lg'>{content}</Wrapper>
    </ApiProvider>
  );
});
