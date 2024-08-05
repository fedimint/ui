import React from 'react';
import {
  FormControl,
  Flex,
  Text,
  Input,
  Tag,
  Box,
  InputGroup,
  Hide,
  Show,
} from '@chakra-ui/react';
import { Table } from '@fedimint/ui';
import { useTranslation } from '@fedimint/utils';
import { ReactComponent as CheckCircleIcon } from '../../../../assets/svgs/check-circle.svg';
import { ReactComponent as XCircleIcon } from '../../../../assets/svgs/x-circle.svg';

interface PeerWithHash {
  id: string;
  peer: {
    name: string;
    cert: string;
  };
  hash: string;
}

interface Props {
  peersWithHash: PeerWithHash[];
  enteredHashes: string[];
  handleChangeHash: (value: string, index: number) => void;
}

export const PeerVerificationTable: React.FC<Props> = ({
  peersWithHash,
  enteredHashes,
  handleChangeHash,
}) => {
  const { t } = useTranslation();

  const tableColumns = [
    {
      key: 'name',
      heading: t('verify-guardians.table-column-name'),
      width: '200px',
    },
    {
      key: 'status',
      heading: t('verify-guardians.table-column-status'),
      width: '160px',
    },
    {
      key: 'hashInput',
      heading: t('verify-guardians.table-column-hash-input'),
    },
  ];

  const tableRows = peersWithHash.map(({ peer, hash }, idx) => {
    const value = enteredHashes[idx] || '';
    const isValid = Boolean(value && value === hash);
    const isError = Boolean(value && !isValid);
    return {
      key: peer.cert,
      name: (
        <Text maxWidth={200} isTruncated>
          {peer.name}
        </Text>
      ),
      status: isValid ? (
        <Tag colorScheme='green'>{t('verify-guardians.verified')}</Tag>
      ) : (
        ''
      ),
      hashInput: (
        <FormControl isInvalid={isError}>
          <Input
            variant='filled'
            value={value}
            placeholder={`${t('verify-guardians.verified-placeholder')}`}
            onChange={(ev) => handleChangeHash(ev.currentTarget.value, idx)}
            readOnly={isValid}
          />
        </FormControl>
      ),
    };
  });

  return (
    <>
      <Hide below='sm'>
        <Table
          title={t('verify-guardians.table-title')}
          description={t('verify-guardians.table-description')}
          columns={tableColumns}
          rows={tableRows}
        />
      </Hide>
      <Show below='sm'>
        <Flex direction='column' width='full' gap={4}>
          {peersWithHash.map(({ peer, hash }, idx) => {
            const value = enteredHashes[idx] || '';
            const isValid = value === hash;
            const isError = value && !isValid;

            return (
              <Box key={peer.cert}>
                <Flex align='center' mb={2}>
                  <Text fontWeight='bold' isTruncated>
                    {peer.name}
                  </Text>
                  {isValid ? (
                    <CheckCircleIcon
                      color='green'
                      style={{
                        marginLeft: '8px',
                        height: '1em',
                        width: '1em',
                      }}
                    />
                  ) : isError ? (
                    <XCircleIcon
                      color='red'
                      style={{
                        marginLeft: '8px',
                        height: '1em',
                        width: '1em',
                      }}
                    />
                  ) : null}
                </Flex>

                <Flex direction='row' align='center' justify='start'>
                  <FormControl>
                    <InputGroup>
                      <Input
                        variant='filled'
                        borderColor={'gray.100'}
                        value={value}
                        placeholder={`${t(
                          'verify-guardians.verified-placeholder'
                        )}`}
                        onChange={(ev) =>
                          handleChangeHash(ev.currentTarget.value, idx)
                        }
                        readOnly={isValid}
                      />
                    </InputGroup>
                  </FormControl>
                </Flex>
              </Box>
            );
          })}
        </Flex>
      </Show>
    </>
  );
};
