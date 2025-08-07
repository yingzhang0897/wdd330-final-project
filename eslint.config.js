import js from "@eslint/js";
import prettier from "eslint-config-prettier";

export default [
  {
    files: ["**/*.js"], // Optional: define which files this config applies to
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        alert: "readonly",
        console: "readonly",
        document: "readonly",
        window: "readonly",
        fetch: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
      },
    },
    rules: {
      "no-console": "warn",
      eqeqeq: "error",
      "no-unused-vars": ["warn", { vars: "all", args: "after-used" }],
      quotes: ["error", "single"],
    },
  },
  js.configs.recommended, // ESLint recommended base rules
  prettier, // disables rules that conflict with Prettier
];
