import React, { useEffect, useState } from 'react';
import { Flex, Heading, Text, Spinner } from '@chakra-ui/react';
import { useAppContext } from '../../../../hooks';
import { useTranslation } from '@fedimint/utils';
import { APP_ACTION_TYPE, GuardianRole, Status } from '../../../../types';

interface SetupCompleteProps {
  role: GuardianRole;
}

export const SetupComplete: React.FC<SetupCompleteProps> = ({ role }) => {
  const { t } = useTranslation();
  const { dispatch } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(true);
      dispatch({ type: APP_ACTION_TYPE.SET_STATUS, payload: Status.Admin });
    }, 3000);

    return () => clearTimeout(timer);
  }, [dispatch]);

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
      {isLoading && (
        <Flex direction='column' align='center'>
          <Spinner size='xl' mb={4} />
          <Text>{t('setup-complete.loading-next-stage')}</Text>
        </Flex>
      )}
    </Flex>
  );
};
