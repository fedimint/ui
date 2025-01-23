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
          {t('router.title', 'No services connected yet.')}
        </Text>
        <Text>{t('router.services-title')}</Text>
        <UnorderedList spacing={4} paddingLeft={6}>
          <ListItem>
            <Text fontWeight='bold'>{t('router.guardians')}</Text>
            <Text>{t('router.services-description')}</Text>
          </ListItem>
          <ListItem>
            <Text fontWeight='bold'>{t('router.gateways')}</Text>
            <Text>{t('router.gateways-description')}</Text>
          </ListItem>
        </UnorderedList>
        <Text>{t('router.learn-more')}</Text>
        <Link
          href='https://github.com/fedimint/fedimint'
          isExternal
          color='blue.500'
          textAlign='center'
        >
          {t('router.learn-more-link')}
        </Link>
      </Flex>
    </Box>
  );
};
