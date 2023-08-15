import React, { useState } from 'react';
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  NumberInputProps,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
} from '@chakra-ui/react';
import { isValidNumber } from '../utils/validators';

interface NumberFormControlProps extends NumberInputProps {
  labelText: string;
  errorText: string;
  helperText: string;
}

export const NumberFormControl = React.memo<NumberFormControlProps>(
  function NumInput({
    labelText,
    errorText,
    helperText,
    min,
    max,
    value,
    onChange,
  }: NumberFormControlProps) {
    const [invalid, setInvalid] = useState(false);

    const onValueChange = (value: string) => {
      setInvalid(!isValidNumber(value));
      onChange && onChange(value, Number(value));
    };

    return (
      <FormControl isInvalid={invalid}>
        <FormLabel>{labelText}</FormLabel>
        <NumberInput min={min} max={max} value={value} onChange={onValueChange}>
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <FormErrorMessage>{errorText}</FormErrorMessage>
        <FormHelperText>{helperText}</FormHelperText>
      </FormControl>
    );
  }
);
