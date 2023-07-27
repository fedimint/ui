import React from 'react';
import { Box, Flex } from '@chakra-ui/react';

export interface InformationBarProps {
  icon: React.ReactElement<
    React.SVGProps<SVGSVGElement> & {
      title?: string | undefined;
    }
  >;
  children: React.ReactNode;
  backgroundColor: string;
  barColor?: string;
}

export const InformationBar: React.FC<InformationBarProps> = ({
  icon,
  children,
  barColor,
  backgroundColor,
}) => {
  return (
    <Flex maxW='896px'>
      {barColor ? <Box h='100%' w='4px' bgColor={barColor}></Box> : null}
      <Flex
        bgColor={backgroundColor}
        alignItems='flex-start'
        padding='16px'
        w='100%'
      >
        <Box pr='12px'>{icon}</Box>
        <Box>{children}</Box>
      </Flex>
    </Flex>
  );
};
