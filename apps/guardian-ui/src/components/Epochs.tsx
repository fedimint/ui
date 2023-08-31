import React, { FC } from 'react';
import { Box, Flex, Text, useTheme } from '@chakra-ui/react';
import { ReactComponent as InfoIcon } from '../assets/svgs/info.svg';

interface EpochProps {
  epochCount: number;
  pegin: number;
  pegout: number;
  gatewayTrxs: number;
}

const Epoch: FC<EpochProps> = ({ epochCount, pegin, pegout, gatewayTrxs }) => {
  const theme = useTheme();

  return (
    <Flex
      alignItems='flex-start'
      justifyContent='center'
      p=' 0px 24px'
      w='160px'
      h='160px'
      flexDir='column'
      borderRadius='8px'
      bgColor={theme.colors.gray[50]}
      boxShadow={theme.shadows.sm}
    >
      <Text fontWeight='semibold' color={theme.colors.gray[900]} fontSize='xl'>
        {gatewayTrxs}
      </Text>
      <Text
        pt='4px'
        pb='8px'
        fontWeight='semibold'
        color={theme.colors.success[500]}
        fontSize='md'
      >
        #{epochCount}
      </Text>
      <Text fontWeight='medium' color={theme.colors.gray[500]} fontSize='sm'>
        {pegin} peg in
      </Text>
      <Text fontWeight='medium' color={theme.colors.gray[500]} fontSize='sm'>
        {pegout} peg out
      </Text>
      <Text fontWeight='medium' color={theme.colors.gray[500]} fontSize='sm'>
        {gatewayTrxs} gtwy tx
      </Text>
    </Flex>
  );
};

export const Epochs = () => {
  const theme = useTheme();

  return (
    <Box>
      <Flex alignItems='center' gap='4px'>
        <Text
          fontWeight='semibold'
          color={theme.colors.gray[900]}
          fontSize='xl'
        >
          Epochs
        </Text>
        {<InfoIcon color={theme.colors.gray[400]} />}
      </Flex>
      <Flex gap='4' p='16px 0px'>
        <Epoch epochCount={88} pegin={0} pegout={0} gatewayTrxs={600} />
      </Flex>
      <Text
        color={theme.colors.blue[600]}
        fontWeight='semibold'
        fontSize='sm'
        cursor='pointer'
        w='fit-content'
      >
        View all
      </Text>
    </Box>
  );
};
