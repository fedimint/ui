import { MetaConfig, MetaFields } from '@fedimint/types';

export const metaToFields = (meta: MetaConfig): MetaFields => {
  return Object.entries(meta).map(([key, value]) => [key, value ?? '']);
};

export const fieldsToMeta = (fields: MetaFields): MetaConfig => {
  return Object.fromEntries(fields);
};

export const metaToHex = (meta: MetaConfig): string => {
  const str = JSON.stringify(meta);
  let hex = '';
  for (let i = 0; i < str.length; i++) {
    hex += '' + str.charCodeAt(i).toString(16);
  }
  return hex;
};

export const hexToMeta = (hex: string): MetaConfig => {
  let str = '';
  for (let i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return JSON.parse(str);
};
