const fs = require('fs/promises');
const path = require('path');
const { execSync } = require('child_process');

const languages = [
  'ca',
  'de',
  'es',
  'fr',
  'hu',
  'it',
  'ja',
  'ko',
  'pt',
  'pt',
  'ru',
  'zh',
];

let srcPaths = [];
const targetFile = process.argv[2];
switch (targetFile) {
  case 'gateway':
    srcPaths = ['apps/gateway-ui/src/languages'];
    break;
  case 'guardian':
    srcPaths = ['apps/guardian-ui/src/languages'];
    break;
  default:
    srcPaths = [
      'apps/gateway-ui/src/languages',
      'apps/guardian-ui/src/languages',
    ];
}
const targetKey = process.argv[3];

async function installOpenAI() {
  console.log('Installing OpenAI package...');
  execSync('yarn add openai --ignore-workspace-root-check', {
    stdio: 'inherit',
  });
}

async function uninstallOpenAI() {
  console.log('Uninstalling OpenAI package...');
  execSync('yarn remove openai --ignore-workspace-root-check', {
    stdio: 'inherit',
  });
}

async function translateAndFill(openaiInstance) {
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

        let dataToTranslate = srcData;
        let existingTranslations = targetData;

        if (targetKey) {
          dataToTranslate = getNestedValue(srcData, targetKey);
          existingTranslations = getNestedValue(targetData, targetKey) || {};
          if (!dataToTranslate) {
            console.error(`Key "${targetKey}" not found in source file.`);
            continue;
          }
        }

        const updatedData = await fillMissingKeys(
          dataToTranslate,
          existingTranslations,
          lang,
          targetKey || '',
          openaiInstance
        );

        if (targetKey) {
          setNestedValue(targetData, targetKey, updatedData);
        } else {
          Object.assign(targetData, updatedData);
        }

        await fs.writeFile(
          targetFile,
          JSON.stringify(targetData, null, 2),
          'utf8'
        );
        console.log(`Updated/created file for language: ${lang}`);
      }
    }
  } catch (error) {
    console.error('Error processing translation:', error);
  }
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current && current[key], obj);
}

function setNestedValue(obj, path, value) {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const lastObj = keys.reduce(
    (current, key) => (current[key] = current[key] || {}),
    obj
  );
  lastObj[lastKey] = value;
}

async function fillMissingKeys(
  srcObj,
  targetObj,
  lang,
  path = '',
  openaiInstance
) {
  const updatedObj = { ...targetObj };
  for (const key in srcObj) {
    const newPath = path ? `${path}.${key}` : key;

    if (typeof srcObj[key] === 'object' && srcObj[key] !== null) {
      if (!updatedObj[key] || typeof updatedObj[key] !== 'object') {
        updatedObj[key] = {};
      }
      updatedObj[key] = await fillMissingKeys(
        srcObj[key],
        updatedObj[key],
        lang,
        newPath
      );
    } else if (updatedObj[key] === undefined) {
      console.log(`Translating and adding missing key: ${newPath}`);
      await retryWithExponentialBackoff(async () => {
        const translation = await translateWithOpenAI(
          srcObj[key],
          lang,
          openaiInstance
        );
        updatedObj[key] = translation;
      });
    } else {
      console.log(`Skipping key: ${newPath}`);
    }
  }

  return updatedObj;
}

async function translateWithOpenAI(text, targetLang, openaiInstance) {
  const prompt = `Translate the following text to ${targetLang}. Return only the translated string, without any additional text or explanations:\n\n${text}`;

  const response = await openaiInstance.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    max_tokens: 150,
    stream: false,
  });

  if (
    response &&
    response?.choices &&
    response.choices.length > 0 &&
    response.choices[0].message
  ) {
    return response.choices[0].message.content
      .trim()
      .replace(/^["']|["']$/g, '');
  } else {
    throw new Error('Unexpected response format from OpenAI API');
  }
}

async function retryWithExponentialBackoff(
  operation,
  maxRetries = 100,
  baseDelay = 1000
) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await operation();
      return;
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error.message);
      if (attempt === maxRetries) {
        throw error;
      }
      const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000;
      console.log(`Retrying in ${Math.round(delay / 1000)} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

async function main() {
  try {
    await installOpenAI();
    const { default: OpenAI } = await import('openai');
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    await translateAndFill(openai);
  } finally {
    await uninstallOpenAI();
  }
}

main();
