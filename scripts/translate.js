const fs = require('fs/promises');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');
const https = require('https');

const srcPaths = [
  'apps/gateway-ui/src/languages',
  'apps/guardian-ui/src/languages',
];

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

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

async function getLanguages(srcPath) {
  const files = await fs.readdir(srcPath);
  return files
    .filter((file) => file.endsWith('.json') && file !== 'en.json')
    .map((file) => path.basename(file, '.json'));
}

async function getChangedKeys(commitHash, srcFile) {
  const diffOutput = execSync(`git diff ${commitHash} HEAD -- ${srcFile}`, {
    encoding: 'utf8',
  });
  const changedKeys = new Set();
  const diffLines = diffOutput.split('\n');

  for (const line of diffLines) {
    const match = line.match(/^\+(\s*"([^"]+)":)/);
    if (match) {
      const keyPath = match[2];
      changedKeys.add(keyPath);
    }
  }

  return changedKeys;
}

async function getUserConfirmation(message) {
  return new Promise((resolve) => {
    rl.question(message, (answer) => {
      resolve(answer.toLowerCase() === 'y' || answer === '');
    });
  });
}

async function translateAndFill(commitHash) {
  const { OpenAI } = require('openai');

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  try {
    for (const srcPath of srcPaths) {
      const srcFile = `${srcPath}/en.json`;
      const srcData = JSON.parse(await fs.readFile(srcFile, 'utf8'));
      const changedKeys = await getChangedKeys(commitHash, srcFile);
      const languages = await getLanguages(srcPath);

      console.log(`\nChanged keys for ${srcPath}:`);
      changedKeys.forEach((key) => console.log(`- ${key}`));

      const confirmed = await getUserConfirmation(
        '\nDo you want to proceed with translation? (Y/n): '
      );
      if (!confirmed) {
        console.log('Translation cancelled.');
        continue;
      }

      for (const lang of languages) {
        const targetFile = path.join(srcPath, `${lang}.json`);
        let targetData = {};
        try {
          targetData = JSON.parse(await fs.readFile(targetFile, 'utf8'));
        } catch (error) {
          console.log(`Creating new file for language: ${lang}`);
        }
        const updatedData = await fillMissingKeys(
          openai,
          srcData,
          targetData,
          lang,
          '',
          changedKeys
        );
        await fs.writeFile(
          targetFile,
          JSON.stringify(updatedData, null, 2),
          'utf8'
        );
        console.log(`Updated/created file for language: ${lang}`);
      }
    }
  } catch (error) {
    console.error('Error processing translation:', error);
  }
}

async function fillMissingKeys(
  openai,
  srcObj,
  targetObj,
  lang,
  path = '',
  changedKeys
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
        newPath,
        changedKeys
      );
    } else if (updatedObj[key] === undefined && changedKeys.has(newPath)) {
      console.log(`Translating and adding missing key: ${newPath}`);
      await retryWithExponentialBackoff(async () => {
        const translation = await translateWithOpenAI(srcObj[key], lang);
        updatedObj[key] = translation;
      });
    } else {
      console.log(`Skipping key: ${newPath}`);
    }
  }

  return updatedObj;
}

async function translateWithOpenAI(text, targetLang) {
  const prompt = `Translate the following text to ${targetLang}. Return only the translated string, without any additional text or explanations:\n\n${text}`;

  const response = await openai.chat.completions.create({
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
    const commitHash = process.argv[2];
    console.log(`Using commit hash from latest release: ${commitHash}`);
    await translateAndFill(commitHash);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await uninstallOpenAI();
    rl.close();
  }
}

main();
