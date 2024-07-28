import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Heading,
  Flex,
  useTheme,
  Tabs,
  TabList,
  Tab,
} from '@chakra-ui/react';
import { GatewayInfo, FederationInfo } from '@fedimint/types';
import { ConnectFederationModal, InfoCard } from './components';
import { GatewayApi } from './GatewayApi';
import { ApiProvider } from './ApiProvider';
import { Wrapper, Login } from '@fedimint/ui';
import { useTranslation } from '@fedimint/utils';
import { FederationsTable } from './components/federations/FederationsTable';
import { Loading } from './components/Loading';
import { Error } from './components/Error';

export const UNIT_OPTIONS = ['msats', 'sats', 'btc'] as const;
export type Unit = (typeof UNIT_OPTIONS)[number];

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
  const theme = useTheme();
  const { t } = useTranslation();
  const [unit, setUnit] = useState<Unit>('sats');

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
      <Box>
        <Flex
          direction={['column', 'row']}
          justifyContent='space-between'
          alignItems={['flex-start', 'center']}
          mb='8'
        >
          <Heading
            as='h1'
            fontSize={['xl', '2xl']}
            fontWeight='500'
            color={theme.colors.gray[900]}
            mb={[4, 0]}
          >
            {t('header.title')}
          </Heading>
          <Tabs
            size='sm'
            variant='soft-rounded'
            defaultIndex={1}
            onChange={(index) => setUnit(UNIT_OPTIONS[index])}
          >
            <TabList>
              {UNIT_OPTIONS.map((option) => (
                <Tab
                  key={option}
                  _selected={{
                    bg: theme.colors.blue[500],
                    color: 'white',
                  }}
                >
                  {option.toUpperCase()}
                </Tab>
              ))}
            </TabList>
          </Tabs>
        </Flex>
        <InfoCard
          nodeId={gatewayInfo.gateway_id}
          network={gatewayInfo.network}
        />
        <FederationsTable
          unit={unit}
          federations={gatewayInfo.federations}
          onDeposit={handleDeposit}
          onWithdraw={handleWithdraw}
          onConnectFederation={() => setShowConnectFed(true)}
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
      </Box>
    );
  }, [
    gateway,
    loading,
    authenticated,
    showConnectFed,
    error,
    gatewayInfo,
    theme,
    t,
    unit,
  ]);

  return (
    <ApiProvider props={{ gateway }}>
      <Wrapper size='lg'>{content}</Wrapper>
    </ApiProvider>
  );
});
