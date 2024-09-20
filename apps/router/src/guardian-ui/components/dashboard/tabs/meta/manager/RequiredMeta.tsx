import React, { useState, useEffect } from 'react';
import { Flex } from '@chakra-ui/react';
import { MetaInput } from './MetaInput';

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
        <MetaInput
          key={key}
          metaKey={key}
          value={value}
          onChange={handleChange}
          isIconValid={isIconValid}
          iconPreview={iconPreview}
        />
      ))}
    </Flex>
  );
};
