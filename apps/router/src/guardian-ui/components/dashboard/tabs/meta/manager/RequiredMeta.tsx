import React from 'react';
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
}) => {
  const handleChange = (key: string, value: string) => {
    setRequiredMeta((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Flex flexDirection='column' gap={4}>
      {Object.entries(requiredMeta).map(([key, value]) => {
        return (
          <MetaInput
            key={key}
            metaKey={key}
            value={value}
            onChange={handleChange}
          />
        );
      })}
    </Flex>
  );
};
