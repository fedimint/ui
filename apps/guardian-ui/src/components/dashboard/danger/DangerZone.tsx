import React, { useState } from 'react';
import {
  Box,
  Text,
  Flex,
  theme,
  Collapse,
  IconButton,
  Button,
} from '@chakra-ui/react';
import { GuardianAuthenticationCode } from './GuardianAuthenticationCode';
import { DownloadBackup } from './DownloadBackup';
import { useTranslation } from '@fedimint/utils';
import { ReactComponent as ChevronDownIcon } from '../../../assets/svgs/chevron-down.svg';
import { ReactComponent as ChevronUpIcon } from '../../../assets/svgs/chevron-up.svg';
import { ScheduleShutdown } from './ScheduleShutdown';
import { SignedApiAnnouncement } from '@fedimint/types';

interface DangerZoneProps {
  ourPeer: { id: number; name: string } | undefined;
  inviteCode: string;
  latestSession: number | undefined;
  signedApiAnnouncements: Record<string, SignedApiAnnouncement>;
  onApiAnnouncementOpen: () => void;
}

export const DangerZone: React.FC<DangerZoneProps> = ({
  ourPeer,
  inviteCode,
  latestSession,
  onApiAnnouncementOpen,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapse = () => setIsOpen(!isOpen);

  return (
    <Box
      mt='12px'
      bg='red.50'
      p={4}
      borderRadius='md'
      border='1px'
      borderColor='red.200'
    >
      <Flex justifyContent='space-between' alignItems='center'>
        <Text
          mb='6px'
          fontSize='16px'
          fontWeight='600'
          color={theme.colors.gray[800]}
        >
          {t('federation-dashboard.danger-zone.danger-zone-label')}
        </Text>
        <IconButton
          onClick={toggleCollapse}
          size='sm'
          variant='ghost'
          color='red.500'
          icon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
          aria-label='Toggle Danger Zone'
          _hover={{ bg: 'red.100' }}
          _active={{ bg: 'red.200' }}
          mb='6px'
        />
      </Flex>
      <Collapse in={isOpen} animateOpacity>
        <Flex direction={['column', 'row']} alignItems='center' gap='6px'>
          {ourPeer !== undefined && (
            <GuardianAuthenticationCode
              ourPeer={ourPeer}
              inviteCode={inviteCode}
            />
          )}
          <DownloadBackup />
          {ourPeer && (
            <Button
              size={['sm', 'md']}
              bg={theme.colors.red[500]}
              _hover={{ bg: theme.colors.red[600] }}
              onClick={onApiAnnouncementOpen}
            >
              {t(
                'federation-dashboard.danger-zone.sign-api-announcement.label'
              )}
            </Button>
          )}
          {latestSession && <ScheduleShutdown latestSession={latestSession} />}
        </Flex>
      </Collapse>
      <Text mt='6px' fontSize='14px' color={theme.colors.gray[600]}>
        {t('federation-dashboard.danger-zone.danger-zone-description')}
      </Text>
    </Box>
  );
};
