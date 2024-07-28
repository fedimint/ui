import React, { useState, useEffect, useMemo } from 'react';
import { Box, Heading, Flex, useTheme } from '@chakra-ui/react';
import { GatewayInfo, FederationInfo } from '@fedimint/types';
import { ConnectFederation, InfoCard } from './components';
import { GatewayApi } from './GatewayApi';
import { ApiProvider } from './ApiProvider';
import { Wrapper, Login } from '@fedimint/ui';
import { useTranslation } from '@fedimint/utils';
import { FederationsTable } from './components/federations/FederationsTable';
import { Loading } from './components/Loading';
import { Error } from './components/Error';

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
    if (loading) {
      return <Loading />;
    }
    if (error) {
      return <Error error={error} />;
    }
    if (!authenticated) {
      return (
        <Login
          checkAuth={gateway.testPassword}
          setAuthenticated={() => setAuthenticated(true)}
          parseError={(err) => {
            return (err as Error).message;
          }}
        />
      );
    }

    return (
      <Box>
        <Flex
          flexFlow={['column', 'row']}
          justifyContent={['center', 'space-between']}
          alignItems={['flex-start', 'center']}
          gap='2'
          mb='8'
        >
          <Heading
            fontWeight='500'
            fontSize='24px'
            size='xs'
            color={theme.colors.gray[900]}
            fontFamily={theme.fonts.heading}
          >
            {t('header.title')}
          </Heading>
        </Flex>
        <InfoCard nodeId={gatewayInfo.gateway_id} />
        <ConnectFederation
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
        <FederationsTable
          federations={gatewayInfo.federations}
          onDeposit={handleDeposit}
          onWithdraw={handleWithdraw}
          onConnectFederation={() => setShowConnectFed(true)}
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
  ]);

  return (
    <ApiProvider props={{ gateway }}>
      <Wrapper size='lg'>{content}</Wrapper>
    </ApiProvider>
  );
});
