import React from 'react';
import { Flex, Image } from '@chakra-ui/react';

interface IconPreviewProps {
  iconPreview: string | null;
}

export const IconPreview: React.FC<IconPreviewProps> = ({ iconPreview }) => (
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
);
