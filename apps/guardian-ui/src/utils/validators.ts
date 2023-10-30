export const isValidNumber = (value: string, min?: number, max?: number) => {
  const int = parseInt(value, 10);
  if (Number.isNaN(int)) return false;
  if (typeof min === 'number' && int < min) return false;
  if (typeof max === 'number' && int > max) return false;
  return true;
};

export const isValidMeta = (meta: [string, string][]) => {
  return meta.every(([key, value]) => key && value);
};
