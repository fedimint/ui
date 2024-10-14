import React, { useState, useCallback, useEffect } from 'react';
import {
  Button,
  Flex,
  FormLabel,
  Input,
  Text,
  IconButton,
} from '@chakra-ui/react';
import { FiX } from 'react-icons/fi';
import { IconPreview } from './IconPreview';

interface CustomMetaFieldsProps {
  customMeta: Record<string, string>;
  setCustomMeta: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export const CustomMetaFields: React.FC<CustomMetaFieldsProps> = ({
  customMeta,
  setCustomMeta,
}) => {
  const [iconValidity, setIconValidity] = useState<boolean>(true);
  const [localIconUrl, setLocalIconUrl] = useState<string | null>(null);

  const validateIcon = useCallback(async (url: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const response = await fetch(url, { mode: 'no-cors' });
      setLocalIconUrl(url);
      setIconValidity(true);
      return url;
    } catch (error) {
      setLocalIconUrl(null);
      setIconValidity(false);
      return null;
    }
  }, []);

  useEffect(() => {
    if (customMeta['federation_icon_url']) {
      validateIcon(customMeta['federation_icon_url']);
    }
  }, [customMeta, validateIcon]);

  const handleMetaChange = (oldKey: string, newKey: string, value: string) => {
    setCustomMeta((prev) => {
      const newMeta = { ...prev };
      if (oldKey !== newKey) {
        delete newMeta[oldKey];
      }
      newMeta[newKey] = value;
      return newMeta;
    });

    if (newKey === 'federation_icon_url') {
      setIconValidity(true);
      setLocalIconUrl(null);
    }
  };

  const handleIconUrlBlur = () => {
    const iconUrl = customMeta['federation_icon_url'];
    if (iconUrl) {
      validateIcon(iconUrl);
    }
  };

  const addCustomField = () => {
    const newKey = `custom_${Object.keys(customMeta).length + 1}`;
    setCustomMeta((prev) => ({ ...prev, [newKey]: '' }));
  };

  const removeCustomField = (key: string) => {
    setCustomMeta((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  };

  return (
    <>
      <Flex justifyContent='space-between' alignItems='center'>
        <Text fontSize='lg' fontWeight='bold'>
          Meta Fields
        </Text>
        <Button onClick={addCustomField} size='sm' variant='outline'>
          Add Field
        </Button>
      </Flex>
      <Flex flexDirection='column' gap={4}>
        {Object.entries(customMeta).map(([key, value]) => (
          <Flex key={key} alignItems='center' gap={2}>
            <Flex
              flex={1}
              alignItems='center'
              gap={2}
              p={2}
              borderWidth={1}
              borderRadius='md'
            >
              <Flex direction='column' flex={1} maxWidth='25%'>
                <FormLabel htmlFor={`key-${key}`} fontSize='xs' mb={0}>
                  Key
                </FormLabel>
                <Input
                  id={`key-${key}`}
                  defaultValue={key}
                  onBlur={(e) => handleMetaChange(key, e.target.value, value)}
                  size='sm'
                />
              </Flex>
              <Flex direction='column' flex={3}>
                <FormLabel htmlFor={`value-${key}`} fontSize='xs' mb={0}>
                  Value
                </FormLabel>
                <Input
                  id={`value-${key}`}
                  value={value}
                  onChange={(e) => handleMetaChange(key, key, e.target.value)}
                  onBlur={() => {
                    if (key === 'federation_icon_url') {
                      handleIconUrlBlur();
                    }
                  }}
                  size='sm'
                  isInvalid={key === 'federation_icon_url' && !iconValidity}
                />
              </Flex>
            </Flex>
            {key === 'federation_icon_url' && (
              <IconPreview imageUrl={localIconUrl ?? ''} />
            )}
            <IconButton
              aria-label='Remove field'
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
    </>
  );
};
