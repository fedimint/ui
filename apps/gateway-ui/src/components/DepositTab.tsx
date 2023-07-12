import React, { useEffect, useState } from 'react';
import { TabPanel, Heading, Text, Flex, Box } from '@chakra-ui/react';
import { ApiContext } from '../ApiProvider';
import { TabHeader } from '.';
import { QRCodeSVG } from 'qrcode.react';

export const DepositTabHeader = (): JSX.Element => {
  return <TabHeader>Deposit</TabHeader>;
};

export interface DepositTabProps {
  federationId: string;
  active: boolean;
}

export const DepositTab = React.memo(function DepositTab({
  federationId,
}: DepositTabProps): JSX.Element {
  const { gateway } = React.useContext(ApiContext);
  const [address, setAddress] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    !address &&
      gateway
        .fetchAddress(federationId)
        .then((newAddress) => {
          setAddress(newAddress);
          setError('');
        })
        .catch(({ message, error }) => {
          console.error(error);
          setError(message);
        });
  }, []);

  return (
    <TabPanel pl='8px' pr='8px'>
      <Heading
        fontWeight='500'
        fontSize={{ base: '22', md: '24' }}
        color='#1A202C'
      >
        Bitcoin Deposit to Federation
      </Heading>
      <Flex
        flexDir={{ base: 'column', md: 'row' }}
        alignItems={{ base: 'left', md: 'center' }}
        mb={4}
      >
        {address ? (
          <>
            <Text fontSize='lg' fontWeight='500' color='#1A202C' mr={2}>
              Address:
            </Text>
            <Text fontSize='lg'>{address}</Text>
          </>
        ) : (
          <Text>{error}</Text>
        )}
      </Flex>
      <Box>
        {address && <QRCodeSVG height='20em' width='20em' value={address} />}
      </Box>
    </TabPanel>
  );
});
