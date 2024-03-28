import React, { useState, useEffect, useCallback } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useTranslation, hexToMeta } from '@fedimint/utils';
import { MetaFields, MetaSubmissions } from '@fedimint/types';

import { useAdminContext } from '../../hooks';
import { ModuleRpc } from '../../types';
import { Table, TableColumn, TableRow } from '@fedimint/ui';

type MetaSubmissionMap = { [key: string]: { [value: string]: string[] } };
type MetaSubmissionFields = [string, string, string[]][];

interface UpdateMetaFieldsProps {
  metaModuleId: string;
  updateEditedMetaFields: (fields: MetaFields) => void;
  pollTimeout: number;
}

type TableKey = 'metaKey' | 'value' | 'guardians';

export const UpdateMetaFields = React.memo(function UpdateMetaFields({
  metaModuleId,
  pollTimeout,
}: UpdateMetaFieldsProps): JSX.Element {
  const { t } = useTranslation();
  const { api } = useAdminContext();

  const [metaSubmissions, setMetaSubmissions] = useState<MetaSubmissionFields>(
    []
  );

  useEffect(() => {
    const pollSubmissionInterval = setInterval(async () => {
      try {
        const submissions = await api.moduleApiCall<MetaSubmissions>(
          Number(metaModuleId),
          ModuleRpc.getSubmissions,
          0
        );

        const metaMap: MetaSubmissionMap = {};

        Object.entries(submissions).map(([peer, submission]) => {
          const meta = hexToMeta(submission);
          Object.entries(meta).map(([key, value]) => {
            if (value) {
              if (metaMap[key]) {
                if (metaMap[key][value]) {
                  metaMap[key] = { [value]: [...metaMap[key][value], peer] };
                } else {
                  metaMap[key][value] = [peer];
                }
              } else {
                metaMap[key] = { [value]: [peer] };
              }
            }
          });
        });

        const transformed = Object.entries(metaMap).reduce((acc, [k, v]) => {
          Object.entries(v).map(([a, b]) => {
            acc.push([k, a, b]);
          });
          return acc;
        }, [] as MetaSubmissionFields);

        setMetaSubmissions(transformed);
      } catch (err) {
        console.warn('Failed to poll for meta submissions', err);
      }
    }, pollTimeout);
    return () => {
      clearInterval(pollSubmissionInterval);
    };
  }, [api, metaModuleId, pollTimeout]);

  const getMetaTable = useCallback(() => {
    if (!metaSubmissions || metaSubmissions.length === 0) {
      return null;
    }

    const columns: TableColumn<TableKey>[] = [
      {
        key: 'metaKey',
        heading: t('set-config.meta-fields-key'),
      },
      {
        key: 'value',
        heading: t('set-config.meta-fields-value'),
      },
      {
        key: 'guardians',
        heading: t('federation-dashboard.config.manage-meta.peer-reviews'),
      },
    ];

    const rows: TableRow<TableKey>[] = metaSubmissions.map(
      ([key, value, peers], idx) => {
        return {
          key: idx,
          metaKey: <Text size={'md'}>{key}</Text>,
          value: <Text size={'md'}>{value}</Text>,
          guardians: <Text size={'md'}>{peers.join(', ')}</Text>,
        };
      }
    );

    return <Table columns={columns} rows={rows} />;
  }, [t, metaSubmissions]);

  return (
    <Box>
      <Text fontSize='lg'>
        {t('federation-dashboard.config.manage-meta.submitted-meta-label')}
      </Text>
      {metaSubmissions?.length ? (
        <>
          {/* <Flex justify='end' align='center'>
            <IconButton
              variant='ghost'
              size='xs'
              width={'42px'}
              height={'42px'}
              fontSize={12}
              aria-label={t('common.review')}
              colorScheme='blue'
              color={theme.colors.gray[300]}
              _hover={{ color: theme.colors.blue[500] }}
              icon={<CheckIcon height={20} />}
              onClick={() => updateEditedMetaFields([])}
            />
          </Flex> */}
          {getMetaTable()}
        </>
      ) : (
        <Text fontSize='sm'>
          {t(
            'federation-dashboard.config.manage-meta.no-submitted-meta-message'
          )}
        </Text>
      )}
    </Box>
  );
});
