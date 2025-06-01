import eslint from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import eslintPluginVue from "eslint-plugin-vue";
import globals from "globals";
import typescriptEslint from "typescript-eslint";
import vueParser from "vue-eslint-parser";

export default typescriptEslint.config(
  ...eslintPluginVue.configs["flat/recommended"],
  {
    extends: [stylistic.configs.customize({
      // the following options are the default values
      indent: 2,
      quotes: "double",
      semi: true,
      blockSpacing: true,
      arrowParens: true,
      severity: "warn",
      quoteProps: "consistent-as-needed",
      // ...
    })],
    ignores: ["**/*.d.ts", "**/*.js", "**/coverage", "**/dist"],
  },
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: "@typescript-eslint/parser",
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      "vue/no-mutating-props": "off",
      "vue/prefer-import-from-vue": "warn",
      "vue/html-closing-bracket-spacing": "warn",
      "vue/no-unused-components": "warn",
      "vue/html-self-closing": "warn",
      "vue/component-name-in-template-casing": ["error", "kebab-case", {
        registeredComponentsOnly: true,
        ignores: [],
      }],
      "vue/no-unused-refs": "warn",
      "vue/no-v-html": "off",
      "vue/html-indent": ["warn", 2, {
        attribute: 1,
        baseIndent: 1,
        closeBracket: 0,
        alignAttributesVertically: true,
      }],
      "vue/first-attribute-linebreak": ["warn", {
        singleline: "ignore",
        multiline: "below",
      }],
      "vue/max-attributes-per-line": ["warn", {
        singleline: {
          max: 1,
        },
        multiline: {
          max: 1,
        },
      }],
      "vue/block-order": [
        "warn",
        {
          order: [
            "script",
            "template",
            "style",
          ],
        },
      ],
    },
  },
  {
    extends: [
      ...typescriptEslint.configs.recommended,
      eslint.configs.recommended,
    ],
    ignores: ["**/*.d.ts", "**/build", "**/*.js", "**/coverage", "**/dist"],
    files: ["**/*.ts"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
      parserOptions: {
        parser: typescriptEslint.parser,
      },
    },

    plugins: {
      "simple-import-sort": simpleImportSort,
      "@stylistic/ts": stylistic,
    },
    rules: {
      "simple-import-sort/imports": "warn",
      "simple-import-sort/exports": "warn",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-empty-object-type": "warn",
      "@typescript-eslint/no-wrapper-object-types": "warn",
      "@typescript-eslint/no-unsafe-function-type": "warn",
      "@typescript-eslint/no-require-imports": "off",
      "no-async-promise-executor": "off",
      "no-unused-expressions": "off",
      "no-case-declarations": "off",
      "no-multi-spaces": "warn",
      "no-mixed-spaces-and-tabs": "warn",
      "prefer-const": "warn",
      "no-empty": "off",
      "no-undef": "off",
      "no-unused-vars": "off",
    },
    settings: {
      "import/resolver": {
        alias: {
          map: [
            [
              "@",
              "./src/renderer",
            ],
          ],
          extensions: [
            ".ts",
            ".vue",
          ],
        },
      },
    },
  },
);
