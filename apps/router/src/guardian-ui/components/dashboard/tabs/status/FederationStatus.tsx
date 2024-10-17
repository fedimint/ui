import React from 'react';
import { Flex } from '@chakra-ui/react';
import {
  ClientConfig,
  StatusResponse,
  SignedApiAnnouncement,
} from '@fedimint/types';
import { GuardiansStatus } from './GuardiansStatus';
import { GatewaysStatus } from './GatewaysStatus';

interface Props {
  status: StatusResponse | undefined;
  config: ClientConfig | undefined;
  signedApiAnnouncements: Record<string, SignedApiAnnouncement>;
}

export const FederationStatus: React.FC<Props> = ({
  status,
  config,
  signedApiAnnouncements,
}) => {
  return (
    <Flex direction='column' gap={6}>
      <GuardiansStatus
        status={status}
        config={config}
        signedApiAnnouncements={signedApiAnnouncements}
      />
      <GatewaysStatus config={config} />
    </Flex>
  );
};
