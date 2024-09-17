import React, { useState, useEffect } from 'react';
import { Flex, FormLabel, Input, Image } from '@chakra-ui/react';
import { snakeToTitleCase } from '@fedimint/utils';

interface RequiredMetaProps {
  requiredMeta: Record<string, string>;
  setRequiredMeta: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  isValid: boolean;
  setIsValid: React.Dispatch<React.SetStateAction<boolean>>;
}

export const RequiredMeta: React.FC<RequiredMetaProps> = ({
  requiredMeta,
  setRequiredMeta,
  setIsValid,
}) => {
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [isIconValid, setIsIconValid] = useState<boolean>(true);

  useEffect(() => {
    let objectURL: string | null = null;

    const validateIcon = async (url: string) => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const blob = await response.blob();
        if (!blob.type.startsWith('image/')) {
          throw new Error('Invalid image format');
        }
        objectURL = URL.createObjectURL(blob);
        setIconPreview(objectURL);
        setIsIconValid(true);
      } catch (error) {
        setIconPreview(null);
        setIsIconValid(false);
        if (error instanceof Error) {
          console.error(`Icon validation failed: ${error.message}`);
        }
      }
    };

    if (requiredMeta.federation_icon_url) {
      validateIcon(requiredMeta.federation_icon_url);
    } else {
      setIconPreview(null);
      setIsIconValid(true);
    }

    return () => {
      if (objectURL) {
        URL.revokeObjectURL(objectURL);
      }
    };
  }, [requiredMeta.federation_icon_url]);

  useEffect(() => {
    setIsValid(isIconValid);
  }, [isIconValid, setIsValid]);

  const handleChange = (key: string, value: string) => {
    setRequiredMeta((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Flex flexDirection='column' gap={4}>
      {Object.entries(requiredMeta).map(([key, value]) => (
        <Flex key={key} alignItems='center'>
          <Flex flexDirection='column' flex={1}>
            <FormLabel fontWeight='bold' mb={1}>
              {snakeToTitleCase(key)}
            </FormLabel>
            <Flex alignItems='center'>
              <Input
                type={
                  key === 'popup_end_timestamp'
                    ? 'datetime-local'
                    : key === 'federation_icon_url'
                    ? 'url'
                    : 'text'
                }
                value={value}
                onChange={(e) => handleChange(key, e.target.value)}
                borderColor={
                  (['federation_name', 'welcome_message'].includes(key) &&
                    value.trim() === '') ||
                  (key === 'federation_icon_url' && !isIconValid)
                    ? 'yellow.400'
                    : 'inherit'
                }
              />
              {key === 'federation_icon_url' && (
                <Flex
                  ml={2}
                  alignItems='center'
                  justifyContent='center'
                  width='36px'
                  height='36px'
                  borderRadius='full'
                  overflow='hidden'
                  boxShadow='sm'
                  bg='gray.100'
                  flexShrink={0}
                >
                  {iconPreview ? (
                    <Image
                      src={iconPreview}
                      alt='Federation Icon'
                      width='100%'
                      height='100%'
                      objectFit='cover'
                    />
                  ) : (
                    <Flex
                      width='100%'
                      height='100%'
                      alignItems='center'
                      justifyContent='center'
                      fontSize='md'
                      fontWeight='bold'
                      color='gray.400'
                    >
                      ?
                    </Flex>
                  )}
                </Flex>
              )}
            </Flex>
          </Flex>
        </Flex>
      ))}
    </Flex>
  );
};
