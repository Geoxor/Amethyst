import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginVue from 'eslint-plugin-vue';
import globals from 'globals';
import typescriptEslint from 'typescript-eslint';

export default typescriptEslint.config(
  {
    extends: [
      eslint.configs.recommended,
      ...typescriptEslint.configs.recommended,
      ...eslintPluginVue.configs['flat/recommended'],
    ],
    ignores: ['**/*.d.ts', '**/*.js', '**/coverage', '**/dist'],
    files: ['**/*.ts', '**/*.vue'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        parser: typescriptEslint.parser,
      },
    },
    rules: {
      'vue/no-mutating-props': 'off',
      "vue/prefer-import-from-vue": "warn",
      "vue/html-closing-bracket-spacing": "warn",
      "vue/no-unused-components": "warn",
      "vue/html-self-closing": "warn",
      "vue/no-unused-refs": "warn",
      "vue/no-v-html": "off",
      "vue/block-order": [
        "warn",
        {
          "order": [
            "script",
            "template",
            "style"
          ]
        }
      ],
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-wrapper-object-types': 'warn',
      '@typescript-eslint/no-unsafe-function-type': 'warn',
      '@typescript-eslint/no-require-imports': 'warn',
      'no-async-promise-executor': 'warn',
      'no-unused-expressions': 'off',
      'no-case-declarations': 'off',
      "no-multi-spaces": "warn",
      "no-mixed-spaces-and-tabs": "warn",
      'prefer-const': 'warn',
      'no-empty': 'off'
    },
    settings: {
      "import/resolver": {
        alias: {
          map: [
            [
              "@",
              "./src/renderer"
            ]
          ],
          extensions: [
            ".ts",
            ".vue"
          ]
        }
      }
    }
  },
  eslintConfigPrettier
);