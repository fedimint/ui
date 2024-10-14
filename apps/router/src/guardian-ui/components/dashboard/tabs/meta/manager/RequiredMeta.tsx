import React from 'react';
import { Flex } from '@chakra-ui/react';
import { MetaInput } from './MetaInput';
import { SitesInput } from './SitesInput';

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
        if (key === 'sites') {
          return (
            <SitesInput
              key={key}
              value={value}
              onChange={(newValue) => handleChange(key, newValue)}
            />
          );
        }
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
