import React from 'react';
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
import { Gateway, Guardian } from '../context/AppContext';

interface ServiceTableProps {
  services: Record<string, Guardian | Gateway>;
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
};
