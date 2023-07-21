import React, { useCallback } from 'react';
import { Box, Button, Text, Heading, Icon, VStack } from '@chakra-ui/react';
import { ReactComponent as ArrowLeftIcon } from '../assets/svgs/arrow-left.svg';
import { useTranslation } from '@fedimint/utils';
import { Header } from '../components/Header';
import { useSetupContext } from '../hooks';
import { GuardianRole, SetupProgress, SETUP_ACTION_TYPE } from './types';
import { RoleSelector } from '../components/RoleSelector';
import { SetConfiguration } from '../components/SetConfiguration';
import { Login } from '../components/Login';
import { ConnectGuardians } from '../components/ConnectGuardians';
import { RunDKG } from '../components/RunDKG';
import { VerifyGuardians } from '../components/VerifyGuardians';
import { SetupComplete } from '../components/SetupComplete';
import { SetupProgress as SetupStepper } from '../components/SetupProgress';

const PROGRESS_ORDER: SetupProgress[] = [
  SetupProgress.Start,
  SetupProgress.SetConfiguration,
  SetupProgress.ConnectGuardians,
  SetupProgress.RunDKG,
  SetupProgress.VerifyGuardians,
  SetupProgress.SetupComplete,
];

export const FederationSetup: React.FC = () => {
  const { t } = useTranslation();
  const {
    state: { progress, role, password, needsAuth },
    dispatch,
  } = useSetupContext();

  const isHost = role === GuardianRole.Host;
  const progressIdx = PROGRESS_ORDER.indexOf(progress);
  const prevProgress: SetupProgress | undefined =
    PROGRESS_ORDER[progressIdx - 1];
  const nextProgress: SetupProgress | undefined =
    PROGRESS_ORDER[progressIdx + 1];

  const handleBack = useCallback(() => {
    if (!prevProgress) return;
    dispatch({ type: SETUP_ACTION_TYPE.SET_PROGRESS, payload: prevProgress });
  }, [dispatch, prevProgress]);

  const handleNext = useCallback(() => {
    if (!nextProgress) return;
    dispatch({ type: SETUP_ACTION_TYPE.SET_PROGRESS, payload: nextProgress });
  }, [dispatch, nextProgress]);

  let title: React.ReactNode;
  let subtitle: React.ReactNode;
  let canGoBack = false;
  let content: React.ReactNode;
  if (needsAuth && !password) {
    title = t('setup.auth.title');
    subtitle = t('setup.auth.subtitle');
    content = <Login />;
  } else {
    switch (progress) {
      case SetupProgress.Start:
        title = t('setup.progress.start.title');
        subtitle = t('setup.progress.start.subtitle');
        content = <RoleSelector next={handleNext} />;
        break;
      case SetupProgress.SetConfiguration:
        title = t('setup.progress.set_config.title');
        subtitle = isHost
          ? t('setup.progress.set_config.subtitle_leader')
          : t('setup.progress.set_config.subtitle_follower');
        content = <SetConfiguration next={handleNext} />;
        canGoBack = true;
        break;
      case SetupProgress.ConnectGuardians:
        title = isHost
          ? t('setup.progress.connect_guardians.title_leader')
          : t('setup.progress.connect_guardian.title_follower');
        subtitle = isHost
          ? t('setup.progress.connect_guardians.subtitle_leader')
          : t('setup.progress.set_config_subtitle_follower');
        content = <ConnectGuardians next={handleNext} />;
        canGoBack = true;
        break;
      case SetupProgress.RunDKG:
        title = t('setup.progress.run_dkg.title');
        subtitle = t('setup.progress.run_dkg.subtitle');
        content = <RunDKG next={handleNext} />;
        break;
      case SetupProgress.VerifyGuardians:
        title = t('setup.progress.verify_guardians.title');
        subtitle = t('setup.progress.verify_guardians.subtitle');
        content = <VerifyGuardians next={handleNext} />;
        break;
      case SetupProgress.SetupComplete:
        content = <SetupComplete />;
        break;
      default:
        title = t('setup.progress.error.title');
        subtitle = t('setup.progress.error.subtitle');
    }
  }

  return (
    <VStack gap={8} align='start'>
      <Header />
      {progressIdx === 0 || !progressIdx ? null : (
        <SetupStepper setupProgress={progressIdx} isHost={isHost} />
      )}
      <VStack align='start' gap={2}>
        {prevProgress && canGoBack && (
          <Button
            variant='link'
            onClick={handleBack}
            leftIcon={<Icon as={ArrowLeftIcon} />}
          >
            {t('common.back')}
          </Button>
        )}
        {title && (
          <Heading size='md' fontWeight='medium'>
            {title}
          </Heading>
        )}
        {subtitle && (
          <Text size='md' fontWeight='medium'>
            {subtitle}
          </Text>
        )}
      </VStack>
      <Box mt={10} width='100%'>
        {content}
      </Box>
    </VStack>
  );
};
