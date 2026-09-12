import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";
import unusedImports from "eslint-plugin-unused-imports";

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
    plugins: { "unused-imports": unusedImports },
    rules: {
      // Auto-fixable, unlike the base no-unused-vars rule. Unused *imports* are
      // always safe to delete; unused locals are reported but left alone,
      // because deleting those can change behaviour.
      "unused-imports/no-unused-imports": "error",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      // next/image cannot optimise anything in this project: `output: 'export'`
      // forces `images.unoptimized`, so <Image> degrades to a plain <img> with
      // extra layout constraints. Swapping 24 call sites would add risk and
      // change nothing a visitor can measure.
      "@next/next/no-img-element": "off",
    },
  },
  {
    // Build tooling, not application code.
    files: ["scripts/**"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "no-console": "off",
    },
  },
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
