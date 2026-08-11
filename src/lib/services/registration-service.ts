import { db } from "../firebase";
import {
 collection,
 doc,
 getDocs,
 deleteDoc,
 updateDoc,
 query,
 orderBy,
 limit,
 startAfter,
 Timestamp,
 where,
 runTransaction,
 QueryDocumentSnapshot,
 DocumentData,
} from "firebase/firestore";
import { Event } from "./event-service";
import { sendNotificationEmail } from "../email";

export interface Registration {
 id?: string;
 eventId?: string;
 courseId?: string;
 productId?: string;
 bookId?: string;
 userId?: string;
 email: string;
 name: string;
 phone?: string;
 trxId?: string;
 screenshotUrl?: string; // Payment Proof
 paymentMethod?: string;
 additionalInfo?: string;
 status: "approved" | "pending";
 registeredAt: Timestamp;
 completedLessonIds?: string[]; // IDs of completed lessons
}

export const RegistrationService = {
 // Admin Action: Approve Registration
 approveRegistration: async (registrationId: string) => {
 const regRef = doc(db, "registrations", registrationId);

 // Captured inside the transaction, sent after it commits. Firestore transactions
 // can retry on contention, so a side effect like sending an email must not live
 // inside the transaction callback itself - it would risk sending duplicates.
 let emailNotice: { toEmail: string; toName: string; subject: string; message: string } | null = null;

 try {
 await runTransaction(db, async (transaction) => {
 const regDoc = await transaction.get(regRef);
 if (!regDoc.exists()) throw "Registration not found";

 const regData = regDoc.data() as Registration;
 if (regData.status === "approved") throw "Already approved";

 let notificationTitle = "Registration Approved";
 let notificationMessage = "Your registration has been approved.";
 let notificationLink = "/courses"; // Default redirect

 // Only check Event limits if it's an Event registration
 if (regData.eventId) {
 const eventRef = doc(db, "events", regData.eventId);
 const eventDoc = await transaction.get(eventRef);
 if (!eventDoc.exists()) throw "Event not found";

 const eventData = eventDoc.data() as Event;
 if ((eventData.registeredCount || 0) >= eventData.totalSeats) {
 throw "Event is full, cannot approve more seats.";
 }

 transaction.update(eventRef, { registeredCount: (eventData.registeredCount || 0) + 1 });
 notificationTitle = "Event Registration Approved";
 notificationMessage = `Your registration for "${eventData.title}" is confirmed!`;
 notificationLink = `/events`;
 } else if (regData.courseId) {
 // Fetch course title for better message
 const courseRef = doc(db, "courses", regData.courseId);
 const courseDoc = await transaction.get(courseRef);
 if (courseDoc.exists()) {
 const courseTitle = courseDoc.data().title;
 notificationMessage = `You now have access to "${courseTitle}".`;
 notificationLink = `/courses/view?id=${regData.courseId}`;
 }
 }

 transaction.update(regRef, { status: "approved" });

 // Create Notification Doc (Only if user is a registered user with an ID)
 if (regData.userId) {
 const notifRef = doc(collection(db, "users", regData.userId, "notifications"));
 transaction.set(notifRef, {
 title: notificationTitle,
 message: notificationMessage,
 link: notificationLink,
 read: false,
 createdAt: Timestamp.now()
 });
 }

 if (regData.email) {
 emailNotice = {
 toEmail: regData.email,
 toName: regData.name || regData.email,
 subject: notificationTitle,
 message: notificationMessage,
 };
 }
 });

 // Best-effort: an in-app notification was already written above regardless
 // of whether email succeeds, so a failed/unconfigured send here doesn't
 // block the approval itself.
 if (emailNotice) {
 sendNotificationEmail(emailNotice).catch((e) =>
 console.error("Failed to send approval email:", e)
 );
 }

 return { success: true };
 } catch (e) {
 console.error("Approval failed: ", e);
 return { success: false, error: e };
 }
 },

 // Admin Action: Reject Registration
 rejectRegistration: async (registrationId: string) => {
 await deleteDoc(doc(db, "registrations", registrationId));
 return { success: true };
 },

 updateRegistration: async (id: string, data: Partial<Registration>) => {
 const docRef = doc(db, "registrations", id);
 await updateDoc(docRef, data);
 },

 bulkApproveRegistrations: async (ids: string[]) => {
 // Each approval is an independent transaction (own event/course lookups + notification write),
 // so there's no need to serialize them - run them concurrently instead of one round-trip at a time.
 return Promise.all(ids.map((id) => RegistrationService.approveRegistration(id)));
 },

 bulkRejectRegistrations: async (ids: string[]) => {
 const promises = ids.map(id => deleteDoc(doc(db, "registrations", id)));
 await Promise.all(promises);
 },

 getRegistrations: async (eventId?: string) => {
 // If eventId provided, filter by it. Else get all (for Dashboard).
 let q;
 if (eventId) {
 q = query(collection(db, "registrations"), where("eventId", "==", eventId), orderBy("registeredAt", "desc"));
 } else {
 q = query(collection(db, "registrations"), orderBy("registeredAt", "desc"), limit(50)); // Cap for safety
 }

 const snapshot = await getDocs(q);
 return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Registration));
 },

 getAllRegistrations: async (limitCount: number = 100) => {
 const q = query(collection(db, "registrations"), orderBy("registeredAt", "desc"), limit(limitCount));
 const snapshot = await getDocs(q);
 return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Registration));
 },

 // Cursor-paginated version for the admin registrations list ("Load More"),
 // so the list isn't silently capped once a project has more than one page
 // of registrations. Returns the page plus a cursor + hasMore flag so the
 // caller can request the next page.
 getRegistrationsPage: async (pageSize: number = 50, cursor?: QueryDocumentSnapshot<DocumentData>) => {
 const constraints = [orderBy("registeredAt", "desc"), limit(pageSize)];
 const q = cursor
 ? query(collection(db, "registrations"), ...constraints, startAfter(cursor))
 : query(collection(db, "registrations"), ...constraints);

 const snapshot = await getDocs(q);
 const registrations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Registration));
 const nextCursor = snapshot.docs[snapshot.docs.length - 1];
 const hasMore = snapshot.docs.length === pageSize;

 return { registrations, nextCursor, hasMore };
 },

 // --- Registrations Queries ---
 getRegistrationsByUser: async (userId: string) => {
 // Query by userId to match security rules
 const q = query(collection(db, "registrations"), where("userId", "==", userId), orderBy("registeredAt", "desc"));
 const snapshot = await getDocs(q);
 return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Registration));
 },
};
