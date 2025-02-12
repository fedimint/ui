import React from 'react';
import { Box } from '@chakra-ui/react';

export interface Props {
  text: string;
}

const AlertBar = ({ text }: Props) => (
  <Box
    background='tomato'
    color='white'
    fontWeight='500'
    padding='4'
    textAlign='center'
    width='100%'
  >
    {text}
  </Box>
);

export default AlertBar;
