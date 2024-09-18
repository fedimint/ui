import React, { useMemo, useState } from 'react';
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
  IconButton,
} from '@chakra-ui/react';
import { FiEdit, FiExternalLink, FiX } from 'react-icons/fi';
import { useTranslation } from '@fedimint/utils';
import { ConnectServiceModal } from './ConnectServiceModal';
import { useAppContext } from '../context/hooks';
import { EditServiceModal } from './EditServiceModal';
import { RemoveServiceModal } from './RemoveServiceModal';
import { Gateway, Guardian } from '../context/AppContext';

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { guardians, gateways } = useAppContext();
  const [editingService, setEditingService] = useState<{
    type: 'guardian' | 'gateway';
    id: string;
  } | null>(null);
  const [removingService, setRemovingService] = useState<{
    type: 'guardian' | 'gateway';
    id: string;
  } | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const content = useMemo(() => {
    const renderServiceTable = (
      services: Record<string, Guardian | Gateway>,
      type: 'guardian' | 'gateway'
    ) => (
      <Card marginBottom='6'>
        <CardHeader>
          <Heading size='md'>
            {t(`home.${type}s`, type === 'guardian' ? 'Guardians' : 'Gateways')}
          </Heading>
        </CardHeader>
        <CardBody>
          <Table variant='simple'>
            <Thead>
              <Tr>
                <Th>
                  {t(
                    `home.${type}Url`,
                    `${type.charAt(0).toUpperCase() + type.slice(1)} URL`
                  )}
                </Th>
                <Th width='200px'>{t('home.actions', 'Actions')}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {Object.entries(services).map(([id, service]) => (
                <Tr key={`${type}-${id}`}>
                  <Td>
                    <Flex gap={2} alignItems='center'>
                      {service.config.baseUrl}
                      <IconButton
                        aria-label={`Edit ${type}`}
                        icon={<FiEdit />}
                        size='sm'
                        colorScheme='gray'
                        variant='ghost'
                        onClick={() => setEditingService({ type, id })}
                      />
                    </Flex>
                  </Td>
                  <Td>
                    <Flex justifyContent='flex-end' gap={3} alignItems='center'>
                      <Link to={`/${type}/${id}`}>
                        <Button
                          rightIcon={<FiExternalLink />}
                          size='sm'
                          colorScheme='blue'
                        >
                          {t('common.view', 'View')}
                        </Button>
                      </Link>

                      <IconButton
                        aria-label={`Delete ${type}`}
                        icon={<FiX />}
                        size='md'
                        colorScheme='red'
                        variant='ghost'
                        onClick={() => setRemovingService({ type, id })}
                      />
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardBody>
      </Card>
    );
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
        {Object.keys(guardians).length > 0 &&
          renderServiceTable(guardians, 'guardian')}
        {Object.keys(gateways).length > 0 &&
          renderServiceTable(gateways, 'gateway')}
        {Object.keys(guardians).length + Object.keys(gateways).length === 0 && (
          <Text>{t('home.noServices', 'No services connected yet.')}</Text>
        )}
      </Box>
    );
  }, [guardians, gateways, t, onOpen]);

  return (
    <>
      {content}
      <ConnectServiceModal isOpen={isOpen} onClose={onClose} />
      {editingService && (
        <EditServiceModal
          isOpen={true}
          onClose={() => setEditingService(null)}
          service={editingService}
          serviceUrl={
            editingService.type === 'guardian'
              ? guardians[editingService.id].config.baseUrl
              : gateways[editingService.id].config.baseUrl
          }
        />
      )}
      {removingService && (
        <RemoveServiceModal
          isOpen={true}
          onClose={() => setRemovingService(null)}
          service={removingService}
        />
      )}
    </>
  );
};
