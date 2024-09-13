import React, { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import { Wrapper } from '@fedimint/ui';
import { useTranslation } from '@fedimint/utils';
import { AppContext } from '../context/AppContext';
import { ConnectServiceModal } from './ConnectServiceModal';

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { guardians, gateways } = useContext(AppContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const content = useMemo(() => {
    return (
      <Box width='100%' maxWidth='1200px' margin='auto' paddingY='8'>
        <Flex
          justifyContent='space-between'
          alignItems='center'
          marginBottom='6'
        >
          <Heading as='h1' size='xl'>
            {t('home.services', 'Services')}
          </Heading>
          <Button onClick={onOpen} colorScheme='blue'>
            {t('home.addService', 'Add a Service')}
          </Button>
        </Flex>

        {Object.keys(guardians).length > 0 && (
          <Card marginBottom='6'>
            <CardHeader>
              <Heading size='md'>{t('home.guardians', 'Guardians')}</Heading>
            </CardHeader>
            <CardBody>
              <Table variant='simple'>
                <Thead>
                  <Tr>
                    <Th>{t('home.guardianId', 'Guardian ID')}</Th>
                    <Th>{t('home.actions', 'Actions')}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Object.keys(guardians).map((guardianIndex) => (
                    <Tr key={`guardian-${guardianIndex}`}>
                      <Td>{guardianIndex}</Td>
                      <Td>
                        <Link to={`/guardian/${guardianIndex}`}>
                          <Button size='sm' colorScheme='green'>
                            {t('home.view', 'View')}
                          </Button>
                        </Link>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </CardBody>
          </Card>
        )}

        {Object.keys(gateways).length > 0 && (
          <Card>
            <CardHeader>
              <Heading size='md'>{t('home.gateways', 'Gateways')}</Heading>
            </CardHeader>
            <CardBody>
              <Table variant='simple'>
                <Thead>
                  <Tr>
                    <Th>{t('home.gatewayId', 'Gateway ID')}</Th>
                    <Th>{t('home.actions', 'Actions')}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Object.keys(gateways).map((gatewayIndex) => (
                    <Tr key={`gateway-${gatewayIndex}`}>
                      <Td>{gatewayIndex}</Td>
                      <Td>
                        <Link to={`/gateway/${gatewayIndex}`}>
                          <Button size='sm' colorScheme='purple'>
                            {t('home.view', 'View')}
                          </Button>
                        </Link>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </CardBody>
          </Card>
        )}

        {Object.keys(guardians).length + Object.keys(gateways).length === 0 && (
          <Text>{t('home.noServices', 'No services connected yet.')}</Text>
        )}
      </Box>
    );
  }, [guardians, gateways, t, onOpen]);

  return (
    <Wrapper>
      {content}
      <ConnectServiceModal isOpen={isOpen} onClose={onClose} />
    </Wrapper>
  );
};
