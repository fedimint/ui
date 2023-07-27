import React, { useState, FC } from 'react';
import {
  Box,
  Button,
  Heading,
  Stack,
  Text,
  useTheme,
  Flex,
  Textarea,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  CircularProgressLabel,
  CircularProgress,
} from '@chakra-ui/react';
import { ApiContext } from '../ApiProvider';
import { Federation } from '../types';
import { useTranslation } from '@fedimint/utils';
import { InformationBar } from './InformationBar';
import { ReactComponent as InfoSolidIcon } from '../assets/svgs/info-solid.svg';

export interface ConnectFedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConnectFedModal: FC<ConnectFedModalProps> = ({
  isOpen,
  onClose,
}) => {
  const theme = useTheme();

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <Flex
              bgColor={theme.colors.white}
              padding='48px'
              justifyContent='center'
              alignItems='center'
              height='340px'
              maxW='400px'
            >
              <CircularProgress
                isIndeterminate={true}
                color={theme.colors.blue[600]}
                size='240px'
                thickness='10px'
                capIsRound={true}
              >
                <CircularProgressLabel
                  fontSize='md'
                  fontWeight='500'
                  color={theme.colors.gray[600]}
                  fontFamily={theme.fonts.body}
                  textAlign='center'
                  width='130px'
                >
                  Connecting to federation...
                </CircularProgressLabel>
              </CircularProgress>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export type ConnectFederationProps = {
  renderConnectedFedCallback: (federation: Federation) => void;
};

export const ConnectFederation = ({
  renderConnectedFedCallback,
}: ConnectFederationProps) => {
  const { t } = useTranslation();
  const { gateway } = React.useContext(ApiContext);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [connectInfo, setConnectInfo] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const handleInputString = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    setConnectInfo(event.target.value);
  };

  const handleConnectFederation = () => {
    setLoading(true);
    gateway
      .connectFederation(connectInfo)
      .then((federation) => {
        renderConnectedFedCallback(federation);
        setConnectInfo('');
        setLoading(false);
      })
      .catch(({ message, error }) => {
        console.error(error);
        setErrorMsg(message);
        setLoading(false);
      });
  };

  return (
    <>
      <Stack spacing='32px'>
        <Box>
          <Heading
            fontSize='28px'
            size='md'
            fontWeight='medium'
            color={theme.colors.gray[900]}
          >
            {t('connect-federation.heading')}
          </Heading>
          <Text size='md' fontWeight='medium' pt='4px'>
            {t('connect-federation.sub-heading')}
          </Text>
        </Box>
        <InformationBar
          icon={<InfoSolidIcon color={theme.colors.blue[600]} />}
          backgroundColor={theme.colors.blue[50]}
        >
          <Text
            fontSize='sm'
            fontWeight='medium'
            color={theme.colors.blue[600]}
          >
            {t('connect-federation.information-bar-text')}
          </Text>
        </InformationBar>
        <Textarea
          placeholder={t('connect-federation.connection-string-placeholder')}
          _placeholder={{
            fontSize: 'md',
            color: `${theme.colors.gray[500]}`,
            fontFamily: `${theme.fonts.body}`,
          }}
          h='120px'
          maxW='460px'
          p='14px'
          boxShadow={theme.shadows.xs}
          border={`1px solid ${theme.colors.gray[300]}`}
          bgColor={theme.colors.white}
          value={connectInfo}
          onChange={(event) => handleInputString(event)}
        />
        <Button
          borderRadius='8px'
          maxW='210px'
          isDisabled={!connectInfo}
          onClick={handleConnectFederation}
        >
          {t('connect-federation.connect-federation-button')}
        </Button>
        <Box color='red.500'>{errorMsg}</Box>
      </Stack>
      <ConnectFedModal isOpen={loading} onClose={() => !loading} />
    </>
  );
};
