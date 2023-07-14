import React, { CSSProperties, FC } from 'react';
import { Box, Center, Flex, Stack, Text, useTheme } from '@chakra-ui/react';
import { ReactComponent as LinkIcon } from '../assets/svgs/linkIcon.svg';
import { ReactComponent as LightningIcon } from '../assets/svgs/lightningIcon.svg';

export interface LightningNodeProps {
  nodeName: string;
  nodeId: string;
  mempoolink: string;
  capacityInSats: number;
  capacityInDollars: number;
  incomingFees: number;
  outgoingFees: number;
  successRate: number;
}

export const LightningNode: FC<LightningNodeProps> = ({
  nodeName,
  nodeId,
  mempoolink,
  capacityInSats,
  capacityInDollars,
  incomingFees,
  outgoingFees,
  successRate,
}) => {
  const theme = useTheme();

  const titleStyles: CSSProperties = {
    color: theme.colors.gray[900],
    fontWeight: '600',
  };

  const subTextStyles: CSSProperties = {
    color: theme.colors.gray[500],
    fontWeight: '500',
  };

  return (
    <Box
      borderRadius='8px'
      bgColor={theme.colors.white}
      boxShadow='0px 1px 2px 0px rgba(0, 0, 0, 0.06), 0px 1px 3px 0px rgba(0, 0, 0, 0.10)'
    >
      <Flex p='16px 24px' gap='24px'>
        <Center
          bgColor={theme.colors.blue[600]}
          h='48px'
          w='48px'
          borderRadius='6px'
        >
          <LightningIcon color={theme.colors.white} />
        </Center>
        <Flex flexDir='column'>
          <Text
            color={theme.colors.gray[900]}
            textTransform='capitalize'
            fontSize='lg'
            fontWeight='semibold'
            pb='8px'
          >
            {nodeName}
          </Text>
          <Stack spacing='16px' fontSize='sm' lineHeight='20px'>
            <Box>
              <Text style={titleStyles}>Node ID</Text>
              <Text style={subTextStyles}>{nodeId}</Text>
            </Box>

            <Box>
              <Text style={titleStyles}>Active Capacity</Text>
              <Text style={subTextStyles}>{capacityInSats} sats</Text>
              <Text style={subTextStyles} color='#059669 !important'>
                ${capacityInDollars}
              </Text>
            </Box>

            <Box>
              <Text style={titleStyles}>Fees</Text>
              <Text
                style={subTextStyles}
              >{`Incoming: ${incomingFees} ppm (${Math.max(
                incomingFees / 10000
              )})`}</Text>
              <Text
                style={subTextStyles}
              >{`Outgoing: $${outgoingFees} ppm (${Math.max(
                outgoingFees / 10000
              )})`}</Text>
            </Box>

            <Box>
              <Text style={titleStyles}>Routing Transactions</Text>
              <Text style={subTextStyles}>Success rate: {successRate}%</Text>
            </Box>
          </Stack>
        </Flex>
      </Flex>

      <Flex
        alignItems='center'
        gap='4px'
        p='16px 24px'
        bgColor={theme.colors.gray[50]}
      >
        <a
          style={{
            fontSize: '14px',
            lineHeight: '24px',
            fontWeight: '500',
            color: theme.colors.blue[600],
          }}
          href={mempoolink}
        >
          View on mempool.space
        </a>
        <LinkIcon color={theme.colors.blue[600]} />
      </Flex>
    </Box>
  );
};
