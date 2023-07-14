import React, { FC, ReactNode } from 'react';
import { Box, Flex } from '@chakra-ui/react';

export interface InformationBarProps {
  icon: React.ReactElement<
    React.SVGProps<SVGSVGElement> & {
      title?: string | undefined;
    }
  >;
  children: ReactNode;
  backgroundColor: string;
  barColor?: string;
}

export const InformationBar: FC<InformationBarProps> = ({
  icon,
  children,
  barColor,
  backgroundColor,
}) => {
  return (
    <Flex w='100%'>
      {barColor ? <Box h='100%' w='4px' bgColor={barColor}></Box> : null}
      <Flex
        bgColor={backgroundColor}
        alignItems='flex-start'
        padding='16px'
        w='100%'
      >
        <Box pr='16px'>{icon}</Box>
        <Box>{children}</Box>
      </Flex>
    </Flex>
  );
};
