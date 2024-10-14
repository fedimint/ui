import React, { useState, useEffect, useCallback } from 'react';
import { Flex, FormLabel, Input, Button, IconButton } from '@chakra-ui/react';
import { FiX } from 'react-icons/fi';
import { IconPreview } from './IconPreview';

interface Site {
  id: string;
  url: string;
  title: string;
  imageUrl: string;
}

interface SitesInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const SitesInput: React.FC<SitesInputProps> = ({ value, onChange }) => {
  const [sites, setSites] = useState<Site[]>([]);
  const [imageValidities, setImageValidities] = useState<boolean[]>([]);
  const [localImageUrls, setLocalImageUrls] = useState<(string | null)[]>([]);

  useEffect(() => {
    try {
      const parsedSites = JSON.parse(value);
      setSites(Array.isArray(parsedSites) ? parsedSites : []);
      setImageValidities(new Array(parsedSites.length).fill(true));
      setLocalImageUrls(new Array(parsedSites.length).fill(null));
    } catch {
      setSites([]);
      setImageValidities([]);
      setLocalImageUrls([]);
    }
  }, [value]);

  const validateIcon = useCallback(async (url: string, index: number) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      if (!blob.type.startsWith('image/')) {
        throw new Error('Invalid image format');
      }
      const objectURL = URL.createObjectURL(blob);
      setLocalImageUrls((prev) => {
        const newUrls = [...prev];
        newUrls[index] = objectURL;
        return newUrls;
      });
      setImageValidities((prev) => {
        const newValidities = [...prev];
        newValidities[index] = true;
        return newValidities;
      });
      return objectURL;
    } catch (error) {
      setLocalImageUrls((prev) => {
        const newUrls = [...prev];
        newUrls[index] = null;
        return newUrls;
      });
      setImageValidities((prev) => {
        const newValidities = [...prev];
        newValidities[index] = false;
        return newValidities;
      });
      if (error instanceof Error) {
        console.error(`Icon validation failed: ${error.message}`);
      }
      return null;
    }
  }, []);

  const handleSiteChange = (
    index: number,
    field: keyof Site,
    newValue: string
  ) => {
    const newSites = [...sites];
    newSites[index] = { ...newSites[index], [field]: newValue };
    onChange(JSON.stringify(newSites));

    if (field === 'imageUrl') {
      setImageValidities((prev) => {
        const newValidities = [...prev];
        newValidities[index] = true; // Reset validity when user starts typing
        return newValidities;
      });
      setLocalImageUrls((prev) => {
        const newUrls = [...prev];
        newUrls[index] = null; // Reset local URL when user starts typing
        return newUrls;
      });
    }
  };

  const handleImageUrlBlur = (index: number) => {
    const imageUrl = sites[index].imageUrl;
    if (imageUrl) {
      validateIcon(imageUrl, index);
    }
  };

  const addSite = () => {
    const newSites = [...sites, { id: '', url: '', title: '', imageUrl: '' }];
    onChange(JSON.stringify(newSites));
  };

  const removeSite = (index: number) => {
    const newSites = sites.filter((_, i) => i !== index);
    onChange(JSON.stringify(newSites));
  };

  return (
    <Flex flexDirection='column'>
      <Flex alignItems='center' mb={2} justifyContent='space-between'>
        <FormLabel fontWeight='bold' mb={0} mr={2}>
          Sites
        </FormLabel>
        <Button
          size='sm'
          onClick={addSite}
          px={2}
          minW='auto'
          variant='outline'
        >
          Add Site
        </Button>
      </Flex>
      {sites.length > 0 && (
        <Flex flexDirection='column' gap={2}>
          {sites.map((site, index) => (
            <Flex key={index} alignItems='center' gap={2}>
              <Flex
                flex={1}
                alignItems='center'
                gap={2}
                p={2}
                borderWidth={1}
                borderRadius='md'
              >
                {(Object.keys(site) as Array<keyof Site>).map((field) => (
                  <Flex key={field} direction='column' flex={1}>
                    <FormLabel
                      htmlFor={`${field}-${index}`}
                      fontSize='xs'
                      mb={0}
                    >
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </FormLabel>
                    <Input
                      id={`${field}-${index}`}
                      placeholder={`Enter ${field}`}
                      value={site[field]}
                      onChange={(e) =>
                        handleSiteChange(index, field, e.target.value)
                      }
                      onBlur={() => {
                        if (field === 'imageUrl') {
                          handleImageUrlBlur(index);
                        }
                      }}
                      size='sm'
                      isInvalid={
                        field === 'imageUrl' && !imageValidities[index]
                      }
                    />
                  </Flex>
                ))}
              </Flex>
              <IconPreview
                imageUrl={localImageUrls[index] ?? ''}
                isValid={imageValidities[index]}
              />
              <IconButton
                aria-label='Remove site'
                icon={<FiX />}
                size='sm'
                fontSize='xl'
                color='red.500'
                variant='ghost'
                onClick={() => removeSite(index)}
                minWidth='auto'
                height='auto'
                padding={1}
              />
            </Flex>
          ))}
        </Flex>
      )}
    </Flex>
  );
};
