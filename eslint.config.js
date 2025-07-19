import jsEslint from "@eslint/js";
import gitignore from "eslint-config-flat-gitignore";
import configPrettier from "eslint-config-prettier";
import pluginAstro from "eslint-plugin-astro";
import pluginImport from "eslint-plugin-import";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginUnusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import tsEslint from "typescript-eslint";

export default tsEslint.config(
  gitignore(),
  jsEslint.configs.recommended,
  ...tsEslint.configs.recommended,
  ...pluginAstro.configs["flat/recommended"],
  ...pluginAstro.configs["flat/jsx-a11y-strict"],
  pluginReactHooks.configs["recommended-latest"],
  pluginReact.configs.flat.recommended,
  pluginJsxA11y.configs.flat.recommended,
  configPrettier,
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      pluginImport.flatConfigs.recommended,
      pluginImport.flatConfigs.typescript
    ],
    settings: {
      "import/resolver": {
        typescript: true,
        node: true
      }
    }
  },
  {
    files: ["**/*.astro"],
    languageOptions: {
      parser: pluginAstro.parser,
      parserOptions: {
        parser: tsEslint.parser,
        extraFileExtensions: [".astro"]
      }
    }
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    plugins: {
      "unused-imports": pluginUnusedImports
    },
    rules: {
      curly: ["warn", "all"],
      "no-unused-vars": "off",
      "no-undef": "warn",
      "no-shadow": "warn",
      "no-param-reassign": "warn",
      "no-underscore-dangle": "off",
      "no-empty-function": "off",

      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",

      "@typescript-eslint/explicit-member-accessibility": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-empty-function": "off",

      "import/no-unresolved": "off",
      "import/extensions": "off",
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index"
          ],
          pathGroups: [
            {
              pattern: "@/**",
              group: "internal",
              position: "before"
            }
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          "newlines-between": "never",
          alphabetize: {
            order: "asc",
            caseInsensitive: true
          }
        }
      ],
      "unused-imports/no-unused-imports": "error"
    }
  }
);
