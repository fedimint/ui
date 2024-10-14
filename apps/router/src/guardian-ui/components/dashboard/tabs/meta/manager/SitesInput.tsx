import React, { useState, useEffect } from 'react';
import {
  Flex,
  FormLabel,
  Input,
  Button,
  IconButton,
  Text,
} from '@chakra-ui/react';
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

  useEffect(() => {
    try {
      const parsedSites = JSON.parse(value);
      setSites(Array.isArray(parsedSites) ? parsedSites : []);
    } catch {
      setSites([]);
    }
  }, [value]);

  const handleSiteChange = (
    index: number,
    field: keyof Site,
    newValue: string
  ) => {
    const newSites = sites.map((site, i) =>
      i === index ? { ...site, [field]: newValue } : site
    );
    onChange(JSON.stringify(newSites));
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
      <Flex justifyContent='space-between' alignItems='center' mb={2}>
        <Text fontSize='lg' fontWeight='bold'>
          Sites
        </Text>
        <Button onClick={addSite} size='sm' variant='outline'>
          Add Site
        </Button>
      </Flex>
      {sites.map((site, index) => (
        <Flex key={index} alignItems='center' gap={2} mb={2}>
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
                <FormLabel htmlFor={`${field}-${index}`} fontSize='xs' mb={0}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </FormLabel>
                <Input
                  id={`${field}-${index}`}
                  placeholder={`Enter ${field}`}
                  value={site[field]}
                  onChange={(e) =>
                    handleSiteChange(index, field, e.target.value)
                  }
                  size='sm'
                />
              </Flex>
            ))}
          </Flex>
          <IconPreview imageUrl={site.imageUrl} />
          <IconButton
            aria-label='Remove site'
            icon={<FiX />}
            size='sm'
            color='red.500'
            variant='ghost'
            onClick={() => removeSite(index)}
          />
        </Flex>
      ))}
    </Flex>
  );
};
