module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    './node_modules/ts-standard/eslintrc.json'
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json'
  },
  rules: {
  },
  ignorePatterns: [
    'build',
    'node_modules'
  ]
}
