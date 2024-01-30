import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Heading,
  Text,
  Flex,
  useTheme,
  CircularProgress,
  CircularProgressLabel,
} from '@chakra-ui/react';
import { GatewayInfo, Federation } from '@fedimint/types';
import { FederationCard, ConnectFederation } from './components';
import { GatewayApi } from './GatewayApi';
import { ApiProvider } from './ApiProvider';
import { Wrapper, Login } from '@fedimint/ui';
import { useTranslation } from '@fedimint/utils';

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
  });
  const [federationId, setFederationId] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
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
            setFederationId(
              federationId
                ? federationId
                : gatewayInfo.federations[0].federation_id
            );
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
  }, [gateway, authenticated, federationId]);

  const content = useMemo(() => {
    if (loading) {
      return (
        <Flex
          bgColor={theme.colors.white}
          justifyContent='center'
          alignItems='center'
        >
          <CircularProgress
            isIndeterminate={true}
            color={theme.colors.blue[600]}
            size='240px'
            thickness='8px'
            capIsRound={true}
          >
            <CircularProgressLabel
              fontSize='md'
              fontWeight='500'
              color={theme.colors.gray[600]}
              fontFamily={theme.fonts.body}
              textAlign='center'
              width='150px'
            >
              {t('admin.fetch-info-modal-text')}
            </CircularProgressLabel>
          </CircularProgress>
        </Flex>
      );
    }

    if (error) {
      return (
        <Flex gap={6}>
          <Heading size='md'>{t('common.error')}</Heading>
          <Text>{error}</Text>
        </Flex>
      );
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
        {gatewayInfo.federations.length === 0 && (
          <>
            <ConnectFederation
              renderConnectedFedCallback={(federation: Federation) => {
                setGatewayInfo({
                  ...gatewayInfo,
                  federations: [...gatewayInfo.federations, federation],
                });
              }}
            />
          </>
        )}
        <Flex direction='column' gap={8}>
          {federationId && (
            <FederationCard
              key={federationId}
              federation={
                gatewayInfo.federations.find(
                  (fed) => fed.federation_id === federationId
                ) as Federation
              }
              setFederationId={setFederationId}
              federations={gatewayInfo.federations}
              network={gatewayInfo.network}
              lightning_pub_key={gatewayInfo.lightning_pub_key}
            />
          )}
        </Flex>
      </Box>
    );
  }, [
    gateway,
    loading,
    authenticated,
    error,
    gatewayInfo,
    theme,
    t,
    federationId,
  ]);

  return (
    <ApiProvider props={{ gateway }}>
      <Wrapper size='lg'>{content}</Wrapper>
    </ApiProvider>
  );
});
