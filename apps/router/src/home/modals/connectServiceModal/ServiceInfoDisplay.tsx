import React from 'react';
import { Text, Badge, Flex, Box } from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { ServiceCheckResponse } from '../../../api/ServiceCheckApi';

interface ServiceInfoDisplayProps {
  serviceInfo: ServiceCheckResponse;
}

export const ServiceInfoDisplay: React.FC<ServiceInfoDisplayProps> = ({
  serviceInfo,
}) => {
  const { t } = useTranslation();

  return (
    <Flex direction='column' align='stretch' gap={4} width='100%'>
      <Box>
        <Text fontSize='lg' fontWeight='bold' display='inline'>
          {t('home.connect-service-modal.service-type-label')}:{' '}
        </Text>
        <Badge colorScheme={'blue'} fontSize='md' px={2} py={1}>
          {serviceInfo.serviceType.toUpperCase()}
        </Badge>
      </Box>
      {serviceInfo.serviceType === 'gateway' && (
        <Box>
          <Text fontSize='lg' fontWeight='bold' display='inline'>
            {t('home.connect-service-modal.service-name-label')}:{' '}
          </Text>
          <Text fontSize='lg' display='inline'>
            {serviceInfo.serviceName}
          </Text>
        </Box>
      )}
      <Box>
        <Text fontSize='lg' fontWeight='bold' display='inline'>
          {t('home.connect-service-modal.status-label')}:{' '}
        </Text>
        <Badge colorScheme='blue' fontSize='md' px={2} py={1}>
          {serviceInfo.status === 'AWAITING_PASSWORD'
            ? 'SETUP'
            : serviceInfo.status}
        </Badge>
      </Box>
    </Flex>
  );
};
