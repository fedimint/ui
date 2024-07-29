import React, { useState, useMemo } from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Flex,
  Box,
  Icon,
  Tooltip,
  Divider,
} from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { SignedApiAnnouncement } from '@fedimint/types';
import { normalizeUrl } from '../../../utils';
import { FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import { useAdminContext } from '../../../hooks';

interface SignApiAnnouncementProps {
  isOpen: boolean;
  onClose: () => void;
  ourPeer: { id: number; name: string };
  signedApiAnnouncements: Record<string, SignedApiAnnouncement>;
}

export const SignApiAnnouncement: React.FC<SignApiAnnouncementProps> = ({
  isOpen,
  onClose,
  ourPeer,
  signedApiAnnouncements,
}) => {
  const { api } = useAdminContext();
  const { t } = useTranslation();
  const [isSigningNew, setIsSigningNew] = useState(false);

  const currentApiUrl = process.env.REACT_APP_FM_CONFIG_API || '';
  const currentAnnouncement = ourPeer
    ? signedApiAnnouncements[ourPeer.id.toString()].api_announcement
    : undefined;

  const announcementMatches = useMemo(() => {
    if (!currentAnnouncement) return false;
    return (
      normalizeUrl(currentAnnouncement.api_url) === normalizeUrl(currentApiUrl)
    );
  }, [currentAnnouncement, currentApiUrl]);

  const handleSignNewAnnouncement = () => {
    setIsSigningNew(true);
    api.signApiAnnouncement(currentApiUrl).then(() => {
      setIsSigningNew(false);
      onClose();
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size='lg'>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader bg='blue.50' borderTopRadius='md'>
          {t('federation-dashboard.danger-zone.sign-api-announcement.title')}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody py={6}>
          <Flex direction='column' gap={4}>
            <Box borderWidth={1} borderRadius='md' p={4} bg='gray.50'>
              <Text fontWeight='bold' mb={2}>
                {t(
                  'federation-dashboard.danger-zone.sign-api-announcement.current-api-url'
                )}
              </Text>
              <Text fontFamily='mono'>{currentApiUrl}</Text>
            </Box>
            <Box borderWidth={1} borderRadius='md' p={4} bg='gray.50'>
              <Text fontWeight='bold' mb={2}>
                {t(
                  'federation-dashboard.danger-zone.sign-api-announcement.announced-api-url'
                )}
              </Text>
              <Text fontFamily='mono'>
                {currentAnnouncement?.api_url || t('common.unknown')}
              </Text>
            </Box>
            <Divider my={2} />
            <Flex align='center' gap={2}>
              <Icon
                as={announcementMatches ? FiCheckCircle : FiAlertTriangle}
                color={announcementMatches ? 'green.500' : 'orange.500'}
                boxSize={6}
              />
              <Text
                fontWeight='medium'
                color={announcementMatches ? 'green.600' : 'orange.600'}
              >
                {announcementMatches
                  ? t(
                      'federation-dashboard.danger-zone.sign-api-announcement.urls-match'
                    )
                  : t(
                      'federation-dashboard.danger-zone.sign-api-announcement.urls-mismatch'
                    )}
              </Text>
            </Flex>
          </Flex>
        </ModalBody>

        <ModalFooter bg='gray.50' borderBottomRadius='md'>
          {!announcementMatches && (
            <Tooltip
              label={t(
                'federation-dashboard.danger-zone.sign-api-announcement.sign-tooltip'
              )}
            >
              <Button
                colorScheme='blue'
                mr={3}
                onClick={handleSignNewAnnouncement}
                isLoading={isSigningNew}
                loadingText={t(
                  'federation-dashboard.danger-zone.sign-api-announcement.signing-in-progress'
                )}
              >
                {t(
                  'federation-dashboard.danger-zone.sign-api-announcement.sign-button'
                )}
              </Button>
            </Tooltip>
          )}
          <Button variant='ghost' onClick={onClose}>
            {t('common.close')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
