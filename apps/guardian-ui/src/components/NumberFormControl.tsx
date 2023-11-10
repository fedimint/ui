import React from 'react';
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
  Text,
} from '@chakra-ui/react';
import { isValidNumber } from '../utils/validators';
import { useTranslation } from '@fedimint/utils';

interface NumberFormControlProps extends NumberInputProps {
  labelText: string;
  errorText?: string;
  recommendedMin?: number;
  warningText?: string;
  helperText: string;
}

export const NumberFormControl = React.memo<NumberFormControlProps>(
  function NumInput({
    labelText,
    errorText,
    helperText,
    recommendedMin,
    warningText,
    min,
    max,
    value,
    onChange,
  }: NumberFormControlProps) {
    const { t } = useTranslation();

    const onValueChange = (value: string) => {
      onChange && onChange(value, Number(value));
    };

    const showWarning =
      value && recommendedMin && Number(value) < recommendedMin;

    const isValid = isValidNumber(value?.toString() || '', min, max);
    if (!isValid && !errorText) {
      if (typeof min !== 'undefined' && typeof max !== 'undefined') {
        errorText = t('set-config.error-valid-min-max', { min, max });
      } else if (typeof min !== 'undefined') {
        errorText = t('set-config.error-valid-min', { min });
      } else if (typeof max !== 'undefined') {
        errorText = t('set-config.error-valid-max', { max });
      } else {
        errorText = t('set-config.error-valid-number');
      }
    }

    return (
      <FormControl isInvalid={!isValid}>
        <FormLabel>{labelText}</FormLabel>
        <NumberInput min={min} max={max} value={value} onChange={onValueChange}>
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <FormErrorMessage>{errorText}</FormErrorMessage>
        {showWarning ? (
          <FormHelperText color='yellow.500'>{warningText}</FormHelperText>
        ) : (
          <FormHelperText>{helperText}</FormHelperText>
        )}
      </FormControl>
    );
  }
);
