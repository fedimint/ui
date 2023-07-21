import React from 'react';
import {
  Box,
  Flex,
  Stack,
  useTheme,
  Text,
  Link,
  Center,
} from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';

const Footer = () => {
  const theme = useTheme();
  const { t } = useTranslation();

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
    <Flex bgColor={theme.colors.gray[900]} p='28px 0px 100px' w='100%'>
      <Center width='100%'>
        <Box
          maxW='960px'
          mr={[2, 4, 6, 10]}
          ml={[2, 4, 6, 10]}
          p={{ base: 0, sm: 0, md: 0, lg: 5 }}
          width='100%'
        >
          <Box
            display='grid'
            gridTemplateColumns='repeat(3, minmax(0, 1fr))'
            justifyItems={{ base: 'center', md: 'normal' }}
            color={theme.colors.blue[50]}
          >
            <Stack spacing='12px'>
              <Text
                fontSize={{ base: 'sm', sm: 'md', md: 'md', lg: 'md' }}
                color={theme.colors.blue[50]}
                fontWeight='600'
              >
                {t('footer.docs')}
              </Text>
              <CustomLink
                title={t('footer.getting_started')}
                href={t('footer.fedimint_org_link')}
              />
              <CustomLink
                title={t('footer.frequently_asked_questions')}
                href={t('footer.frequently_asked_questions_hyperlink')}
              />
              <CustomLink
                title={t('footer.blog')}
                href={t('footer.fedimint_docs_intro_hyperlink')}
              />
            </Stack>
            <Stack spacing='12px'>
              <Text
                fontSize={{ base: 'sm', sm: 'md', md: 'md', lg: 'md' }}
                color={theme.colors.blue[50]}
                fontWeight='600'
              >
                {t('footer.community')}
              </Text>
              <CustomLink
                title={t('footer.discord')}
                href={t('footer.discord_hyperlink')}
              />
              <CustomLink
                title={t('footer.twitter')}
                href={t('footer.twitter_hyperlink')}
              />
            </Stack>

            <Stack spacing='12px'>
              <Text
                fontSize={{ base: 'sm', sm: 'md', md: 'md', lg: 'md' }}
                color={theme.colors.blue[50]}
                fontWeight='600'
              >
                {t('footer.contribute')}
              </Text>
              <CustomLink
                title={t('footer.github')}
                href={t('footer.github_hyperlink')}
              />
            </Stack>
          </Box>
        </Box>
      </Center>
    </Flex>
  );
};

export default Footer;
