export async function getEnv() {
  const baseUrlResponse = await fetch('config.json');
  if (!baseUrlResponse.ok) {
    throw new Error('Could not find config.json');
  }
  const baseUrl = await baseUrlResponse.json();
  if (baseUrl === 'config api not set' || !baseUrl) {
    throw new Error('Config API not set in config.json');
  }
  return baseUrl;
}
