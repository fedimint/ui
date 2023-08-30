import React, { FC } from 'react';
import { Flex, Box, Text, useColorModeValue, useTheme } from '@chakra-ui/react';

interface PillProp {
  text: string;
  status: string;
  type?: 'error' | 'warning' | 'success';
}

// Have to update pill color based on quorum.
export const Pill: FC<PillProp> = ({ text, status, type }) => {
  const theme = useTheme();
  const color = theme.colors[type || 'gray'];
  const labelColor = useColorModeValue(
    theme.colors.gray[500],
    theme.colors.gray[400]
  );
  const bgColor = useColorModeValue(type ? color[50] : color[100], color[700]);
  const textColor = useColorModeValue(color[700], color[200]);
  const dotColor = useColorModeValue(color[500], color[400]);
  return (
    <Flex gap='8px' alignItems='center'>
      <Text color={labelColor} lineHeight='20px' fontSize='14px'>
        {text}
      </Text>
      <Flex
        h='22px'
        p='0 8px'
        gap='6px'
        borderRadius='10px'
        alignItems='center'
        bgColor={bgColor}
      >
        <Box bgColor={dotColor} h='6px' w='6px' borderRadius='100%' />
        <Text
          color={textColor}
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
