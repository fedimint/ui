import React, { useEffect } from 'react';
import { Flex, Heading, Text, Spinner } from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { useNotification } from '../../../../../home/NotificationProvider';
import {
  GUARDIAN_APP_ACTION_TYPE,
  GuardianRole,
  GuardianStatus,
} from '../../../../../types/guardian';
import { useGuardianContext } from '../../../../../context/hooks';

interface SetupCompleteProps {
  role: GuardianRole;
}

export const SetupComplete: React.FC<SetupCompleteProps> = ({ role }) => {
  const { t } = useTranslation();
  const { showSuccess } = useNotification();
  const { dispatch } = useGuardianContext();

  useEffect(() => {
    showSuccess(t('setup-complete.congratulations'));
    const timer = setTimeout(() => {
      dispatch({
        type: GUARDIAN_APP_ACTION_TYPE.SET_STATUS,
        payload: GuardianStatus.Admin,
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [dispatch, showSuccess, t]);

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
      <Flex direction='column' align='center'>
        <Spinner size='xl' mb={4} />
      </Flex>
    </Flex>
  );
};
