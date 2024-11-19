import React from 'react';
import { Flex, useTheme, Link, Box } from '@chakra-ui/react';
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
        fontSize={{ base: 'xs', sm: 'sm', md: 'sm', lg: 'sm' }}
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
      p='28px'
      w='100%'
      direction={{ base: 'column-reverse', sm: 'row' }}
      align='center'
      justify='center'
    >
      <Flex direction='column' alignItems='center'>
        <Flex direction='row' alignItems='center'>
          <CustomLink
            title='© The Fedimint Developers'
            href='https://fedimint.org'
          />
          <Box marginLeft='2'>
            <CustomLink title={version.display} href={version.url} />
          </Box>
        </Flex>

        <Flex direction='row' gap={4} justifyContent='center' marginTop='2'>
          <CustomLink title='Discord' href='https://chat.fedimint.org/' />
          <CustomLink title='Github' href='https://github.com/fedimint' />
        </Flex>
      </Flex>
    </Flex>
  );
};
