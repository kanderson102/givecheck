import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals.js";
import nextTs from "eslint-config-next/typescript.js";

const toArray = (c) => (Array.isArray(c) ? c : [c]);

const eslintConfig = defineConfig([
  ...toArray(nextVitals),
  ...toArray(nextTs),
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
