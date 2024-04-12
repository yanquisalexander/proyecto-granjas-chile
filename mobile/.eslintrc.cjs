module.exports = [{
  extends: [
    'standard',
    'universe',
    'universe/native',
    'universe/shared/typescript-analysis',
  ],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.d.ts'],
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  ],
  plugins: ['react-hooks'],
  rules: {
    'import/order': 'off',
  },
  env: {
    node: true,
  },
}]