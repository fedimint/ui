import React from 'react';
import { Flex, Spacer, Button } from '@chakra-ui/react';
import { GatewayInfo } from '@fedimint/types';
import { useTranslation } from '@fedimint/utils';

export type HeaderProps = {
  gatewayInfo: GatewayInfo;
  toggleShowConnectFed: () => void;
};

export const Header = React.memo(function Header({
  toggleShowConnectFed,
}: HeaderProps): JSX.Element {
  const { t } = useTranslation();
  return (
    <Flex>
      <Flex alignItems='center' gap={2}>
        <Button
          onClick={toggleShowConnectFed}
          fontSize={{ base: '12px', md: '13px', lg: '16px' }}
          p={{ base: '10px', md: '13px', lg: '16px' }}
        >
          {t('header.connect')}
        </Button>
      </Flex>
      <Spacer />
    </Flex>
  );
});
