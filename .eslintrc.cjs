module.exports = {
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true, // Habilita JSX
    },
    requireConfigFile: false, 
  },
  env: {
    es6: true,
    node: true,
    browser: true, 
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended', 
  ],
  plugins: ['react'],
  settings: {
    react: {
      version: 'detect', 
    },
  },
  rules: {
    // reglas personalizadas
  },
};