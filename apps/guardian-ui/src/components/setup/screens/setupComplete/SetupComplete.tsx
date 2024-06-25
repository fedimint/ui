import React from 'react';
import { Flex, Heading, Text, Button, Icon } from '@chakra-ui/react';
import { ReactComponent as ArrowRightIcon } from '../../../../assets/svgs/arrow-right.svg';
import { useAppContext } from '../../../../hooks';
import { useTranslation } from '@fedimint/utils';
import { APP_ACTION_TYPE, GuardianRole, Status } from '../../../../types';

interface SetupCompleteProps {
  role: GuardianRole;
}

export const SetupComplete: React.FC<SetupCompleteProps> = ({ role }) => {
  const { t } = useTranslation();
  const { dispatch } = useAppContext();

  const handleContinue = () => {
    dispatch({ type: APP_ACTION_TYPE.SET_STATUS, payload: Status.Admin });
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
        {role === GuardianRole.Follower
          ? t(`setup-complete.follower-message`)
          : t(`setup-complete.leader-message`)}
      </Text>
      <Button leftIcon={<Icon as={ArrowRightIcon} />} onClick={handleContinue}>
        {t('setup-complete.continue')}
      </Button>
    </Flex>
  );
};
