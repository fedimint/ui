import React from 'react';
import { Text, useTheme } from '@chakra-ui/react';

interface ErrorMessageProps {
  error: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  const theme = useTheme();

  if (!error) return null;

  return (
    <Text fontSize='md' color={theme.colors.red} fontFamily={theme.fonts.body}>
      {error}
    </Text>
  );
};
