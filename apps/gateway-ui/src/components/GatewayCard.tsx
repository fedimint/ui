import React from 'react';
import { Flex, Stack, useTheme } from '@chakra-ui/react';

export interface GatewayCardProps {
  children: React.ReactNode;
}

export const GatewayCard = React.memo(function GatewayCard({
  children,
}: GatewayCardProps) {
  const theme = useTheme();

  return (
    <Flex
      borderRadius='8px'
      bgColor={theme.colors.white}
      boxShadow={theme.shadows.sm}
      w='100%'
      h='100%'
      maxWidth='100%'
      maxH='100%'
      flexDir='column'
      justifyContent='space-between'
    >
      <Stack spacing='16px' p='24px'>
        {children}
      </Stack>
      <Flex
        alignItems='center'
        gap='4px'
        h='16px'
        w='100%'
        bgColor={theme.colors.gray[50]}
      ></Flex>
    </Flex>
  );
});
