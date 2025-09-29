// eslint.config.mjs (ESLint 9 flat config)
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

const importPlugin = (await import('eslint-plugin-import')).default;
const unicorn = (await import('eslint-plugin-unicorn')).default;

export default defineConfig(
  // Ignorer artefacts et configs
  { ignores: ['**/dist/**', '**/build/**', '**/coverage/**', '**/node_modules/**', '**/*.config.*', 'eslint.config.*'] },

  // Base JS (appliquée aux .js/.mjs/.jsx)
  js.configs.recommended,

  // Presets TS "type-aware" (scopés par eux-mêmes aux .ts/.tsx)
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.stylisticTypeChecked,

  // Bloc TS : on met le projectService ICI (scopé aux .ts/.tsx)
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        projectService: true,                // auto-détection des tsconfig par package
        tsconfigRootDir: import.meta.dirname
      }
    },
    plugins: { import: importPlugin, unicorn },
    settings: { 'import/resolver': { typescript: true, node: true } },
    rules: {
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/require-await': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
      'import/order': ['warn', { 'newlines-between': 'always' }],
      'unicorn/filename-case': ['warn', { case: 'kebabCase' }]
    }
  }
);
