import React from 'react';
import { Flex, Text, Box } from '@chakra-ui/react';
import { QRCodeSVG } from 'qrcode.react';
import { FiCheck, FiCopy } from 'react-icons/fi';

export const QRCodePanel: React.FC<{ value: string; onCopy: () => void }> = ({
  value,
  onCopy,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Flex
      direction='column'
      alignItems='center'
      justifyContent='center'
      width='100%'
    >
      <QRCodeSVG value={value} size={200} />
      <Flex
        borderWidth={1}
        borderRadius='md'
        p={3}
        bg='gray.50'
        color='gray.600'
        fontSize='sm'
        mt={4}
        width='100%'
        alignItems='center'
        cursor='pointer'
        onClick={handleCopy}
        _hover={{ bg: 'gray.100' }}
        transition='background-color 0.2s'
      >
        <Text
          flex={1}
          pr={2}
          letterSpacing='0.05em'
          lineHeight='1.5'
          overflowWrap='break-word'
          wordBreak='break-all'
        >
          {value}
        </Text>
        <Box ml={2} flexShrink={0}>
          {copied ? <FiCheck /> : <FiCopy />}
        </Box>
      </Flex>
    </Flex>
  );
};
