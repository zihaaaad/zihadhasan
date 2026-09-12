import { db } from "../firebase";
import {
 collection,
 addDoc,
 updateDoc,
 doc,
 getDocs,
 getDoc,
 query,
 orderBy,
 Timestamp,
 where,
 limit,
 setDoc,
 runTransaction
} from "firebase/firestore";
import { Registration } from "./registration-service";

export interface Lesson {
 id: string;
 title: string;
 videoUrl: string; // YouTube or Vimeo. Empty on the public course document
 // for non-preview lessons - see splitLessons below.
 duration?: string;
 order?: number;
 isFreePreview: boolean;
}

export interface Course {
 id?: string;
 title: string;
 description: string;
 pricingType?: 'free' | 'paid';
 price?: number;
 isSequential?: boolean;
 headerImage?: string;
 published: boolean;
 lessons: Lesson[];
 createdAt?: Timestamp;
 isDeleted?: boolean;
}

/**
 * Paid lesson video URLs are NOT stored on the course document.
 *
 * The course document is readable by anyone once `published` is true, so
 * keeping videoUrl there meant every paid lesson was one getDoc() away for a
 * visitor who never enrolled - the padlock in LessonsList was cosmetic. The
 * URLs now live in a single `courses/{id}/secure/lessons` document that the
 * security rules gate behind an approved registration, which is the same
 * shape books and products already used.
 *
 * Free-preview lessons deliberately keep their URL in the public document:
 * they are meant to be watchable before enrolling.
 */
const secureLessonsRef = (courseId: string) => doc(db, "courses", courseId, "secure", "lessons");

function splitLessons(lessons: Lesson[]): { publicLessons: Lesson[]; secureUrls: Record<string, string> } {
 const publicLessons: Lesson[] = [];
 const secureUrls: Record<string, string> = {};

 for (const lesson of lessons || []) {
 if (lesson.isFreePreview) {
 publicLessons.push(lesson);
 continue;
 }
 if (lesson.videoUrl) secureUrls[lesson.id] = lesson.videoUrl;
 publicLessons.push({ ...lesson, videoUrl: "" });
 }

 return { publicLessons, secureUrls };
}

