const fs = require('fs');
const path = require('path');

const GATEWAY_LOCALES_PATH = path.join(
  __dirname,
  '../apps/router/src/gateway-ui/languages'
);
const ROUTER_LOCALES_PATH = path.join(
  __dirname,
  '../apps/router/src/languages'
);

// Get all JSON files from a directory
const getLocaleFiles = (dir) => {
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.json'))
    .map((file) => ({
      name: file,
      path: path.join(dir, file),
    }));
};

// Read and parse JSON file
const readJsonFile = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
};

// Write JSON file
const writeJsonFile = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

// Deep merge two objects
const deepMerge = (target, source) => {
  const output = { ...target };

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (source[key] instanceof Object && key in target) {
        output[key] = deepMerge(target[key], source[key]);
      } else if (
        typeof target[key] === 'string' &&
        typeof source[key] === 'string'
      ) {
        // If both are strings, use the existing value (no-op)
        // output[key] = target[key];
      } else {
        output[key] = source[key];
      }
    }
  }

  return output;
};

// Merge locales
const mergeLocales = () => {
  const gatewayLocales = getLocaleFiles(GATEWAY_LOCALES_PATH);
  const routerLocales = getLocaleFiles(ROUTER_LOCALES_PATH);

  gatewayLocales.forEach((gatewayLocale) => {
    if (gatewayLocale.name === 'index.ts') return;

    const routerLocale = routerLocales.find(
      (rl) => rl.name === gatewayLocale.name
    );
    if (!routerLocale) {
      console.log(`No matching router locale found for ${gatewayLocale.name}`);
      return;
    }

    const gatewayContent = readJsonFile(gatewayLocale.path);
    const routerContent = readJsonFile(routerLocale.path);

    // Deep merge the contents
    const mergedContent = deepMerge(routerContent, gatewayContent);

    writeJsonFile(routerLocale.path, mergedContent);
    console.log(`✅ Merged ${gatewayLocale.name}`);
  });
};

// Run the merge
mergeLocales();
