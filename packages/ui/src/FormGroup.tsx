import React from 'react';
import { Flex } from '@chakra-ui/react';

export const FormGroup: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <Flex direction='column' gap={4} align='start' width='100%' maxWidth={320}>
    {children}
  </Flex>
);
