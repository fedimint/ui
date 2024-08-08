import React, { memo } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { Header, HeaderProps } from './Header';
import { Footer } from './Footer';

export interface WrapperProps {
  headerProps?: HeaderProps;
  children: React.ReactNode;
  size?: 'md' | 'lg';
}

export const Wrapper = memo(function Wrapper({
  headerProps,
  children,
  size = 'md',
}: WrapperProps): JSX.Element {
  return (
    <Flex
      minHeight='100vh'
      justifyContent='space-between'
      flexDir='column'
      alignItems='center'
    >
      <Box
        maxW={size === 'lg' ? '1200px' : '960px'}
        mt={10}
        mb={10}
        mr={[2, 4, 6, 10]}
        ml={[2, 4, 6, 10]}
        p={5}
        width='100%'
        alignItems='center'
      >
        <Header {...headerProps} />
        {children}
      </Box>
      <Footer />
    </Flex>
  );
});
