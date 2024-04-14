import { GuardianConfig } from '../GuardianApi';

export async function getEnv() {
  const response = await fetch('config.json');
  if (!response.ok) {
    throw new Error('Could not find config.json');
  }
  const config: GuardianConfig = await response.json();
  if (config.fm_config_api === 'config api not set' || !config.fm_config_api) {
    throw new Error('Config API not set in config.json');
  }
  return config;
}
