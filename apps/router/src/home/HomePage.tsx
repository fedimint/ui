import React, { useContext, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { Wrapper } from '@fedimint/ui';
import { useTranslation } from '@fedimint/utils';
import { AppContext } from '../AppContext';

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { guardians, gateways } = useContext(AppContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [configUrl, setConfigUrl] = useState('');

  const content = useMemo(() => {
    const services = [
      ...guardians.map((g, index) => ({ type: 'guardian', index })),
      ...gateways.map((g, index) => ({ type: 'gateway', index })),
    ];

    return (
      <Flex
        direction='column'
        align='center'
        width='100%'
        paddingTop='10vh'
        paddingX='4'
      >
        {services.length === 0 ? (
          <>
            <Button
              onClick={onOpen}
              colorScheme='green'
              mb={4}
              width='100%'
              maxWidth='400px'
            >
              {t('home.connectGuardian', 'Connect a Guardian')}
            </Button>
            <Button
              onClick={onOpen}
              colorScheme='purple'
              mb={8}
              width='100%'
              maxWidth='400px'
            >
              {t('home.connectGateway', 'Connect a Gateway')}
            </Button>
          </>
        ) : (
          <>
            <Text fontSize='xl' fontWeight='bold' mb={4}>
              {t('home.connectedServices', 'Connected Services')}
            </Text>
            <Flex
              direction='column'
              gap={4}
              align='stretch'
              width='100%'
              maxWidth='400px'
            >
              {services.map((service) => (
                <Link
                  key={`${service.type}-${service.index}`}
                  to={`/${service.type}/${service.index}`}
                >
                  <Button
                    width='100%'
                    colorScheme={
                      service.type === 'guardian' ? 'green' : 'purple'
                    }
                  >
                    {t(`home.${service.type}`, service.type)}{' '}
                    {service.index + 1}
                  </Button>
                </Link>
              ))}
            </Flex>
          </>
        )}
      </Flex>
    );
  }, [guardians, gateways, t, onOpen]);

  return (
    <Center>
      <Box width='100%'>
        <Wrapper>{content}</Wrapper>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('home.addGuardian', 'Add Guardian')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>{t('notConfigured.urlLabel')}</FormLabel>
              <Input
                placeholder='wss://fedimintd.my-awesome-domain.com:6000'
                value={configUrl}
                onChange={(e) => setConfigUrl(e.target.value)}
              />
            </FormControl>
            <Button mt={4} colorScheme='blue'>
              {t('common.submit')}
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Center>
  );
};
