import { MSats } from '@fedimint/types';

/**
 * Given a string, turn it into an "ellipsis sandwich" with the start and
 * end showing. If the text is shorter than it would be with an ellipsis,
 * the full string is returned instead.
 */
export function formatEllipsized(text: string, size = 6) {
  if (text.length <= size * 2 + 3) {
    return text;
  }
  return `${text.substring(0, size)}...${text.substring(text.length - size)}`;
}

/**
 * Given some number of msats, return a formatted string in the format of
 * 0.0000000 or 1,234,5678.9000000
 */
export function formatMsatsToBtc(msats: MSats): string {
  return Intl.NumberFormat(undefined, {
    style: 'decimal',
    minimumFractionDigits: 8,
  }).format(msats / 1_00_000_000_000);
}

export const formatValue = (
  value: MSats,
  unit: 'msats' | 'sats' | 'btc',
  withUnit = false
) => {
  switch (unit) {
    case 'msats':
      return withUnit ? `${value.toString()} msats` : value.toString();
    case 'sats':
      return withUnit
        ? `${(value / 1000).toFixed(0)} sats`
        : (value / 1000).toFixed(0);
    case 'btc':
      return withUnit
        ? `${formatMsatsToBtc(value)} BTC`
        : formatMsatsToBtc(value);
    default:
      return value.toString();
  }
};
