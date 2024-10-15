import React, { useState } from 'react';
import {
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Card,
  Divider,
} from '@chakra-ui/react';
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
import { useTranslation } from '@fedimint/utils';

export const Gateway = () => {
  const { t } = useTranslation();
  const { state, dispatch, api, id } = useGatewayContext();
  const [showConnectFed, setShowConnectFed] = useState(false);
  const [walletModalState, setWalletModalState] = useState<WalletModalState>({
    isOpen: false,
    action: WalletModalAction.Receive,
    type: WalletModalType.Onchain,
    selectedFederation: null,
  });
  const [activeTab, setActiveTab] = useState(0);

  useLoadGateway();
  if (state.needsAuth) {
    return (
      <Login
        serviceId={id}
        checkAuth={api.testPassword}
        setAuthenticated={() =>
          dispatch({
            type: GATEWAY_APP_ACTION_TYPE.SET_NEEDS_AUTH,
            payload: false,
          })
        }
        parseError={(err) => (err as Error).message}
      />
    );
  }
  if (state.gatewayError) return <ErrorMessage error={state.gatewayError} />;
  if (state.gatewayInfo === null) return <Loading />;

  return (
    <Flex direction='column' gap={4}>
      <HeaderWithUnitSelector />
      <Card flex='1' width='100%'>
        <Tabs
          variant='soft-rounded'
          colorScheme='blue'
          index={activeTab}
          onChange={setActiveTab}
          orientation='vertical'
          display='flex'
          height='100%'
        >
          <Flex width='100%'>
            <TabList flexDirection='column' minWidth='200px' p={4}>
              <Tab justifyContent='flex-start' mb={2}>
                {t('wallet.title')}
              </Tab>
              <Tab justifyContent='flex-start' mb={2}>
                {t('info-card.card-header')}
              </Tab>
              <Tab justifyContent='flex-start' mb={2}>
                {t('federation-card.table-title')}
              </Tab>
            </TabList>
            <Divider orientation='vertical' />
            <TabPanels flex={1} width='100%'>
              <TabPanel>
                {state.balances && (
                  <WalletCard
                    unit={state.unit}
                    balances={state.balances}
                    setWalletModalState={setWalletModalState}
                    federations={state.gatewayInfo.federations}
                  />
                )}
              </TabPanel>
              <TabPanel>
                <LightningCard
                  nodeId={state.gatewayInfo.gateway_id}
                  network={state.gatewayInfo.network}
                  alias={state.gatewayInfo.lightning_alias}
                  mode={state.gatewayInfo.lightning_mode}
                  pubkey={state.gatewayInfo.lightning_pub_key}
                  blockHeight={state.gatewayInfo.block_height}
                  syncedToChain={state.gatewayInfo.synced_to_chain}
                />
              </TabPanel>
              <TabPanel>
                <FederationsTable
                  unit={state.unit}
                  federations={state.gatewayInfo.federations}
                  onConnectFederation={() => setShowConnectFed(true)}
                  setWalletModalState={setWalletModalState}
                />
              </TabPanel>
            </TabPanels>
          </Flex>
        </Tabs>
      </Card>
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
