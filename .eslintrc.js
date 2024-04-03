module.exports = {
  overrides: [
    {
      files: [
        '*.ts',
        '*.js',
        '*.mjs'
      ],
      extends: 'love',
      rules: {
        '@typescript-eslint/consistent-type-imports': 0
      }
    }
  ],
  parserOptions: {
    project: './tsconfig.json'
  },
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/'
  ]
}
