import React, { FC } from 'react';
import { Box, Center, Flex, Text, useTheme } from '@chakra-ui/react';
import { ReactComponent as BitcoinIcon } from '../assets/svgs/bitcoin-white.svg';
import { ReactComponent as EcashIcon } from '../assets/svgs/ecash.svg';
import { ReactComponent as BankNotesIcon } from '../assets/svgs/banknotes.svg';
import { ReactComponent as InfoIcon } from '../assets/svgs/info.svg';

interface FederationBalanceProps {
  title: string;
  amount: number;
  icon: React.ReactElement<
    React.SVGProps<SVGSVGElement> & {
      title?: string | undefined;
    }
  >;
}

const FederationBalance: FC<FederationBalanceProps> = ({
  title,
  amount,
  icon,
}) => {
  const theme = useTheme();

  return (
    <Box
      display='flex'
      maxWidth='392px'
      w='100%'
      flexDir='column'
      borderRadius='6px'
      boxShadow={theme.shadows.sm}
    >
      <Flex
        h='100px'
        w='100%'
        p={{ base: '14px', sm: '16px', md: '24px', lg: '24px' }}
        gap='20px'
        alignItems='center'
      >
        <Center
          p={{ base: '6px', sm: '8px', md: '12px', lg: '12px' }}
          h={{ base: '32px', sm: '32px', md: '48px', lg: '48px' }}
          w={{ base: '32px', sm: '32px', md: '48px', lg: '48px' }}
          borderRadius='6px'
          bgColor={theme.colors.blue[600]}
        >
          {icon}
        </Center>
        <Flex flexDir='column'>
          <Text
            fontSize='sm'
            fontWeight='medium'
            color={theme.colors.gray[500]}
          >
            {title}
          </Text>
          <Text fontSize='xl' fontWeight='bold' color={theme.colors.gray[900]}>
            {amount}
          </Text>
        </Flex>
      </Flex>
      <Box
        h='16px'
        bgColor={theme.colors.gray[50]}
        borderBottomRadius='6px'
      ></Box>
    </Box>
  );
};

export const AdminMain = () => {
  const theme = useTheme();

  return (
    <Flex flexDir='column' pr='32px'>
      <Flex alignItems='center' gap='4px'>
        <Text
          fontWeight='semibold'
          color={theme.colors.gray[900]}
          fontSize='xl'
        >
          Community Custody
        </Text>
        {<InfoIcon color={theme.colors.gray[400]} />}
      </Flex>
      <Flex
        gap='4'
        p='24px 0px 32px'
        justifyContent='space-between'
        flexDir={{ base: 'column', sm: 'row', md: 'row', lg: 'row' }}
      >
        <FederationBalance
          title='Bitcoin'
          amount={0}
          icon={<BitcoinIcon color={theme.colors.white} />}
        />
        <FederationBalance
          title='eCash'
          amount={0}
          icon={<EcashIcon color={theme.colors.blue[600]} />}
        />
        <FederationBalance
          title='Local currency (US Dollar)'
          amount={0}
          icon={<BankNotesIcon color={theme.colors.white} />}
        />
      </Flex>
    </Flex>
  );
};
