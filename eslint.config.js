import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["node_modules/**", "backend/**"] },
  {
    files: ["public/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: { ...globals.browser, ...globals.es2021 },
    },
    rules: { ...js.configs.recommended.rules },
  },
  {
    files: ["server/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: { ...globals.node },
    },
    rules: { ...js.configs.recommended.rules },
  },
  {
    files: ["test/**/*.mjs", "eslint.config.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: { ...globals.node },
    },
    rules: { ...js.configs.recommended.rules },
  },
];
