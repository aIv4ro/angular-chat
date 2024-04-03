module.exports = {
  overrides: [
    {
      files: [
        '*.ts',
        '*.js',
        '*.mjs'
      ],
      extends: 'love'
    }
  ],
  parserOptions: {
    project: './tsconfig.json'
  },
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/'
  ],
  rules: {
    '@typescript-eslint/consistent-type-imports': 0
  }
}
