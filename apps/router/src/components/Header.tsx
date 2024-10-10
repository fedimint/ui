import React, { useMemo } from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { Logo } from './Logo';
import { ServiceMenu } from './ServiceMenu';
import { useActiveService } from '../hooks';
import { useAppContext } from '../context/hooks';
import { useMasterPassword } from '../hooks/useMasterPassword';

export const Header = React.memo(function Header() {
  const { guardians, gateways } = useAppContext();
  const { masterPassword } = useMasterPassword();
  const activeService = useActiveService();
  const activeServiceInfo = useMemo(() => {
    if (!activeService) return null;
    const serviceMap = { guardian: guardians, gateway: gateways };
    return serviceMap[activeService.type]?.[activeService.id] ?? null;
  }, [activeService, guardians, gateways]);

  const hasServices =
    Object.keys(guardians).length > 0 || Object.keys(gateways).length > 0;

  return (
    <Flex
      width='100%'
      justifyContent={['center', 'space-between']}
      mb={['24px', '12px']}
    >
      <Logo />
      {hasServices && masterPassword && (
        <Flex alignItems='center'>
          {activeService && activeServiceInfo && (
            <Text mr={2} fontSize='sm' color='gray.600'>
              {activeService.type === 'guardian' ? 'Guardian' : 'Gateway'}:{' '}
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
