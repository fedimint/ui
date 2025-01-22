import React from 'react';
import { Flex, Text } from '@chakra-ui/react';

type InfoFieldProps = {
  label: string;
  value: string | number;
};
export const InfoField: React.FC<InfoFieldProps> = ({ label, value }) => {
  return (
    <Flex
      direction='column'
      align='center'
      width='100%'
      bg='gray.50'
      p={4}
      borderRadius='md'
    >
      <Text fontSize='sm' color='gray.500'>
        {label}
      </Text>
      <Text
        fontSize='md'
        fontWeight='medium'
        textAlign='center'
        wordBreak='break-all'
      >
        <>{value}</>
      </Text>
    </Flex>
  );
};
