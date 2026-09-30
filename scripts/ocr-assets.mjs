import { copyFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const root = (pkg) => dirname(require.resolve(`${pkg}/package.json`));
const out = join(import.meta.dirname, "..", "public", "ocr");

const files = [
  ["tesseract.js", "dist/worker.min.js", "worker.min.js"],
  ...["", "simd-", "relaxedsimd-"].map((variant) => [
    "tesseract.js-core",
    `tesseract-core-${variant}lstm.wasm.js`,
    `core/tesseract-core-${variant}lstm.wasm.js`,
  ]),
  ["@tesseract.js-data/fra", "4.0.0_best_int/fra.traineddata.gz", "lang/fra.traineddata.gz"],
];

for (const [pkg, from, to] of files) {
  mkdirSync(dirname(join(out, to)), { recursive: true });
  copyFileSync(join(root(pkg), from), join(out, to));
}
console.log(`OCR : ${files.length} fichiers copiés dans public/ocr/`);
