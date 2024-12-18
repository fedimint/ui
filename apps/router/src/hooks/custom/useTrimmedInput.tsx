import { useState } from 'react';

const cleanInput = (value: string) => value.trim();

export const useTrimmedInput = (initialValue: string) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (newValue: string) => {
    setValue(cleanInput(newValue));
  };

  return [value, handleChange] as const;
};

export const useTrimmedInputArray = (initialValues: string[]) => {
  const [values, setValues] = useState<string[]>(initialValues);

  const handleChange = (index: number, newValue: string) => {
    setValues((prev) => {
      const newValues = [...prev];
      newValues[index] = cleanInput(newValue);
      return newValues;
    });
  };

  const setAllValues = (newValues: string[]) => {
    setValues(newValues.map(cleanInput));
  };

  return [values, handleChange, setAllValues] as const;
};
