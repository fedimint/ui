export function bftHonest(totalGuardians: number): number {
  return totalGuardians - bftFaulty(totalGuardians);
}

export function bftFaulty(totalGuardians: number): number {
  return Math.floor((totalGuardians - 1) / 3);
}

export const generateSimpleHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).slice(0, 6); // Convert to hex and take the first 6 characters
};
