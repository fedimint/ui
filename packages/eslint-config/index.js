module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'turbo',
    'prettier',
  ],
  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    quotes: [
      'error',
      'single',
      { avoidEscape: true, allowTemplateLiterals: true },
    ],
    semi: ['error', 'always', { omitLastInOneLineBlock: true }],
    'no-restricted-imports': [
      'error',
      {
        name: 'HStack',
        message:
          "Please use <Flex direction='row'> instead as it does not add any additional styling, where as HStack adds 0.5 rem margin to it's children.",
      },
      {
        name: 'VStack',
        message:
          "Please use <Flex direction='column'> instead as it does not add any additional styling, where as VStack adds 0.5 rem margin to it's children.",
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
