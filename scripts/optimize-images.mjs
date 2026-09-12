/**
 * Generate web-optimized variants of the repo's static images.
 *
 * This project is a static export with `images.unoptimized: true` (Next.js
 * cannot run its image optimizer without a server), so whatever is committed
 * is exactly what every visitor downloads. That matters doubly on Firebase
 * Hosting's free tier, which meters egress.
 *
 * Writes new files only - it never deletes the originals. Remove those
 * yourself once you have eyeballed the output.
 *
 *   node scripts/optimize-images.mjs
 */

import sharp from "sharp";
import { statSync, existsSync } from "node:fs";

const kb = (p) => (statSync(p).size / 1024).toFixed(0).padStart(5) + " KB";

// Rendered at most 420 CSS px wide in scroll-portfolio, so 1000 px covers 2x displays.
const PORTFOLIO_WIDTH = 1000;
const PORTFOLIO = [
  "Man_typing_on_laptop.jpeg",
  "Man_working_at_computer_workstation.jpeg",
  "Man_speaking_in_technology_class.png",
  "Man_posing_for_studio_portrait.jpeg",
];

// Open Graph / Twitter cards have a fixed 1200x630 spec; anything larger is waste.
const SOCIAL_CARDS = ["opengraph-image", "twitter-image"];

let savedBytes = 0;

async function convert(src, out, transform) {
  if (!existsSync(src)) {
    console.log(`skip    ${src} (missing)`);
    return;
  }
  const before = statSync(src).size;
  await transform(sharp(src)).toFile(out);
  savedBytes += before - statSync(out).size;
  console.log(`${kb(src)} -> ${kb(out)}   ${src}  ->  ${out}`);
}

for (const name of PORTFOLIO) {
  await convert(
    `public/images/portfolio/${name}`,
    `public/images/portfolio/${name.replace(/\.(png|jpe?g)$/i, ".webp")}`,
    (img) => img.resize({ width: PORTFOLIO_WIDTH, withoutEnlargement: true }).webp({ quality: 80 })
  );
}

for (const base of SOCIAL_CARDS) {
  await convert(`src/app/${base}.png`, `src/app/${base}.jpg`, (img) =>
    img.resize(1200, 630, { fit: "cover" }).jpeg({ quality: 82, mozjpeg: true })
  );
}

// Used only as the structured-data publisher logo, where 512 px is plenty.
// Palette quantisation matters here: a straight re-encode at the same 512 px
// actually came out *larger* than the source.
await convert("public/logo.png", "public/logo-512.png", (img) =>
  img.resize({ width: 512, withoutEnlargement: true }).png({ compressionLevel: 9, palette: true, quality: 90 })
);

console.log(`\nTotal reduction: ${(savedBytes / 1024 / 1024).toFixed(2)} MB`);
console.log("Originals were left in place - delete them once the new files look right.");
