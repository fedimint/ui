import React from 'react';
import {
  Box,
  Text,
  Link,
  UnorderedList,
  ListItem,
  Flex,
} from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';

export const NoConnectedServices: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box textAlign='left' py={10} maxWidth='800px' margin='auto'>
      <Flex direction='column' gap={6} align='stretch'>
        <Text fontSize='xl' fontWeight='bold' textAlign='center'>
          {t('home.noServices', 'No services connected yet.')}
        </Text>
        <Text>A Fedimint federation consists of two types of services:</Text>
        <UnorderedList spacing={4} paddingLeft={6}>
          <ListItem>
            <Text fontWeight='bold'>Guardians:</Text>
            <Text>
              Responsible for running the Fedimint protocol, custodying funds,
              and managing the minting and redemption of eCash notes. They use
              distributed consensus to secure the federation.
            </Text>
          </ListItem>
          <ListItem>
            <Text fontWeight='bold'>
              Gateways (Lightning Service Providers):
            </Text>
            <Text>
              Bridge between the Fedimint and the Lightning Network, allowing
              users to send and receive Lightning payments. They can be run by
              the federation or independent providers.
            </Text>
          </ListItem>
        </UnorderedList>
        <Text>
          You can learn more about how to set up Fedimint services here:
        </Text>
        <Link
          href='https://github.com/fedimint/fedimint'
          isExternal
          color='blue.500'
          textAlign='center'
        >
          Learn how to set up Fedimint services
        </Link>
      </Flex>
    </Box>
  );
};
