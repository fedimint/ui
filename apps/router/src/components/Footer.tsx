import React from 'react';
import { Flex, useTheme, Link } from '@chakra-ui/react';
import { getVersionInfo } from '@fedimint/router/src/constants/Version';

export const Footer = () => {
  const theme = useTheme();
  const version = getVersionInfo();

  interface CustomLinkProps {
    href: string;
    title: string;
  }

  const CustomLink = ({ href, title }: CustomLinkProps) => {
    return (
      <Link
        _hover={{ textDecoration: 'underline' }}
        fontSize={['sm', 'md']}
        fontWeight='500'
        color={theme.colors.gray[800]}
        transition={`text-decoration 1s ease-in-out`}
        href={href}
        target='_blank'
        rel='noreferrer'
        w='fit-content'
      >
        {title}
      </Link>
    );
  };

  return (
    <Flex
      bgColor={theme.colors.gray[100]}
      p='20px'
      w='100%'
      direction={{ base: 'column-reverse', sm: 'row' }}
      align='center'
      justify='center'
    >
      <Flex direction='row' alignItems='center' gap={['3', '6']}>
        <CustomLink title='© Fedimint Devs' href='https://fedimint.org' />
        <CustomLink title={version.display} href={version.url} />
        <CustomLink title='Discord' href='https://chat.fedimint.org/' />
        <CustomLink title='Github' href='https://github.com/fedimint' />
      </Flex>
    </Flex>
  );
};
