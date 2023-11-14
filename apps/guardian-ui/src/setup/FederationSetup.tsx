import React, { useCallback, useState } from 'react';
import { Box, Button, Text, Heading, Icon, Flex } from '@chakra-ui/react';
import { ReactComponent as ArrowLeftIcon } from '../assets/svgs/arrow-left.svg';
import { useTranslation } from '@fedimint/utils';
import { useSetupContext } from '../hooks';
import { GuardianRole, SetupProgress, SETUP_ACTION_TYPE } from '../types';
import { RoleSelector } from '../components/RoleSelector';
import { SetConfiguration } from '../components/SetConfiguration';
import { ConnectGuardians } from '../components/ConnectGuardians';
import { RunDKG } from '../components/RunDKG';
import { VerifyGuardians } from '../components/VerifyGuardians';
import { SetupComplete } from '../components/SetupComplete';
import { SetupProgress as SetupStepper } from '../components/SetupProgress';
import { TermsOfService } from '../components/TermsOfService';
import { getEnv } from '../utils/env';

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
    state: { progress, role },
    dispatch,
  } = useSetupContext();
  const [needsTosAgreement, setNeedsTosAgreement] = useState(!!getEnv().TOS);

  const isHost = role === GuardianRole.Host;
  const progressIdx = PROGRESS_ORDER.indexOf(progress);
  const prevProgress: SetupProgress | undefined =
    PROGRESS_ORDER[progressIdx - 1];
  const nextProgress: SetupProgress | undefined =
    PROGRESS_ORDER[progressIdx + 1];

  const handleBack = useCallback(() => {
    if (!prevProgress) return;
    dispatch({ type: SETUP_ACTION_TYPE.SET_PROGRESS, payload: prevProgress });
    window.scrollTo(0, 0);
  }, [dispatch, prevProgress]);

  const handleNext = useCallback(() => {
    if (!nextProgress) return;
    dispatch({ type: SETUP_ACTION_TYPE.SET_PROGRESS, payload: nextProgress });
    window.scrollTo(0, 0);
  }, [dispatch, nextProgress]);

  let title: React.ReactNode;
  let subtitle: React.ReactNode;
  let canGoBack = false;
  let content: React.ReactNode;

  switch (progress) {
    case SetupProgress.Start:
      if (needsTosAgreement) {
        title = t('setup.progress.tos.title');
        content = <TermsOfService next={() => setNeedsTosAgreement(false)} />;
      } else {
        title = t('setup.progress.start.title');
        subtitle = t('setup.progress.start.subtitle');
        content = <RoleSelector next={handleNext} />;
      }
      break;
    case SetupProgress.SetConfiguration:
      title = t('setup.progress.set-config.title');
      subtitle = isHost
        ? t('setup.progress.set-config.subtitle-leader')
        : t('setup.progress.set-config.subtitle-follower');
      content = <SetConfiguration next={handleNext} />;
      canGoBack = true;
      break;
    case SetupProgress.ConnectGuardians:
      title = isHost
        ? t('setup.progress.connect-guardians.title-leader')
        : t('setup.progress.connect-guardians.title-follower');
      subtitle = isHost
        ? t('setup.progress.connect-guardians.subtitle-leader')
        : t('setup.progress.connect-guardians.subtitle-follower');
      content = <ConnectGuardians next={handleNext} />;
      canGoBack = true;
      break;
    case SetupProgress.RunDKG:
      title = t('setup.progress.run-dkg.title');
      subtitle = t('setup.progress.run-dkg.subtitle');
      content = <RunDKG next={handleNext} />;
      break;
    case SetupProgress.VerifyGuardians:
      title = t('setup.progress.verify-guardians.title');
      subtitle = t('setup.progress.verify-guardians.subtitle');
      content = <VerifyGuardians next={handleNext} />;
      break;
    case SetupProgress.SetupComplete:
      content = <SetupComplete />;
      break;
    default:
      title = t('setup.progress.error.title');
      subtitle = t('setup.progress.error.subtitle');
  }

  return (
    <Flex direction='column' gap={10} align='start'>
      {progressIdx === 0 || !progressIdx ? null : (
        <SetupStepper setupProgress={progressIdx} isHost={isHost} />
      )}
      <Flex direction='column' align='start' gap={4}>
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
          <Heading size={['sm', 'md']} fontWeight={['medium']}>
            {title}
          </Heading>
        )}
        {subtitle && (
          <Text size={['sm', 'md']} fontWeight={['medium']}>
            {subtitle}
          </Text>
        )}
      </Flex>
      <Box width='100%'>{content}</Box>
    </Flex>
  );
};
