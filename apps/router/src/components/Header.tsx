import React, { useMemo } from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { Logo } from './Logo';
import { ServiceMenu } from './ServiceMenu';
import { useActiveService } from '../hooks';
import { useAppContext } from '../hooks';

export const Header = React.memo(function Header() {
  const { guardians, gateways } = useAppContext();
  const activeService = useActiveService();
  const activeServiceInfo = useMemo(() => {
    if (!activeService) return null;
    const serviceMap = { guardian: guardians, gateway: gateways };
    return serviceMap[activeService.type]?.[activeService.id] ?? null;
  }, [activeService, guardians, gateways]);

  const hasServices =
    Object.keys(guardians).length > 0 || Object.keys(gateways).length > 0;

  const isSoloDeploy = !!(
    import.meta.env.VITE_FM_CONFIG_API || import.meta.env.VITE_FM_GATEWAY_API
  );

  return (
    <Flex width='100%' justifyContent={['space-between']} mb='30px'>
      <Logo isSoloDeploy={isSoloDeploy} />
      {hasServices && !isSoloDeploy && (
        <Flex alignItems='center'>
          {activeService && activeServiceInfo && (
            <Text
              mr={2}
              fontSize='sm'
              color='gray.600'
              textAlign='right'
              wordBreak='break-word'
            >
              {activeServiceInfo?.config.baseUrl}
            </Text>
          )}
          <ServiceMenu
            guardians={guardians}
            gateways={gateways}
            activeServiceId={activeService?.id}
          />
        </Flex>
      )}
    </Flex>
  );
});
