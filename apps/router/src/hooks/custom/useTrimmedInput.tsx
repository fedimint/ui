import { useState, useCallback } from 'react';

const cleanInput = (value: string | undefined) => value?.trim() ?? '';

export const useTrimmedInput = (initialValue = '') => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (newValue: string) => {
    setValue(cleanInput(newValue));
  };

  return [value, handleChange] as const;
};

export const useTrimmedInputArray = (initialValues: string[]) => {
  const [values, setValues] = useState<string[]>(initialValues);

  const handleChange = useCallback((index: number, newValue: string) => {
    setValues((prev) => {
      const newValues = [...prev];
      newValues[index] = cleanInput(newValue);
      return newValues;
    });
  }, []);

  return { values, handleChange };
};
