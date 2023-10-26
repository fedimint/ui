export function getEnv() {
  // This is a hack to get around react-scripts inlining environment variable
  // checks. Boolean conditionals get reduced to `!0` and `!1` which breaks
  // environment variable replacements from `replace-react-env.js`.
  // Note that if you actually WANT that inlining, you should use `process.env`
  // directly in your code, NOT `getEnv()`
  // See https://create-react-app.dev/docs/adding-custom-environment-variables/ for more info
  // See https://github.com/fedimint/ui/issues/224 for the long-term fix for configuration
  return JSON.parse(
    JSON.stringify({
      FM_CONFIG_API: process.env.REACT_APP_FM_CONFIG_API,
      TOS: process.env.REACT_APP_TOS,
    })
  );
}
