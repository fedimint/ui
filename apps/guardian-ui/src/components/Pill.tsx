import React, { FC } from 'react';
import { Flex, Box, Text, useColorModeValue } from '@chakra-ui/react';

interface PillProp {
  text: string;
  status: string;
  color?: 'green' | 'red' | 'yellow';
}

// Have to update pill color based on quorum.
export const Pill: FC<PillProp> = ({ text, status, color }) => {
  const greenBgColor = useColorModeValue('#34D399', '#065F46');
  const greenTextColor = useColorModeValue('#065F46', '#34D399');
  const redBgColor = useColorModeValue('#F87171', '#991B1B');
  const redTextColor = useColorModeValue('#991B1B', '#F87171');
  const yellowBgColor = useColorModeValue('#FBBF24', '#B45309');
  const yellowTextColor = useColorModeValue('#B45309', '#FBBF24');
  const defaultBgColor = useColorModeValue('#D1FAE5', '#065F46');
  const defaultTextColor = useColorModeValue('#065F46', '#D1FAE5');
  const colors = () => {
    switch (color) {
      case 'green':
        return { bgColor: greenBgColor, textColor: greenTextColor };
      case 'red':
        return { bgColor: redBgColor, textColor: redTextColor };
      case 'yellow':
        return { bgColor: yellowBgColor, textColor: yellowTextColor };
      default:
        return { bgColor: defaultBgColor, textColor: defaultTextColor };
    }
  };
  const { bgColor, textColor } = colors();
  return (
    <Flex gap='8px' alignItems='center'>
      <Text color={defaultTextColor} lineHeight='27px' fontSize='14px'>
        {text}
      </Text>
      <Flex
        gap='6px'
        p='2px 10px'
        borderRadius='32px'
        alignItems='center'
        bgColor={bgColor}
      >
        <Box bgColor={bgColor} h='8px' w='8px' borderRadius='32px'></Box>
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
