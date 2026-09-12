import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, writeBatch, getCountFromServer } from "firebase/firestore";

const CONTENT_COLLECTIONS = ["projects", "tools", "events", "posts", "courses", "products", "books"];
const COUNTED_COLLECTIONS = ["users", "registrations", "courses", "products", "posts", "events", "projects"];

export async function getSystemStats() {
 const counts: Record<string, number> = {};

 try {
 // getCountFromServer bills one read per 1000 documents matched, not one per
 // document, so this stays cheap on the Spark plan's 50k reads/day.
 await Promise.all(COUNTED_COLLECTIONS.map(async (col) => {
 const snapshot = await getCountFromServer(collection(db, col));
 counts[col] = snapshot.data().count;
 }));
 } catch (error) {
 console.error("Failed to fetch counts:", error);
 }

 const totalDocs = Object.values(counts).reduce((a, b) => a + b, 0);

 return {
 firebase: {
 // Quota consumption is not exposed to the client SDK at all; the dashboard
 // links out to the Firebase console for that rather than inventing a number.
 // This used to report a hardcoded "4.2 GB of 25 GB used" storage gauge that
 // was pure fiction.
 writes: `${totalDocs} Docs`,
 status: "Healthy",
 details: counts
 },
 trash: await getSoftDeletedCount()
 };
}

export async function getSoftDeletedCount() {
 let totalSoftDeleted = 0;

 try {
 const snapshots = await Promise.all(
 CONTENT_COLLECTIONS.map((col) =>
 getCountFromServer(query(collection(db, col), where("isDeleted", "==", true)))
 )
 );
 totalSoftDeleted = snapshots.reduce((sum, snapshot) => sum + snapshot.data().count, 0);
 } catch (error) {
 console.error("Failed to count soft deleted:", error);
 }

 return totalSoftDeleted;
}

export async function cleanupSoftDeletedItems() {
 const batch = writeBatch(db);
 let deletedCount = 0;

 try {
 // Reads across collections are independent - fetch them all concurrently.
 const snapshots = await Promise.all(
 CONTENT_COLLECTIONS.map((colName) =>
 getDocs(query(collection(db, colName), where("isDeleted", "==", true)))
 )
 );

 for (const snapshot of snapshots) {
 for (const item of snapshot.docs) {
 if (deletedCount >= 450) break; // Safety buffer under the 500-write batch limit
 batch.delete(item.ref);
 deletedCount++;
 }
 }

 if (deletedCount > 0) {
 await batch.commit();
 }

 // A second pass used to try to delete orphaned notifications via
 // collectionGroup(db, 'notifications'). It could never succeed: collection
 // group queries are not matched by `match /users/{userId}/notifications/...`,
 // and no COLLECTION_GROUP index existed - so it always threw *after* the
 // batch above had already committed, reporting failure on a cleanup that
 // had in fact partly run. Notifications are small, per-user, and deletable
 // by their owner, so they are simply left alone.

 return { success: true, count: deletedCount };
 } catch (error) {
 console.error("Cleanup failed:", error);
 return { success: false, count: deletedCount, error };
 }
}
