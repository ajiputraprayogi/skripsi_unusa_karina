// .eslintrc.mjs
import nextConfig from 'eslint-config-next';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    ...nextConfig,
    parser: tsParser,
    plugins: {
      ...nextConfig.plugins,
      '@typescript-eslint': tsPlugin,
    },
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
      project: './tsconfig.json', // optional, kalau pakai rules TypeScript yang strict
    },
    rules: {
      ...nextConfig.rules,
      'react/no-unescaped-entities': 'off',
      '@next/next/no-page-custom-font': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
