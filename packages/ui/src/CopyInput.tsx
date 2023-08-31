import React from 'react';
import {
  InputGroup,
  Input,
  Button,
  InputRightElement,
  useTheme,
  useClipboard,
  Box,
  Flex,
} from '@chakra-ui/react';

export interface CopyInputProps {
  value: string;
  size?: 'sm' | 'md' | 'lg';
  buttonLeftIcon?: React.ReactElement;
}

export const CopyInput: React.FC<CopyInputProps> = ({
  value,
  size = 'md',
  buttonLeftIcon,
}) => {
  const { onCopy, hasCopied } = useClipboard(value);
  const theme = useTheme();
  const [buttonWidth, buttonHeight] = {
    lg: ['115px', '46px'],
    md: ['100px', '42px'],
    sm: ['96px', '38px'],
  }[size];

  return (
    <InputGroup width='100%' size={size}>
      <Input
        readOnly
        value={value}
        width='100%'
        textOverflow='ellipsis'
        overflow='hidden'
        paddingRight={buttonWidth}
      />
      <InputRightElement
        borderLeft={`1px solid ${theme.colors.border.input}`}
        width={buttonWidth}
        pr={'1px'}
      >
        <Button
          variant='ghost'
          leftIcon={
            <Flex align='center' fontSize='20px'>
              {buttonLeftIcon}
            </Flex>
          }
          onClick={onCopy}
          borderTopLeftRadius={0}
          borderBottomLeftRadius={0}
          size={size}
          height={buttonHeight}
          width='100%'
          colorScheme='gray'
          bg={theme.colors.white}
          color={theme.colors.gray[700]}
        >
          {hasCopied ? 'Copied' : 'Copy'}
        </Button>
      </InputRightElement>
    </InputGroup>
  );
};
