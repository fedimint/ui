import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  IconButton,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { FiEdit, FiExternalLink, FiX } from 'react-icons/fi';
import { useTranslation } from '@fedimint/utils';
import { GuardianConfig } from '../../types/guardian';
import { GatewayConfig } from '../../types/gateway';
import {
  ServiceCheckApi,
  ServiceCheckResponse,
} from '../../api/ServiceCheckApi';

interface ServiceTableProps {
  services: Record<string, GuardianConfig | GatewayConfig>;
  type: 'guardian' | 'gateway';
  setEditingService: (service: {
    type: 'guardian' | 'gateway';
    id: string;
  }) => void;
  setRemovingService: (service: {
    type: 'guardian' | 'gateway';
    id: string;
  }) => void;
}

export const ServiceTable: React.FC<ServiceTableProps> = ({
  services,
  type,
  setEditingService,
  setRemovingService,
}) => {
  const { t } = useTranslation();
  // const [serviceStatuses, setServiceStatuses] = useState<
  //   Record<string, ServiceCheckResponse>
  // >({});

  useEffect(() => {
    const checkServices = async () => {
      const api = new ServiceCheckApi();
      const statuses: Record<string, ServiceCheckResponse> = {};

      for (const [id, service] of Object.entries(services)) {
        try {
          const status = await api.checkWithoutPassword(service.config.baseUrl);
          statuses[id] = status;
        } catch (error) {
          console.error(`Failed to check service ${id}:`, error);
          statuses[id] = {
            serviceType: type,
            serviceName: type === 'guardian' ? 'Guardian' : 'Gateway',
            status: 'Error',
            requiresPassword: false,
          };
        }
      }

      // setServiceStatuses(statuses);
    };

    checkServices();
  }, [services, type]);

  return (
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
              {/* <Th>{t('common.status')}</Th> */}
              <Th width='200px'>{t('home.actions')}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {Object.entries(services).map(([id, service]) => {
              // const serviceStatus = serviceStatuses[id];
              return (
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
                  {/* <Td>
                    {serviceStatus ? (
                      <Flex direction='column'>
                        <Text>{serviceStatus.status}</Text>
                        {serviceStatus.requiresPassword && (
                          <Text color='orange.500'>Requires Password</Text>
                        )}
                      </Flex>
                    ) : (
                      <Text>Loading...</Text>
                    )}
                  </Td> */}
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
              );
            })}
          </Tbody>
        </Table>
      </CardBody>
    </Card>
  );
};
