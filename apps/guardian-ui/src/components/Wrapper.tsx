import React, { memo } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { Header } from './Header';
import Footer from './Footer';

export interface WrapperProps {
  children: React.ReactNode;
}

export const Wrapper = memo(function Wrapper({
  children,
}: WrapperProps): JSX.Element {
  return (
    <Flex
      minHeight='100vh'
      justifyContent='space-between'
      flexDir='column'
      alignItems='center'
    >
      <Box
        maxW='960px'
        mt={10}
        mb={10}
        mr={[2, 4, 6, 10]}
        ml={[2, 4, 6, 10]}
        p={5}
        width='100%'
        alignItems='center'
      >
        <Header />
        {children}
      </Box>
      <Footer />
    </Flex>
  );
});
