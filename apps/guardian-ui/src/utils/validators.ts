export const isValidNumber = (value: string) => {
  const int = parseInt(value, 10);
  return int && !Number.isNaN(int);
};