export const CourseService = {
 // --- Courses ---
 getCourses: async (publishedOnly: boolean = false, limitCount: number = 20) => {
 try {
 const constraints = [where("isDeleted", "==", false)];
 if (publishedOnly) {
 constraints.push(where("published", "==", true));
 }

 const q = query(
 collection(db, "courses"),
 ...constraints,
 orderBy("createdAt", "desc"),
 limit(limitCount)
 );
 const snapshot = await getDocs(q);
 return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
 } catch (error) {
 console.error("[CourseService] getCourses failed:", error);
 throw error;
 }
 },

 getPublishedCourses: async (limitCount: number = 20) => {
 return CourseService.getCourses(true, limitCount);
 },

 getCourse: async (id: string) => {
 const docRef = doc(db, "courses", id);
 const snapshot = await getDoc(docRef);
 return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } as Course : null;
 },

 addCourse: async (course: Omit<Course, "id" | "createdAt">) => {
 const { publicLessons, secureUrls } = splitLessons(course.lessons || []);

 const docRef = await addDoc(collection(db, "courses"), {
 ...course,
 lessons: publicLessons,
 isDeleted: false,
 createdAt: Timestamp.now(),
 });

 await setDoc(secureLessonsRef(docRef.id), { urls: secureUrls });
 return docRef;
 },

 updateCourse: async (id: string, data: Partial<Course>) => {
 const docRef = doc(db, "courses", id);

 // Only touch the secure document when lessons are actually part of this
 // update - a publish toggle or title edit must not wipe the video URLs.
 if (data.lessons) {
 const { publicLessons, secureUrls } = splitLessons(data.lessons);
 await updateDoc(docRef, { ...data, lessons: publicLessons });
 await setDoc(secureLessonsRef(id), { urls: secureUrls });
 return;
 }

 await updateDoc(docRef, data);
 },

 /**
  * Fetch the gated video URLs for a course, keyed by lesson id.
  * Returns {} when the caller is not entitled - the rules reject the read and
  * the UI simply keeps showing locked lessons rather than erroring.
  */
 getSecureLessonUrls: async (courseId: string): Promise<Record<string, string>> => {
 try {
 const snapshot = await getDoc(secureLessonsRef(courseId));
 return snapshot.exists() ? ((snapshot.data().urls || {}) as Record<string, string>) : {};
 } catch {
 return {};
 }
 },

 /** Merge fetched secure URLs back onto a course's lessons for playback. */
 withSecureLessons: (course: Course, urls: Record<string, string>): Course => ({
 ...course,
 lessons: (course.lessons || []).map((lesson) =>
 urls[lesson.id] ? { ...lesson, videoUrl: urls[lesson.id] } : lesson
 ),
 }),

 deleteCourse: async (id: string) => {
 await updateDoc(doc(db, "courses", id), { isDeleted: true });
 },

 // --- Course Registrations ---
 getCourseRegistrations: async (courseId?: string) => {
 let q;
 if (courseId) {
 q = query(collection(db, "registrations"), where("courseId", "==", courseId), orderBy("registeredAt", "desc"));
 } else {
 q = query(collection(db, "registrations"), where("courseId", "!=", null), orderBy("registeredAt", "desc"), limit(50));
 }
 const snapshot = await getDocs(q);
 return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Registration));
 },

 registerForCourse: async (courseId: string, userDetails: { userId?: string; email: string; name: string; phone?: string; trxId?: string; screenshotUrl?: string; paymentMethod?: string; additionalInfo?: string }) => {
 const courseRef = doc(db, "courses", courseId);
 const docId = userDetails.userId ? `${userDetails.userId}_${courseId}` : undefined;
 const registrationRef = docId ? doc(db, "registrations", docId) : doc(collection(db, "registrations"));

 try {
 return await runTransaction(db, async (transaction) => {
 // 1. Check Course Pricing & Existence
 const courseDoc = await transaction.get(courseRef);
 if (!courseDoc.exists()) throw new Error("Course not found");
 const courseData = courseDoc.data() as Course;

 // 2. Check Duplicates (if userId is known)
 if (docId) {
 const regDoc = await transaction.get(registrationRef);
 if (regDoc.exists()) {
 return { success: false, error: "Already registered for this course" };
 }
 }

 let status: "pending" | "approved" = "pending";
 if (courseData.pricingType === 'free') {
 status = "approved";
 }

 // 3. Prepare & Set Payload
 const payload: any = {
 courseId,
 email: userDetails.email,
 name: userDetails.name,
 status: status,
 registeredAt: Timestamp.now()
 };
 if (userDetails.userId) payload.userId = userDetails.userId;
 if (userDetails.phone) payload.phone = userDetails.phone;
 if (userDetails.trxId) payload.trxId = userDetails.trxId;
 if (userDetails.screenshotUrl) payload.screenshotUrl = userDetails.screenshotUrl;
 if (userDetails.paymentMethod) payload.paymentMethod = userDetails.paymentMethod;
 if (userDetails.additionalInfo) payload.additionalInfo = userDetails.additionalInfo;

 transaction.set(registrationRef, payload);
 return { success: true, id: registrationRef.id };
 });
 } catch (e) {
 console.error("[CourseService] registerForCourse failed:", e);
 return { success: false, error: e };
 }
 },

 getUserCourseRegistration: async (userId: string, courseId: string) => {
 // 1. Try Deterministic ID (Fast & Cheap)
 const docId = `${userId}_${courseId}`;
 const docRef = doc(db, "registrations", docId);
 const docSnap = await getDoc(docRef);

 if (docSnap.exists()) {
 return { id: docSnap.id, ...docSnap.data() } as Registration;
 }

 // 2. Fallback: Query (Legacy support or race conditions)
 const q = query(collection(db, "registrations"), where("courseId", "==", courseId), where("userId", "==", userId), limit(1));
 const snapshot = await getDocs(q);
 if (snapshot.empty) return null;
 const fallbackDoc = snapshot.docs[0];
 return { id: fallbackDoc.id, ...fallbackDoc.data() } as Registration;
 },

 toggleLessonCompletion: async (registrationId: string, lessonId: string, isCompleted: boolean) => {
 const docRef = doc(db, "registrations", registrationId);
 await runTransaction(db, async (transaction) => {
 const docSnap = await transaction.get(docRef);
 if (!docSnap.exists()) throw new Error("Registration not found");

 const currentCompleted = docSnap.data().completedLessonIds || [];
 let newCompleted;

 if (isCompleted) {
 if (!currentCompleted.includes(lessonId)) {
 newCompleted = [...currentCompleted, lessonId];
 } else {
 newCompleted = currentCompleted;
 }
 } else {
 newCompleted = currentCompleted.filter((id: string) => id !== lessonId);
 }

 transaction.update(docRef, { completedLessonIds: newCompleted });
 });
 },
};
