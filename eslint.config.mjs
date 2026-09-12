import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

// eslint-config-next 15.5.x still ships the legacy `{ extends: [...] }` shape,
// not flat-config arrays. The previous config spread those objects directly
// (`...nextVitals`), which threw "nextVitals is not iterable" - and before that
// it imported them without the .js extension, which threw ERR_MODULE_NOT_FOUND.
// Either way `npm run lint` had never actually executed. FlatCompat is the
// supported bridge until the config package ships flat config natively.
const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      ".firebase/**",
      "node_modules/**",
    ],
  },
];

export default eslintConfig;
