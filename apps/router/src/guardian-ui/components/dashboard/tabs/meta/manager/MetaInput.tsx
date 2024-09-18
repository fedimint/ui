import React from 'react';
import { Flex, FormLabel, Input } from '@chakra-ui/react';
import { snakeToTitleCase } from '@fedimint/utils';
import { IconPreview } from '../IconPreview';

interface MetaInputProps {
  metaKey: string;
  value: string;
  onChange: (key: string, value: string) => void;
  isIconValid: boolean;
  iconPreview: string | null;
}

export const MetaInput: React.FC<MetaInputProps> = ({
  metaKey,
  value,
  onChange,
  isIconValid,
  iconPreview,
}) => (
  <Flex alignItems='center'>
    <Flex flexDirection='column' flex={1}>
      <FormLabel fontWeight='bold' mb={1}>
        {snakeToTitleCase(metaKey)}
      </FormLabel>
      <Flex alignItems='center'>
        <Input
          type={
            metaKey === 'popup_end_timestamp'
              ? 'datetime-local'
              : metaKey === 'federation_icon_url'
              ? 'url'
              : 'text'
          }
          value={value}
          onChange={(e) => onChange(metaKey, e.target.value)}
          borderColor={
            (['federation_name', 'welcome_message'].includes(metaKey) &&
              value.trim() === '') ||
            (metaKey === 'federation_icon_url' && !isIconValid)
              ? 'yellow.400'
              : 'inherit'
          }
        />
        {metaKey === 'federation_icon_url' && (
          <IconPreview iconPreview={iconPreview} />
        )}
      </Flex>
    </Flex>
  </Flex>
);
