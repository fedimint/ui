import React from 'react';
import { Box, Flex, Image } from '@chakra-ui/react';

interface IconPreviewProps {
  imageUrl: string;
  isValid: boolean;
}

export const IconPreview: React.FC<IconPreviewProps> = ({
  imageUrl,
  isValid,
}) => (
  <Box
    width='40px'
    height='40px'
    borderRadius='md'
    overflow='hidden'
    bg='gray.100'
    display='flex'
    alignItems='center'
    justifyContent='center'
    boxShadow='sm'
    flexShrink={0}
  >
    {isValid && imageUrl ? (
      <Image
        src={imageUrl}
        alt='Icon'
        objectFit='cover'
        width='100%'
        height='100%'
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
  </Box>
);
