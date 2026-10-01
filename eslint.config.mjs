import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // Project-specific ignores.
  globalIgnores([
    // Next.js generated files.
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",

    // Capacitor / Android generated files.
    "android/app/build/**",
    "android/build/**",
    "android/.gradle/**",
    "android/.kotlin/**",
  ]),
]);

export default eslintConfig;
