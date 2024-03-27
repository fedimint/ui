import React, { useState, useEffect } from 'react';
import { Flex, Input, IconButton, useTheme, Box, Text } from '@chakra-ui/react';
import { useTranslation, metaToFields, hexToMeta } from '@fedimint/utils';
import { MetaFields, MetaSubmissions } from '@fedimint/types';

import { ReactComponent as CheckIcon } from '../../assets/svgs/check-circle.svg';
import { useAdminContext } from '../../hooks';
import { ModuleRpc } from '../../types';

type MetaSubmissionFields = [string, MetaFields][];

interface ReviewMetaFieldProps {
  metaModuleId: string;
  updateEditedMetaFields: (fields: MetaFields) => void;
  pollTimeout: number;
}

export const ReviewMetaField = React.memo(function MetaFieldForm({
  metaModuleId,
  updateEditedMetaFields,
  pollTimeout,
}: ReviewMetaFieldProps): JSX.Element {
  const theme = useTheme();
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
        const metaSubmissions: MetaSubmissionFields = Object.entries(
          submissions
        ).map(([key, value]) => [key, metaToFields(hexToMeta(value))]);
        setMetaSubmissions(metaSubmissions);
      } catch (err) {
        console.warn('Failed to poll for meta submissions', err);
      }
    }, 1000); // poll once per second
    return () => {
      clearInterval(pollSubmissionInterval);
    };
  }, [api, metaModuleId, pollTimeout]);

  return (
    <Box>
      <Text fontSize='lg'>
        {t('federation-dashboard.config.manage-meta.submitted-meta-label')}
      </Text>
      {metaSubmissions.length === 0 && (
        <Text fontSize='sm'>
          {t(
            'federation-dashboard.config.manage-meta.no-submitted-meta-message'
          )}
        </Text>
      )}
      {metaSubmissions.map(([peerId, metaFields]) => {
        return (
          <Flex direction='column' gap={2} key={peerId} pt={2} pb={2}>
            <Flex justify='space-between' align='center'>
              <Text px={2}>{'guardian ' + peerId}</Text>
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
                onClick={() => updateEditedMetaFields(metaFields)}
              />
            </Flex>
            {metaFields.map(([key, value], idx) => {
              return (
                <Flex gap={2} key={idx} align='center'>
                  <Input
                    isDisabled={true}
                    placeholder={t('set-config.meta-fields-key')}
                    value={key}
                  />
                  <Input isDisabled={true} value={value} />
                </Flex>
              );
            })}
          </Flex>
        );
      })}
    </Box>
  );
});
