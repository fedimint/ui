import React, { FC, memo } from 'react';
import { Box, Flex, Image, Stack, Text } from '@chakra-ui/react';
import { ReactComponent as HomeIcon } from '../assets/svgs/home.svg';
import { ReactComponent as GuardianIcon } from '../assets/svgs/guardians.svg';
import { ReactComponent as ModulesIcon } from '../assets/svgs/modules.svg';
import { ReactComponent as SettingsIcon } from '../assets/svgs/settings.svg';
import { ReactComponent as AccountIcon } from '../assets/svgs/account.svg';
import Logo from '../assets/images/Fedimint-Full.png';

export interface SiderBarItemProps {
  navText: string;
  onClick?: () => void;
  icon?: React.ReactElement<
    React.SVGProps<SVGSVGElement> & {
      title?: string | undefined;
    }
  >;
  navTextAmount?: number;
  color?: string;
  heading?: boolean;
}

const SiderBarItem: FC<SiderBarItemProps> = ({
  navText,
  onClick,
  icon,
  navTextAmount,
  color = '#4B5563',
  heading,
}) => {
  return (
    <Flex
      _hover={{ bgColor: heading ? 'transparent' : '#F3F4F6' }}
      cursor='pointer'
      onClick={onClick}
      p='0px 12px 0px 8px'
      h='40px'
      borderRadius='6px'
      justifyContent='space-between'
      alignItems='center'
      color='#4B5563'
    >
      <Flex gap='12px' alignItems='center'>
        <>{icon}</>
        <Text
          fontSize={heading ? '12px' : '14px'}
          fontWeight={heading ? '600' : '500'}
          lineHeight='20px'
          color={color}
        >
          {navText}
        </Text>
      </Flex>
      {navTextAmount && (
        <Text
          fontSize='12px'
          fontWeight='500'
          lineHeight='20px'
          p='2px 12px'
          color='#4B5563'
          bgColor='#F3F4F6'
          borderRadius='10px'
        >
          {navTextAmount}
        </Text>
      )}
    </Flex>
  );
};

export const Divider = memo(function Divider(): JSX.Element {
  return <Box bgColor='#E5E7EB' height='1px'></Box>;
});

export const SideBar: FC = () => {
  return (
    <Flex
      borderRight='1px solid #E5E7EB'
      flexDir='column'
      w='256px'
      height='100vh'
      alignItems='flex-start'
    >
      <Flex w='100%' p='0px 8px' pt='8px' flexDir='column'>
        <Stack spacing='16px'>
          <Box h='52px' p='12px 16px'>
            <Image
              src={Logo}
              alt='Fedimint Logo'
              boxSize='200px'
              h='28px'
              w='122px'
            />
          </Box>
          <Stack spacing='4px'>
            <SiderBarItem navText='Dashboard' icon={<HomeIcon />} />
            <SiderBarItem
              navText='Guardians'
              icon={<GuardianIcon />}
              navTextAmount={8}
            />
            <SiderBarItem
              navText='Modules'
              icon={<ModulesIcon />}
              navTextAmount={3}
            />
            <SiderBarItem navText='Settings' icon={<SettingsIcon />} />
          </Stack>
          <Divider />
          <SiderBarItem navText='My account' icon={<AccountIcon />} />
          <Divider />
          <Stack spacing='4px'>
            <SiderBarItem navText='RESOURCES' color='#A1A1A1' heading={true} />
            <SiderBarItem navText='Fedimint guide' />
            <SiderBarItem navText='FAQs' />
          </Stack>
          <Divider />
          <Stack spacing='4px'>
            <SiderBarItem
              navText='FEDERATION INFO'
              color='#A1A1A1'
              heading={true}
            />
            <SiderBarItem navText='API version 1.0' />
            <SiderBarItem navText='Consensus version 1.0' />
          </Stack>
        </Stack>
      </Flex>
    </Flex>
  );
};
