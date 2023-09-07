export const isValidNumber = (value: string) => {
  const int = parseInt(value, 10);
  return int && !Number.isNaN(int);
};

export const isValidMeta = (meta: [string, string][]) => {
  return meta.every(([key, value]) => key && value);
};
