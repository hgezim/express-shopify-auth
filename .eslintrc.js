module.exports = {
  root: true,
  env: {
    "node": true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: `./tsconfig.json`
  },
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint'
  ],
  rules:
  {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-inferrable-types": "off",
    "@typescript-eslint/naming-convention": [
      "error",
      { "selector": "variableLike", "format": ["camelCase", "UPPER_CASE", "PascalCase"], "leadingUnderscore": "allow" },
    ],
    "@typescript-eslint/unbound-method": ["error", {
      "ignoreStatic": true
    }],
  }
};