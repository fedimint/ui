import React from 'react';
import { Button, Box, Link, Flex, Center } from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { FiPlus } from 'react-icons/fi';

interface Props {
  onOpen: () => void;
}

export const NoConnectedServices: React.FC<Props> = ({ onOpen }) => {
  const { t } = useTranslation();

  return (
    <Box textAlign='left' py={10} maxWidth='800px' margin='auto'>
      <Flex direction='column' gap={6} alignItems='center'>
        <Flex
          direction='row'
          gap={6}
          align='center'
          justifyContent='center'
          height='300px'
          width='100%'
        >
          <Box
            p='4'
            backgroundColor='#f8f8f8'
            borderRadius='5px'
            borderWidth='1px'
            height='100%'
            width='100%'
          >
            <Center height='100%'>
              <Button
                aria-label='connect-service-btn'
                leftIcon={<FiPlus />}
                onClick={onOpen}
                colorScheme='blue'
                width='200px'
              >
                {t('home.connect-service-button.label')}
              </Button>
            </Center>
          </Box>
        </Flex>
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
