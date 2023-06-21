import React, { memo } from 'react';
import { Box, Center } from '@chakra-ui/react';

export interface WrapperProps {
  children: React.ReactNode;
}

export const Wrapper = memo(function Wrapper({
  children,
}: WrapperProps): JSX.Element {
  return (
    <Center>
      <Box
        maxW='960px'
        mt={10}
        mb={10}
        mr={[2, 4, 6, 10]}
        ml={[2, 4, 6, 10]}
        p={5}
        width='100%'
      >
        {children}
      </Box>
    </Center>
  );
});
