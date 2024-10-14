import React, { useCallback, useEffect, useState } from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { MetaInput } from './MetaInput';
import { ParsedConsensusMeta } from '@fedimint/types';

interface RequiredMetaProps {
  consensusMeta?: ParsedConsensusMeta;
  onValidityChange: (isValid: boolean) => void;
  onRequiredMetaChange: (requiredMeta: Record<string, string>) => void;
}

export const RequiredMeta: React.FC<RequiredMetaProps> = ({
  consensusMeta,
  onValidityChange,
  onRequiredMetaChange,
}) => {
  const [requiredMeta, setRequiredMeta] = useState<Record<string, string>>({
    federation_name: '',
    welcome_message: '',
    federation_icon_url: '',
  });

  useEffect(() => {
    if (consensusMeta?.value) {
      const metaObj = Object.fromEntries(consensusMeta.value);
      const {
        federation_name = '',
        welcome_message = '',
        federation_icon_url = '',
      } = metaObj;

      setRequiredMeta({
        federation_name,
        welcome_message,
        federation_icon_url,
      });
    }
  }, [consensusMeta]);

  const isAnyRequiredFieldEmpty = useCallback(() => {
    return Object.values(requiredMeta).some((value) => value.trim() === '');
  }, [requiredMeta]);

  useEffect(() => {
    onValidityChange(!isAnyRequiredFieldEmpty());
    onRequiredMetaChange(requiredMeta);
  }, [
    requiredMeta,
    isAnyRequiredFieldEmpty,
    onValidityChange,
    onRequiredMetaChange,
  ]);

  const handleChange = (key: string, value: string) => {
    setRequiredMeta((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Flex flexDirection='column' gap={4}>
      <Text fontSize='lg' fontWeight='bold'>
        Required Meta Fields
      </Text>
      {Object.entries(requiredMeta).map(([key, value]) => (
        <MetaInput
          key={key}
          metaKey={key}
          value={value}
          onChange={handleChange}
        />
      ))}
    </Flex>
  );
};
