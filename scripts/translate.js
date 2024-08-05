const fs = require('fs/promises');
const { OpenAI } = require('openai');
const path = require('path');

const srcPaths = [
  'apps/gateway-ui/src/languages',
  'apps/guardian-ui/src/languages',
];

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
        const updatedData = await fillMissingKeys(srcData, targetData, lang);
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

async function fillMissingKeys(srcObj, targetObj, lang, path = '') {
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
    response.choices &&
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

translateAndFill();
