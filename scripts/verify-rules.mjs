/**
 * Smoke-test the deployed Firestore security rules from an unauthenticated
 * client - i.e. exactly what a visitor's browser console can do.
 *
 * Read-only by default. Pass --write to additionally submit one clearly-marked
 * test contact message, which verifies the anonymous-create path that was
 * silently broken while the rules required App Check that was never configured.
 * Delete that message from the admin dashboard afterwards.
 *
 *   node scripts/verify-rules.mjs
 *   node scripts/verify-rules.mjs --write
 */

import { readFileSync } from "node:fs";
import { initializeApp } from "firebase/app";
import {
  getFirestore, collection, getDocs, doc, getDoc, setDoc, addDoc,
  query, where, limit, Timestamp,
} from "firebase/firestore";

const WRITE = process.argv.includes("--write");

const env = {};
for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim();
}

const db = getFirestore(initializeApp({
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
}));

let pass = 0, fail = 0;

async function expectAllowed(label, fn) {
  try {
    const result = await fn();
    console.log(`  PASS  ${label}`);
    pass++;
    return result;
  } catch (e) {
    console.log(`  FAIL  ${label}  -> unexpectedly denied: ${e.code || e.message}`);
    fail++;
    return null;
  }
}

async function expectDenied(label, fn) {
  try {
    await fn();
    console.log(`  FAIL  ${label}  -> WAS ALLOWED (hole still open)`);
    fail++;
  } catch (e) {
    if (e.code === "permission-denied") {
      console.log(`  PASS  ${label}`);
      pass++;
    } else {
      console.log(`  WARN  ${label}  -> denied for another reason: ${e.code || e.message}`);
      pass++;
    }
  }
}

console.log("\nAnonymous visitor, against the live rules:\n");

console.log("Public content should stay readable:");
const courses = await expectAllowed("read published courses", () =>
  getDocs(query(collection(db, "courses"), where("isDeleted", "==", false), where("published", "==", true), limit(5)))
);
await expectAllowed("read posts", () => getDocs(query(collection(db, "posts"), limit(1))));
await expectAllowed("read settings/global", () => getDoc(doc(db, "settings", "global")));
await expectAllowed("read events", () => getDocs(query(collection(db, "events"), limit(1))));

console.log("\nPrivilege escalation and paid content should be refused:");
await expectDenied("self-assign admin role on a new user profile", () =>
  setDoc(doc(db, "users", "rules-probe-uid"), { uid: "rules-probe-uid", email: "probe@example.com", role: "admin" })
);
await expectDenied("list the users collection", () => getDocs(query(collection(db, "users"), limit(1))));
await expectDenied("list registrations", () => getDocs(query(collection(db, "registrations"), limit(1))));
await expectDenied("forge an approved registration", () =>
  setDoc(doc(db, "registrations", "rules-probe-uid_someBook"), {
    userId: "rules-probe-uid", bookId: "someBook", status: "approved",
    email: "probe@example.com", name: "Probe", registeredAt: Timestamp.now(),
  })
);
await expectDenied("read a book's secure content", () => getDoc(doc(db, "books", "any", "secure", "content")));
await expectDenied("read a product's download URL", () => getDoc(doc(db, "products", "any", "secure", "content")));

const firstCourse = courses?.docs?.[0];
if (firstCourse) {
  await expectDenied(`read paid lesson URLs for course ${firstCourse.id}`, () =>
    getDoc(doc(db, "courses", firstCourse.id, "secure", "lessons"))
  );
} else {
  console.log("  SKIP  paid lesson URL check (no published courses found)");
}

await expectDenied("write junk into messages", () =>
  addDoc(collection(db, "messages"), { anything: "x".repeat(10) })
);
await expectDenied("write an oversized newsletter signup", () =>
  addDoc(collection(db, "subscribers"), { email: "a@b.co", name: "x".repeat(500), joinedAt: Timestamp.now() })
);

if (WRITE) {
  console.log("\nAnonymous form submissions (these were failing before):");
  await expectAllowed("submit a valid contact message", () =>
    addDoc(collection(db, "messages"), {
      name: "Rules Verification Probe",
      email: "probe@example.com",
      subject: "[TEST] delete me",
      message: "Automated check that anonymous contact submissions work. Safe to delete.",
      read: false,
      createdAt: Timestamp.now(),
    })
  );
  await expectAllowed("submit a valid newsletter signup", () =>
    addDoc(collection(db, "subscribers"), {
      email: "probe@example.com",
      name: null,
      joinedAt: Timestamp.now(),
    })
  );
  console.log("\n  Delete the two probe records from the admin dashboard.");
}

console.log(`\n${pass} passed, ${fail} failed.\n`);
process.exit(fail > 0 ? 1 : 0);
