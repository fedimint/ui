import React from 'react';
import { Flex } from '@chakra-ui/react';

interface Props {
  children: React.ReactNode;
  maxWidth?: number;
}

export const FormGroup: React.FC<Props> = ({ children, maxWidth = 320 }) => (
  <Flex
    direction='column'
    gap={6}
    align='start'
    width='100%'
    maxWidth={maxWidth}
  >
    {children}
  </Flex>
);
