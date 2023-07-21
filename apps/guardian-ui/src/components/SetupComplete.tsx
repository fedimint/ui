import React from 'react';
import { Flex, Heading, Text, Button, Icon } from '@chakra-ui/react';
import { ReactComponent as ArrowRightIcon } from '../assets/svgs/arrow-right.svg';
import { useAppContext } from '../hooks';
import { useTranslation } from '@fedimint/utils';

export const SetupComplete: React.FC = () => {
  const { t } = useTranslation();
  const { transitionToAdmin } = useAppContext();

  const handleContinue = () => {
    // TODO: Reset setup state
    transitionToAdmin();
  };

  return (
    <Flex
      direction='column'
      justify='center'
      align='center'
      textAlign='center'
      pt={10}
    >
      <Heading size='sm' fontSize='42px' mb={8}>
        {t('setup-complete.header')}
      </Heading>
      <Heading size='md' fontWeight='medium' mb={2}>
        {t('setup-complete.congratulations')}
      </Heading>
      <Text mb={16} fontWeight='medium'>
        {t('setup-complete.sentence-one')}
      </Text>
      <Button leftIcon={<Icon as={ArrowRightIcon} />} onClick={handleContinue}>
        {t('setup-complete.continue')}
      </Button>
    </Flex>
  );
};
