/**
 * Correct three project descriptions that are factually wrong on the live site.
 *
 * The portfolio currently describes Rupantor as "a TypeScript-based compiler and
 * source-to-source code transformer" and Jontro as "a package to simplify
 * TypeScript build and compilation workflows". Neither is what those projects
 * are. Compare the repositories' own descriptions:
 *
 *   Rupantor - "Free, open-source desktop font manager and Adobe automation hub
 *               for Windows & macOS. Built with Electron, React, and TypeScript."
 *   Jontro   - "The offline Swiss Army knife for your desktop. Privacy-first,
 *               zero-cloud utility suite for video conversion, WASM OCR, PDF
 *               tools, image cropping, vector tracing & more."
 *   Chuti    - "Offline-first local Leave Management System with SQLite WAL
 *               storage and LAN sharing."
 *
 * The Rupantor entry also contradicts the CV, which describes it as a secure
 * Electron/React desktop app with Firebase licensing and After Effects
 * integration - i.e. the repo and the CV agree, and only the site is wrong.
 *
 * Two layers were producing the wrong text: the Firestore documents themselves,
 * and a hardcoded override in src/app/(public)/projects/page.tsx that patched
 * the copy in the view layer. This script fixes the data; once it has run,
 * delete the override block (it is marked with a comment pointing here).
 *
 * Usage (Windows PowerShell):
 *   $env:ADMIN_EMAIL="you@example.com"; $env:ADMIN_PASSWORD="..."; node scripts/fix-project-descriptions.mjs
 *
 * Add --dry-run to preview without writing.
 */

import { readFileSync } from "node:fs";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";

const DRY_RUN = process.argv.includes("--dry-run");

const UPDATES = [
  {
    id: "ZugpPtS8OpcgWX98zyiB",
    title: "Rupantor",
    description:
      "Free, open-source desktop font manager and Adobe automation hub for Windows and macOS. Built with Electron, React and TypeScript, with a serverless Firebase licensing system, offline grace periods and deep Adobe After Effects integration.",
    tags: ["Electron", "React", "TypeScript", "Firebase", "Desktop"],
  },
  {
    id: "x4QHvuRxmW5il2VagTkG",
    title: "Jontro",
    description:
      "An offline, privacy-first utility suite for the desktop - video conversion, WASM-powered OCR, PDF tools, image cropping and vector tracing, all running locally with zero cloud dependency.",
    tags: ["Electron", "TypeScript", "WebAssembly", "Offline-First", "Desktop"],
  },
  {
    id: "wz06minZuk4Wz1f5YdLr",
    title: "Chuti",
    description:
      "An offline-first leave and holiday management system using SQLite WAL storage with LAN sharing, so a small team can run scheduling entirely on its own network.",
    tags: ["TypeScript", "SQLite", "Offline-First", "LAN", "Scheduling"],
  },
];

const env = {};
for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim();
}

const app = initializeApp({
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
});

const auth = getAuth(app);
const db = getFirestore(app);

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD (an account whose users/{uid}.role is 'admin').");
    process.exit(1);
  }

  await signInWithEmailAndPassword(auth, email, password);
  console.log(`Signed in as ${email}${DRY_RUN ? "  (dry run)" : ""}\n`);

  for (const update of UPDATES) {
    const ref = doc(db, "projects", update.id);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {
      console.log(`SKIP  ${update.title}  (projects/${update.id} not found)`);
      continue;
    }

    const current = snapshot.data();
    if (current.title !== update.title) {
      console.log(`SKIP  ${update.id}  (expected title "${update.title}", found "${current.title}")`);
      continue;
    }

    console.log(`${update.title}`);
    console.log(`  before: ${(current.description || "").replace(/\s+/g, " ").slice(0, 110)}...`);
    console.log(`  after : ${update.description.slice(0, 110)}...`);

    if (!DRY_RUN) {
      await updateDoc(ref, { description: update.description, tags: update.tags });
    }
    console.log(DRY_RUN ? "  (not written)\n" : "  updated\n");
  }

  console.log(
    DRY_RUN
      ? "Dry run complete. Re-run without --dry-run to apply."
      : "Done. Now delete the override block in src/app/(public)/projects/page.tsx, then `npm run deploy`."
  );
  process.exit(0);
}

main().catch((error) => {
  console.error("Failed:", error);
  process.exit(1);
});
