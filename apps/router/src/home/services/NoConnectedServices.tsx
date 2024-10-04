import React from 'react';
import {
  Box,
  Text,
  Link,
  UnorderedList,
  ListItem,
  Flex,
} from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';

export const NoConnectedServices: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box textAlign='left' py={10} maxWidth='800px' margin='auto'>
      <Flex direction='column' gap={6} align='stretch'>
        <Text fontSize='xl' fontWeight='bold' textAlign='center'>
          {t('home.no-services')}
        </Text>
        <Text>{t('home.federation-services-description')}</Text>
        <UnorderedList spacing={4} paddingLeft={6}>
          <ListItem>
            <Text fontWeight='bold'>{t('home.guardians-title')}</Text>
            <Text>{t('home.guardians-description')}</Text>
          </ListItem>
          <ListItem>
            <Text fontWeight='bold'>{t('home.gateways-title')}</Text>
            <Text>{t('home.gateways-description')}</Text>
          </ListItem>
        </UnorderedList>
        <Text>{t('home.learn-more-text')}</Text>
        <Link
          href='https://github.com/fedimint/fedimint'
          isExternal
          color='blue.500'
          textAlign='center'
        >
          {t('home.learn-more-link')}
        </Link>
      </Flex>
    </Box>
  );
};
