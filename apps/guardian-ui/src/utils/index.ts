export function bftHonest(totalGuardians: number): number {
  return totalGuardians - bftFaulty(totalGuardians);
}

export function bftFaulty(totalGuardians: number): number {
  return Math.floor((totalGuardians - 1) / 3);
}
