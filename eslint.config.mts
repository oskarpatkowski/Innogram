// @ts-ignore
import js from "@eslint/js";
// @ts-ignore
import pluginReact from "eslint-plugin-react";
// @ts-ignore
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  js.configs.recommended,

  tseslint.configs.recommended,

  pluginReact.configs.flat.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: {
      globals: globals.browser,
    },
  },

  {
    files: ["**/*.{ts,mts,cts,tsx}"],
    languageOptions: {
      parserOptions: {
        projectService: true,
          // @ts-ignore
          tsconfigRootDir: import.meta.dirname,
      },
    },
  },
);
