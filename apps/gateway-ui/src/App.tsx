import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  Heading,
  Text,
  Flex,
  useTheme,
  CircularProgress,
  CircularProgressLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
} from '@chakra-ui/react';
import { GatewayInfo, FederationInfo } from '@fedimint/types';
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
          <Button onClick={() => setShowConnectFed(!showConnectFed)}>
            {t('connect-federation.connect-federation-button')}
          </Button>
        </Flex>
        <Modal isOpen={showConnectFed} onClose={() => setShowConnectFed(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <br />
            <ModalBody>
              <ConnectFederation
                renderConnectedFedCallback={(federation: FederationInfo) => {
                  setGatewayInfo({
                    ...gatewayInfo,
                    federations: [...gatewayInfo.federations, federation],
                  });
                  setShowConnectFed(false);
                }}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
        <Flex flexDirection={'column'} gap={8}>
          {gatewayInfo.federations.map((federation: FederationInfo) => {
            return (
              <FederationCard
                key={federation.federation_id}
                federation={federation}
                network={gatewayInfo.network}
                lightning_pub_key={gatewayInfo.lightning_pub_key}
              />
            );
          })}
        </Flex>
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
