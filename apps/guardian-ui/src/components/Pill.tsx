import React, { FC } from 'react';
import { Flex, Box, Text } from '@chakra-ui/react';

interface PillProp {
  text: string;
  status: string;
}

// Have to update pill color based on quorum.
export const Pill: FC<PillProp> = ({ text, status }) => {
  return (
    <Flex gap='8px' alignItems='center'>
      <Text color='#6B7280' lineHeight='27px' fontSize='14px'>
        {text}
      </Text>
      <Flex
        gap='6px'
        p='2px 10px'
        borderRadius='32px'
        alignItems='center'
        bgColor='#D1FAE5'
      >
        <Box bgColor='#34D399' h='8px' w='8px' borderRadius='32px'></Box>
        <Text
          color='#065F46'
          fontSize='12px'
          lineHeight='16px'
          fontWeight='500'
        >
          {status}
        </Text>
      </Flex>
    </Flex>
  );
};
