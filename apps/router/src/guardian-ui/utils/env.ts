import { sha256Hash } from '@fedimint/utils';
import { GuardianConfig } from '../../types/guardian';

export async function getEnv(): Promise<GuardianConfig> {
  const response = await fetch('config.json');
  if (!response.ok) {
    throw new Error('Could not find config.json');
  }

  const { baseUrl } = await response.json();

  if (!baseUrl || baseUrl === 'config api not set') {
    throw new Error('Config API not set in config.json');
  }

  const id = await sha256Hash(baseUrl);

  const serviceConfig: GuardianConfig = {
    id,
    config: {
      baseUrl,
    },
  };

  return serviceConfig;
}
