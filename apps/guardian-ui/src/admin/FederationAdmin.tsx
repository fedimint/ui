import React, { useEffect, useRef, useState } from 'react';
import { Flex, Box, Heading, Skeleton, useDisclosure } from '@chakra-ui/react';
import {
  ClientConfig,
  SignedApiAnnouncement,
  StatusResponse,
} from '@fedimint/types';
import { useAdminContext } from '../hooks';
import { GatewaysCard } from '../components/dashboard/gateways/GatewaysCard';
import { GuardiansCard } from '../components/dashboard/guardians/GuardiansCard';
import { FederationInfoCard } from '../components/dashboard/admin/FederationInfoCard';
import { BitcoinNodeCard } from '../components/dashboard/admin/BitcoinNodeCard';
import { BalanceCard } from '../components/dashboard/admin/BalanceCard';
import { InviteCode } from '../components/dashboard/admin/InviteCode';
import { FederationTabsCard } from '../components/dashboard/tabs/FederationTabsCard';
import { BftInfo } from '../components/BftInfo';
import { DangerZone } from '../components/dashboard/danger/DangerZone';
import { SignApiAnnouncement } from '../components/dashboard/danger/SignApiAnnouncement';
import { normalizeUrl } from '../utils';

const checkAnnouncementNeeded = (
  currentApiUrl: string,
  currentAnnouncement: SignedApiAnnouncement['api_announcement'] | undefined,
  setAnnouncementNeeded: React.Dispatch<React.SetStateAction<boolean>>,
  onOpen: () => void
) => {
  if (currentAnnouncement) {
    const announcementMatches =
      normalizeUrl(currentAnnouncement.api_url) === normalizeUrl(currentApiUrl);
    setAnnouncementNeeded(!announcementMatches);
    if (!announcementMatches) {
      onOpen();
    }
  } else {
    setAnnouncementNeeded(true);
    onOpen();
  }
};

const findOurPeerId = (
  configPeerIds: number[],
  statusPeerIds: number[]
): number | undefined => {
  return configPeerIds.find((id) => !statusPeerIds.includes(id));
};

export const FederationAdmin: React.FC = () => {
  const { api } = useAdminContext();
  const [status, setStatus] = useState<StatusResponse>();
  const [inviteCode, setInviteCode] = useState<string>('');
  const [config, setConfig] = useState<ClientConfig>();
  const [signedApiAnnouncements, setSignedApiAnnouncements] = useState<
    Record<string, SignedApiAnnouncement>
  >({});
  const [ourPeer, setOurPeer] = useState<{ id: number; name: string }>();
  const [latestSession, setLatestSession] = useState<number>();
  // API announcement modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [announcementNeeded, setAnnouncementNeeded] = useState(false);
  const checkAnnouncementRef = useRef(false);

  // Extracting our peer ID and name from intersection of config and status
  useEffect(() => {
    if (config && status?.federation && !checkAnnouncementRef.current) {
      const statusPeerIds = Object.keys(status.federation.status_by_peer).map(
        (id) => parseInt(id, 10)
      );

      const configPeerIds = Object.keys(config.global.api_endpoints).map((id) =>
        parseInt(id, 10)
      );

      const ourPeerId = findOurPeerId(configPeerIds, statusPeerIds);
      if (ourPeerId !== undefined) {
        setOurPeer({
          id: ourPeerId,
          name: config.global.api_endpoints[ourPeerId].name,
        });
        const currentApiUrl = process.env.REACT_APP_FM_CONFIG_API || '';
        const currentAnnouncement =
          signedApiAnnouncements[ourPeerId.toString()]?.api_announcement;

        checkAnnouncementNeeded(
          currentApiUrl,
          currentAnnouncement,
          setAnnouncementNeeded,
          onOpen
        );
        checkAnnouncementRef.current = true;
      }

      const latestSession = status?.federation?.session_count;
      setLatestSession(latestSession);
    }
  }, [config, status, signedApiAnnouncements, onOpen]);

  useEffect(() => {
    api.inviteCode().then(setInviteCode).catch(console.error);
    api.config().then(setConfig).catch(console.error);
    const fetchStatus = () => {
      api.status().then(setStatus).catch(console.error);
    };
    api.apiAnnouncements().then(setSignedApiAnnouncements).catch(console.error);
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, [api]);

  return (
    <Flex gap='32px' flexDirection='row'>
      <Flex gap={6} flexDirection='column' w='100%'>
        <Heading size='xs' mt='12px'>
          {config ? (
            config.global.meta.federation_name
          ) : (
            <Skeleton height='32px' width='180px' />
          )}
        </Heading>
        <Flex
          flexDirection={{ base: 'column', md: 'row' }}
          justifyContent='space-between'
          alignItems={{ base: 'stretch', md: 'center' }}
          gap={{ base: 4, md: 6 }}
        >
          <Box width={{ base: '100%', md: 'auto' }}>
            <InviteCode inviteCode={inviteCode} />
          </Box>
          {config && (
            <Box width={{ base: '100%', md: 'auto' }}>
              <BftInfo
                numPeers={Object.keys(config.global.api_endpoints).length}
              />
            </Box>
          )}
        </Flex>
        <Flex
          gap={6}
          alignItems='flex-start'
          flexDir={{ base: 'column', sm: 'column', md: 'row' }}
        >
          <Flex w='100%' direction='column' gap={5}>
            <FederationInfoCard
              status={status}
              config={config}
              latestSession={latestSession}
            />
            <BitcoinNodeCard modulesConfigs={config?.modules} />
          </Flex>
          <BalanceCard />
        </Flex>
        <GuardiansCard
          status={status}
          config={config}
          signedApiAnnouncements={signedApiAnnouncements}
        />
        <GatewaysCard config={config} />
        {ourPeer && (
          <FederationTabsCard
            config={config}
            ourPeer={ourPeer}
            signedApiAnnouncements={signedApiAnnouncements}
          />
        )}
        <DangerZone
          inviteCode={inviteCode}
          ourPeer={ourPeer}
          latestSession={latestSession}
          signedApiAnnouncements={signedApiAnnouncements}
          onApiAnnouncementOpen={onOpen}
        />
      </Flex>
      {announcementNeeded && ourPeer && (
        <SignApiAnnouncement
          isOpen={isOpen}
          onClose={onClose}
          ourPeer={ourPeer}
          signedApiAnnouncements={signedApiAnnouncements}
        />
      )}
    </Flex>
  );
};
