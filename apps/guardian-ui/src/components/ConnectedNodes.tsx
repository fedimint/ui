import React, { CSSProperties, FC } from 'react';
import { Box, Center, Flex, Stack, Text, useTheme } from '@chakra-ui/react';
import { ReactComponent as LightningIcon } from '../assets/svgs/lightningIcon.svg';
import { Fees, Gateway } from '../types';

interface ConnectedNodesProps {
  gateways: Gateway[];
}

export const ConnectedNodes: FC<ConnectedNodesProps> = ({ gateways }) => {
  return (
    <>
      {gateways.map((gateway: Gateway) => (
        <LightningNode
          key={gateway.gateway_pub_key}
          nodeName={'Gateway'}
          nodeId={gateway.node_pub_key}
          incomingFees={gateway.fees}
          outgoingFees={gateway.fees}
        />
      ))}
    </>
  );
};

interface LightningNodeProps {
  nodeName: string;
  nodeId: string;
  incomingFees: Fees;
  outgoingFees: Fees;
}

const LightningNode: FC<LightningNodeProps> = ({
  nodeName,
  nodeId,
  incomingFees,
  outgoingFees,
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
              <Text style={titleStyles}>Fees</Text>
              <Text
                style={subTextStyles}
              >{`Incoming: ${incomingFees.base_msat} sats + (${incomingFees.proportional_millionths} ppm)`}</Text>
              <Text
                style={subTextStyles}
              >{`Outgoing: ${outgoingFees.base_msat} sats + (${outgoingFees.proportional_millionths} ppm)`}</Text>
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
          href={`https://amboss.space/node/${nodeId}`}
          target='_blank'
          rel='noreferrer'
        >
          View on amboss.space
        </a>
      </Flex>
    </Box>
  );
};
