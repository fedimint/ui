import React from 'react';
import { Flex, Heading, Text, Button, Icon } from '@chakra-ui/react';
import { ReactComponent as ArrowRightIcon } from '../assets/svgs/arrow-right.svg';
import { useAppContext } from '../hooks';

export const SetupComplete: React.FC = () => {
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
        🎉 🎉 🎉
      </Heading>
      <Heading size='md' fontWeight='medium' mb={2}>
        Congratulations
      </Heading>
      <Text mb={16} fontWeight='medium'>
        All Guardians’ verification codes have been verified.
      </Text>
      <Button leftIcon={<Icon as={ArrowRightIcon} />} onClick={handleContinue}>
        Continue
      </Button>
    </Flex>
  );
};
