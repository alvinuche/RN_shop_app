module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  extends: [
    // 'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    // 'plugin:@typescript-eslint/eslint-recommended',
    // 'plugin:@typescript-eslint/recommended',
    // 'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 13,
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks'],
  rules: {
    // indent: ['error', 2, {SwitchCase: 1}],

    quotes: ['error', 'single', {avoidEscape: true}],
    'no-empty-function': 'off',
    // '@typescript-eslint/no-empty-function': 'off',
    'react/display-name': 'off',
    'react/prop-types': 'off',
    // 'no-restricted-properties': [
    //   2,
    //   {
    //     object: 'disallowedObjectName',
    //     property: 'disallowedPropertyName',
    //   },
    // ],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
