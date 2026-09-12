/**
 * One-time migration: move paid lesson video URLs off the public course
 * document and into `courses/{id}/secure/lessons`.
 *
 * Before this ran, `Course.lessons[]` carried every videoUrl on the course
 * document itself, which the security rules make world-readable as soon as a
 * course is published. Anyone with a course id could read the full curriculum
 * of a paid course without enrolling. Free-preview lessons are left untouched -
 * those are meant to be public.
 *
 * Usage (Windows PowerShell):
 *   $env:ADMIN_EMAIL="you@example.com"; $env:ADMIN_PASSWORD="..."; node scripts/migrate-course-lessons.mjs
 *
 * Add --dry-run to print the plan without writing anything.
 *
 * Safe to re-run: courses whose non-preview lessons already have empty URLs on
 * the public document are skipped.
 */

import { readFileSync } from "node:fs";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, getDocs, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const DRY_RUN = process.argv.includes("--dry-run");

function loadEnv(path = ".env.local") {
  const env = {};
  try {
    for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
      const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (match) env[match[1]] = match[2].trim();
    }
  } catch {
    console.error(`Could not read ${path}`);
    process.exit(1);
  }
  return env;
}

const env = loadEnv();

const app = initializeApp({
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
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

  const snapshot = await getDocs(collection(db, "courses"));
  let migrated = 0;
  let skipped = 0;

  for (const courseDoc of snapshot.docs) {
    const course = courseDoc.data();
    const lessons = course.lessons || [];

    const needsMove = lessons.filter((l) => !l.isFreePreview && l.videoUrl);
    if (needsMove.length === 0) {
      console.log(`- ${courseDoc.id}  "${course.title}"  nothing to move`);
      skipped++;
      continue;
    }

    // Merge with anything already stored, so a partial previous run is not lost.
    const existing = await getDoc(doc(db, "courses", courseDoc.id, "secure", "lessons"));
    const urls = { ...(existing.exists() ? existing.data().urls || {} : {}) };

    const publicLessons = lessons.map((lesson) => {
      if (lesson.isFreePreview) return lesson;
      if (lesson.videoUrl) urls[lesson.id] = lesson.videoUrl;
      return { ...lesson, videoUrl: "" };
    });

    console.log(
      `* ${courseDoc.id}  "${course.title}"  moving ${needsMove.length} URL(s), ` +
        `${lessons.length - needsMove.length} preview/empty left public`
    );

    if (!DRY_RUN) {
      // Secure doc first: if the second write fails, the URLs are already
      // safely stored and re-running finishes the job. The reverse order could
      // lose them.
      await setDoc(doc(db, "courses", courseDoc.id, "secure", "lessons"), { urls });
      await updateDoc(doc(db, "courses", courseDoc.id), { lessons: publicLessons });
    }

    migrated++;
  }

  console.log(`\n${DRY_RUN ? "Would migrate" : "Migrated"} ${migrated} course(s), skipped ${skipped}.`);
  process.exit(0);
}

main().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
