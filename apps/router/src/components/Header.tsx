import React from 'react';
import { Flex } from '@chakra-ui/react';
import { Logo } from './Logo';
import { ServiceMenu } from './ServiceMenu';
import { useActiveService } from '../hooks';
import { useAppContext } from '../context/hooks';

export const Header = React.memo(function Header() {
  const { guardians, gateways } = useAppContext();
  const { activeServiceId } = useActiveService();

  const hasServices =
    Object.keys(guardians).length > 0 || Object.keys(gateways).length > 0;

  return (
    <Flex
      width='100%'
      justifyContent={['center', 'space-between']}
      mb={['24px', '12px']}
    >
      <Logo />
      {hasServices && (
        <ServiceMenu
          guardians={guardians}
          gateways={gateways}
          activeServiceId={activeServiceId}
        />
      )}
    </Flex>
  );
});
