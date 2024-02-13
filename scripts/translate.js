const fs = require('fs/promises');
const { translate } = require('@vitalets/google-translate-api');
const path = require('path');

const srcPaths = [
  'apps/gateway-ui/src/languages',
  'apps/guardian-ui/src/languages',
];

// Get languages from command line arguments, excluding the first two default arguments (node path and script path)
const languages = process.argv.slice(2)[0].split(' ');

async function translateAndFill() {
  try {
    for (const srcPath of srcPaths) {
      const srcFile = `${srcPath}/en.json`;
      const srcData = JSON.parse(await fs.readFile(srcFile, 'utf8'));

      for (const lang of languages) {
        const targetFile = path.join(srcPath, `${lang}.json`);
        let targetData = {};
        try {
          targetData = JSON.parse(await fs.readFile(targetFile, 'utf8'));
        } catch (error) {
          console.log(`Creating new file for language: ${lang}`);
        }
        await fillMissingKeys(srcData, targetData, lang, '', targetFile);
        console.log(`Updated/created file for language: ${lang}`);
      }
    }
  } catch (error) {
    console.error('Error processing translation:', error);
  }
}

async function fillMissingKeys(srcObj, targetObj, lang, path = '', targetFile) {
  for (const key in srcObj) {
    const newPath = path ? `${path}.${key}` : key;

    if (typeof srcObj[key] === 'object' && srcObj[key] !== null) {
      targetObj[key] = targetObj[key] || {};
      await fillMissingKeys(
        srcObj[key],
        targetObj[key],
        lang,
        newPath,
        targetFile
      );
    } else if (targetObj[key] === undefined) {
      console.log(`Translating and adding missing key: ${newPath}`);
      try {
        const translation = await translate(srcObj[key], { to: lang });
        targetObj[key] = translation.text;
        // Write the updated data back to the file after each translation
        await fs.writeFile(
          targetFile,
          JSON.stringify(targetObj, null, 2),
          'utf8'
        );
        // Introduce a delay between requests to avoid hitting the rate limit
        await delay(1000);
      } catch (error) {
        console.error(`Error translating key: ${newPath}`, error);
        if (error.message.includes('Too Many Requests')) {
          console.log('Hit rate limit, delaying further requests...');
          await delay(3000);
        }
      }
    }
  }
  return targetObj;
}

// Utility function to introduce a delay
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

translateAndFill();
