import { GuardianConfig } from '../../types/guardian';

export async function getEnv() {
  const response = await fetch('config.json');
  if (!response.ok) {
    throw new Error('Could not find config.json');
  }
  const config: GuardianConfig = await response.json();
  if (config.baseUrl === 'config api not set' || !config.baseUrl) {
    throw new Error('Config API not set in config.json');
  }
  return config;
}
