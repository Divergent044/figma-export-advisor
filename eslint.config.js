import eslint from '@eslint/js'
import tsESLint from 'typescript-eslint'
import figmaPlugin from '@figma/eslint-plugin-figma-plugins'

export default tsESLint.config(
  eslint.configs.recommended,
  tsESLint.configs.recommended,
  {
    plugins: {
      '@figma/figma-plugins': figmaPlugin,
    },
    rules: {
      ...figmaPlugin.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    ignores: ['code.js', 'ui.html', 'deprecated-template-code.js', 'dist', 'eslint.config.js'],
  },
  {
    files: ['scripts/**/*.mjs'],
    rules: {
      'no-undef': 'off',
    },
  },
)
