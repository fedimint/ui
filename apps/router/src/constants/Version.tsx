export const RELEASE_TAG = 'v0.5.0';

export const getVersionInfo = () => {
  return {
    display: RELEASE_TAG,
    url: `https://github.com/fedimint/ui/releases/tag/${RELEASE_TAG}`,
  };
};
