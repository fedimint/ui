import React from 'react';
import { Button } from '@chakra-ui/react';

export const CreateButton: React.FC<{
  onClick: () => void;
  label: string;
  isLoading?: boolean;
  isDisabled?: boolean;
}> = ({ onClick, label, isLoading, isDisabled }) => (
  <Button
    onClick={onClick}
    size='lg'
    width='100%'
    isLoading={isLoading}
    isDisabled={isDisabled}
  >
    {label}
  </Button>
);
