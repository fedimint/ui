import { useState } from 'react';

const cleanInput = (value: string) => value.trim();

export const useTrimmedInputArray = (initialValues: string[]) => {
  const [values, setValues] = useState<string[]>(initialValues);

  const handleChange = (index: number, newValue: string) => {
    setValues((prev) => {
      const newValues = [...prev];
      newValues[index] = cleanInput(newValue);
      return newValues;
    });
  };

  return [values, handleChange] as const;
};
