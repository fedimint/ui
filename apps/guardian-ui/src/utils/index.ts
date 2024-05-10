export function bftHonest(totalGuardians: number): number {
  const faultyNodes = Math.floor((totalGuardians - 1) / 3);
  const honestNodes = totalGuardians - faultyNodes;
  return honestNodes;
}

export function bftFaulty(totalGuardians: number): number {
  const faultyNodes = Math.floor((totalGuardians - 1) / 3);
  return faultyNodes;
}
