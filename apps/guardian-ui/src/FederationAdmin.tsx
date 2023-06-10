import React, { useEffect, useState } from 'react';
import {
  Flex,
  Card,
  CardBody,
  CardHeader,
  Table,
  Tbody,
  Tr,
  Td,
  Thead,
  Th,
  Icon,
} from '@chakra-ui/react';
import { CopyInput } from '@fedimint/ui';
import { useSetupContext } from './hooks';
import { StatusResponse, Versions } from './types';
import { ReactComponent as CopyIcon } from './assets/svgs/copy.svg';

export const FederationAdmin: React.FC = () => {
  const { api } = useSetupContext();
  const [versions, setVersions] = useState<Versions>();
  const [epochCount, setEpochCount] = useState<number>();
  const [status, setStatus] = useState<StatusResponse>();
  const [connectionCode, setConnectionCode] = useState<string>('');

  useEffect(() => {
    api.version().then(setVersions).catch(console.error);
    api.fetchEpochCount().then(setEpochCount).catch(console.error);
    api.status().then(setStatus).catch(console.error);
    api.connectionCode().then(setConnectionCode).catch(console.error);
  }, [api]);

  const apiVersion = versions?.core.api.length
    ? `${versions.core.api[0].major}.${versions.core.api[0].minor}`
    : '';
  const consensusVersion =
    versions?.core.consensus !== undefined ? `${versions.core.consensus}` : '';

  return (
    <Flex gap={4} flexDirection='column'>
      <Flex gap={4}>
        <Card flex='1'>
          <CardHeader>Federation info</CardHeader>
          <CardBody>
            <Table>
              <Tbody>
                <Tr>
                  <Td>Your status</Td>
                  <Td>{status?.server}</Td>
                </Tr>
                <Tr>
                  <Td>Epoch count</Td>
                  <Td>{epochCount}</Td>
                </Tr>
                <Tr>
                  <Td>API Version</Td>
                  <Td>{apiVersion}</Td>
                </Tr>
                <Tr>
                  <Td>Consensus version</Td>
                  <Td>{consensusVersion}</Td>
                </Tr>
              </Tbody>
            </Table>
          </CardBody>
        </Card>
        <Card flex='1'>
          <CardHeader>Peer info</CardHeader>
          <CardBody>
            <Table>
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              {status && (
                <Tbody>
                  {Object.entries(status?.consensus.status_by_peer).map(
                    ([peerId, peerStatus]) => (
                      <Tr key={peerId}>
                        <Td>Peer {peerId}</Td>
                        <Td>{peerStatus.connection_status}</Td>
                      </Tr>
                    )
                  )}
                </Tbody>
              )}
            </Table>
          </CardBody>
        </Card>
      </Flex>
      <Card>
        <CardHeader>Connection info</CardHeader>
        <CardBody>
          <CopyInput
            value={connectionCode}
            buttonLeftIcon={<Icon as={CopyIcon} />}
          />
        </CardBody>
      </Card>
    </Flex>
  );
};
