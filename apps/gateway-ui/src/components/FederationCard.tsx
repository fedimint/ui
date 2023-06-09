import React, { useState } from 'react';
import {
  Button,
  Tabs,
  TabList,
  TabPanels,
  Divider,
  Collapse,
  Text,
  Circle,
  Box,
  HStack,
  Flex,
  Stack,
} from '@chakra-ui/react';
import { Federation } from '../types';
import { InfoTabHeader, InfoTab, DepositTab, DepositTabHeader } from '.';
import { WithdrawTab, WithdrawTabHeader } from './WithdrawTab';

interface FederationCardProps {
  federation: Federation;
}

enum OpenTab {
  Off = -1,
  InfoTab = 0,
  DepositTab = 1,
  WithdrawTab = 2,
}

export const FederationCard = (props: FederationCardProps): JSX.Element => {
  const {
    federation_id,
    balance_msat,
    registration: { gateway_pub_key },
  } = props.federation;

  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [tab, setOpenTab] = useState<{ open: OpenTab; mru: OpenTab }>({
    open: OpenTab.Off,
    mru: OpenTab.Off,
  });

  const tabControl = (openTab: number) => {
    setOpenTab({ open: openTab, mru: openTab });
    setShowDetails(true);
  };

  const detailsControl = () => {
    const nextState = !showDetails;
    if (nextState) {
      // If we are going to show details and there is no open tab,
      // start off with the InfoTab, otherwise, open the most recently open tab
      tab.mru < 0
        ? setOpenTab({ open: OpenTab.InfoTab, mru: OpenTab.InfoTab })
        : setOpenTab({ open: tab.mru, mru: tab.mru });
    } else {
      setOpenTab({ open: OpenTab.Off, mru: tab.mru });
    }
    setShowDetails(nextState);
  };

  return (
    <>
      <Stack
        padding={[4, 4, 6, 6]}
        borderRadius={4}
        boxShadow='rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px'
      >
        <Flex justifyContent='space-between' alignItems='center'>
          <HStack>
            <Circle size='54px' bgColor='black'>
              <Text color='white'>FM</Text>
            </Circle>
            <Box pl='2'>
              <Text fontSize={{ base: '13px', md: '15px', lg: '16px' }}>
                {`${gateway_pub_key?.substring(0, 24)}...`}
              </Text>
            </Box>
          </HStack>
          <Button
            fontSize={{ base: '12px', md: '15px', lg: '16px' }}
            onClick={detailsControl}
          >
            Details
          </Button>
        </Flex>
        <Tabs index={tab.open} onChange={tabControl} pt={3} variant='unstyled'>
          <TabList gap={2}>
            <InfoTabHeader />
            <DepositTabHeader />
            <WithdrawTabHeader />
          </TabList>
          <Collapse in={showDetails} animateOpacity>
            <Divider />
            <TabPanels>
              <InfoTab balance_msat={balance_msat} />
              <DepositTab
                federationId={federation_id}
                active={tab.open === OpenTab.DepositTab}
              />
              <WithdrawTab federationId={federation_id} />
            </TabPanels>
          </Collapse>
        </Tabs>
      </Stack>
    </>
  );
};
