import js from "@eslint/js";
import prettier from "eslint-config-prettier";

export default [
  js.configs.recommended, // ESLint recommended base rules
  {
    files: ["**/*.js"], // Optional: define which files this config applies to
    rules: {
      "no-console": "warn",
      eqeqeq: "error",
      "no-unused-vars": ["warn", { vars: "all", args: "after-used" }],
      quotes: ["error", "single"],
    },
  },
  prettier, // disables rules that conflict with Prettier
];
