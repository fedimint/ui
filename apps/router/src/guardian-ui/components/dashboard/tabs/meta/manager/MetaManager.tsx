import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  Flex,
  FormLabel,
  Input,
  Link,
  Text,
  IconButton,
} from '@chakra-ui/react';
import { fieldsToMeta, metaToHex, useTranslation } from '@fedimint/utils';
import { ParsedConsensusMeta } from '@fedimint/types';
import { DEFAULT_META_KEY } from '../../FederationTabsCard';
import { RequiredMeta } from './RequiredMeta';
import { useGuardianAdminApi } from '../../../../../../context/hooks';
import { ModuleRpc } from '../../../../../../types/guardian';
import { FiX } from 'react-icons/fi';

const metaArrayToObject = (
  metaArray: [string, string][]
): Record<string, string> => {
  return metaArray.reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);
};

interface MetaManagerProps {
  metaModuleId?: string;
  consensusMeta?: ParsedConsensusMeta;
  setActiveTab: (tab: number) => void;
}

export const MetaManager = React.memo(function MetaManager({
  metaModuleId,
  consensusMeta,
  setActiveTab,
}: MetaManagerProps): JSX.Element {
  const { t } = useTranslation();
  const api = useGuardianAdminApi();
  const [requiredMeta, setRequiredMeta] = useState<Record<string, string>>({
    federation_name: '',
    welcome_message: '',
    federation_icon_url: '',
    sites: '',
  });
  const [isRequiredMetaValid, setIsRequiredMetaValid] = useState(true);
  const [optionalMeta, setOptionalMeta] = useState<Record<string, string>>({});

  useEffect(() => {
    if (consensusMeta?.value) {
      const metaObj = metaArrayToObject(consensusMeta.value);
      const {
        federation_name,
        welcome_message,
        federation_icon_url,
        sites,
        ...rest
      } = metaObj;
      setRequiredMeta({
        federation_name,
        welcome_message,
        federation_icon_url,
        sites: sites || '[]',
      });
      setOptionalMeta(rest);
    }
  }, [consensusMeta]);

  const isAnyRequiredFieldEmpty = useCallback(() => {
    return [
      'federation_name',
      'welcome_message',
      'federation_icon_url',
      'sites',
    ].some((key) => requiredMeta[key].trim() === '');
  }, [requiredMeta]);

  const isMetaUnchanged = useCallback(() => {
    if (!consensusMeta?.value) return false;
    const consensusMetaObj = metaArrayToObject(consensusMeta.value);

    // Check if all current fields (required and optional) match the consensus meta
    const allCurrentFields = { ...requiredMeta, ...optionalMeta };
    const currentUnchanged = Object.entries(allCurrentFields).every(
      ([key, value]) => consensusMetaObj[key] === value
    );

    // Check if any fields from consensus meta are missing in the current fields
    const noFieldsRemoved = Object.keys(consensusMetaObj).every(
      (key) => key in allCurrentFields
    );

    return currentUnchanged && noFieldsRemoved;
  }, [requiredMeta, optionalMeta, consensusMeta]);

  const canSubmit = useCallback(() => {
    return (
      !isAnyRequiredFieldEmpty() && isRequiredMetaValid && !isMetaUnchanged()
    );
  }, [isAnyRequiredFieldEmpty, isRequiredMetaValid, isMetaUnchanged]);

  const resetToConsensus = useCallback(() => {
    if (consensusMeta?.value) {
      const metaObj = metaArrayToObject(consensusMeta.value);
      const {
        federation_name,
        welcome_message,
        federation_icon_url,
        sites,
        ...rest
      } = metaObj;
      setRequiredMeta({
        federation_name,
        welcome_message,
        federation_icon_url,
        sites: sites,
      });
      setOptionalMeta(rest);
    }
  }, [consensusMeta]);

  const handleOptionalMetaChange = (
    oldKey: string,
    newKey: string,
    value: string
  ) => {
    setOptionalMeta((prev) => {
      const newMeta = { ...prev };
      if (oldKey !== newKey) {
        delete newMeta[oldKey];
      }
      newMeta[newKey] = value;
      return newMeta;
    });
  };

  const addCustomField = () => {
    const timestamp = Date.now();
    const newKey = `custom_field_${timestamp}`;
    setOptionalMeta((prev) => ({ ...prev, [newKey]: '' }));
  };

  const removeCustomField = (key: string) => {
    setOptionalMeta((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  };

  const proposeMetaEdits = useCallback(() => {
    if (metaModuleId === undefined || isAnyRequiredFieldEmpty()) return;
    const updatedMetaArray = Object.entries({
      ...requiredMeta,
      ...optionalMeta,
    });
    api
      .moduleApiCall<{ metaValue: string }[]>(
        Number(metaModuleId),
        ModuleRpc.submitMeta,
        {
          key: DEFAULT_META_KEY,
          value: metaToHex(fieldsToMeta(updatedMetaArray)),
        }
      )
      .then(() => {
        setActiveTab(3);
      })
      .catch((error) => {
        console.error(error);
        alert('Failed to propose meta edits. Please try again.');
      });
  }, [
    api,
    metaModuleId,
    requiredMeta,
    optionalMeta,
    isAnyRequiredFieldEmpty,
    setActiveTab,
  ]);

  return (
    <Flex flexDirection='column' gap={6}>
      <Text fontSize='xl' fontWeight='bold'>
        {t('federation-dashboard.config.manage-meta.header')}
      </Text>
      <Box display='inline-block'>
        <Text fontSize='md'>
          {t('federation-dashboard.config.manage-meta.description')}
        </Text>
        <Link
          href='https://github.com/fedimint/fedimint/tree/master/docs/meta_fields'
          color='blue.500'
          isExternal
          _hover={{ textDecoration: 'underline' }}
        >
          {t('federation-dashboard.config.manage-meta.learn-more')}
        </Link>
      </Box>

      <Divider />
      <RequiredMeta
        requiredMeta={requiredMeta}
        setRequiredMeta={setRequiredMeta}
        isValid={isRequiredMetaValid}
        setIsValid={setIsRequiredMetaValid}
      />
      <Flex flexDirection='column' gap={4}>
        {Object.entries(optionalMeta).map(([key, value]) => (
          <Flex key={key} alignItems='center' gap={2}>
            <Flex
              flex={1}
              alignItems='center'
              gap={2}
              p={2}
              borderWidth={1}
              borderRadius='md'
            >
              <Flex direction='column' flex={1}>
                <FormLabel htmlFor={`key-${key}`} fontSize='xs' mb={0}>
                  Key
                </FormLabel>
                <Input
                  id={`key-${key}`}
                  defaultValue={key}
                  onBlur={(e) =>
                    handleOptionalMetaChange(key, e.target.value, value)
                  }
                  size='sm'
                />
              </Flex>
              <Flex direction='column' flex={1}>
                <FormLabel htmlFor={`value-${key}`} fontSize='xs' mb={0}>
                  Value
                </FormLabel>
                <Input
                  id={`value-${key}`}
                  value={value}
                  onChange={(e) =>
                    handleOptionalMetaChange(key, key, e.target.value)
                  }
                  size='sm'
                />
              </Flex>
            </Flex>
            <IconButton
              aria-label='Remove custom field'
              icon={<FiX />}
              size='sm'
              fontSize='xl'
              color='red.500'
              variant='ghost'
              onClick={() => removeCustomField(key)}
              minWidth='auto'
              height='auto'
              padding={1}
            />
          </Flex>
        ))}
      </Flex>
      <Flex gap={4}>
        <Button
          colorScheme='blue'
          onClick={proposeMetaEdits}
          isDisabled={!canSubmit()}
        >
          {t('federation-dashboard.config.manage-meta.propose-new-meta-button')}
        </Button>
        {consensusMeta?.value && !isMetaUnchanged() && (
          <Button onClick={resetToConsensus}>
            {t(
              'federation-dashboard.config.manage-meta.reset-to-consensus-button'
            )}
          </Button>
        )}
        <Button onClick={addCustomField} variant='outline'>
          {t('federation-dashboard.config.manage-meta.add-custom-field-button')}
        </Button>
      </Flex>
    </Flex>
  );
});
