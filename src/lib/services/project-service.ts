import { db } from "../firebase";
import {
 collection,
 addDoc,
 updateDoc,
 doc,
 getDocs,
 query,
 orderBy,
 Timestamp,
 where,
 limit,
} from "firebase/firestore";

export interface Project {
 id?: string;
 title: string;
 description: string;
 tags: string[];
 imageUrl: string;
 liveLink: string;
 githubLink: string;
 createdAt?: Timestamp;
 isDeleted?: boolean;
}

export interface Tool {
 id?: string;
 name: string;
 description: string;
 category: string;
 url: string;
 imageUrl?: string;
 createdAt?: Timestamp;
 isDeleted?: boolean;
}

/**
 * TEMPORARY - delete once `node scripts/fix-project-descriptions.mjs` has run.
 *
 * Two of these three descriptions are wrong in Firestore: Rupantor is an
 * Electron/React desktop font manager and Adobe automation hub, not a compiler,
 * and Jontro is an offline desktop utility suite, not a build tool. Both the
 * repositories' own descriptions and the CV say so. Applied in one place so the
 * build-time render and the client-side refresh cannot disagree.
 */
const COPY_OVERRIDES: Record<string, string> = {
 Jontro: "An offline, privacy-first utility suite for the desktop - video conversion, WASM-powered OCR, PDF tools, image cropping and vector tracing, all running locally with zero cloud dependency.",
 Chuti: "An offline-first leave and holiday management system using SQLite WAL storage with LAN sharing, so a small team can run scheduling entirely on its own network.",
 Rupantor: "Free, open-source desktop font manager and Adobe automation hub for Windows and macOS. Built with Electron, React and TypeScript, with a serverless Firebase licensing system, offline grace periods and deep Adobe After Effects integration.",
};

export function applyProjectCopyOverrides(projects: Project[]): Project[] {
 return projects.map((project) =>
 COPY_OVERRIDES[project.title]
 ? { ...project, description: COPY_OVERRIDES[project.title] }
 : project
 );
}

export const ProjectService = {
 // --- Projects ---
 addProject: async (project: Project) => {
 return await addDoc(collection(db, "projects"), {
 ...project,
 isDeleted: false,
 createdAt: Timestamp.now(),
 });
 },

 getProjects: async (limitCount: number = 20) => {
 try {
 const q = query(
 collection(db, "projects"),
 where("isDeleted", "==", false),
 orderBy("createdAt", "desc"),
 limit(limitCount)
 );
 const snapshot = await getDocs(q);
 return snapshot.docs
 .map(doc => ({ id: doc.id, ...doc.data() } as Project));
 } catch (error) {
 console.error("[ProjectService] getProjects failed:", error);
 throw error;
 }
 },

 getLatestProject: async () => {
 try {
 const q = query(
 collection(db, "projects"),
 where("isDeleted", "==", false),
 orderBy("createdAt", "desc"),
 limit(1)
 );
 const snapshot = await getDocs(q);
 return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Project;
 } catch (error) {
 console.error("[ProjectService] getLatestProject failed:", error);
 return null;
 }
 },

 deleteProject: async (id: string) => {
 // Soft Delete
 await updateDoc(doc(db, "projects", id), { isDeleted: true });
 },

 updateProject: async (id: string, data: Partial<Project>) => {
 const docRef = doc(db, "projects", id);
 await updateDoc(docRef, data);
 },

 bulkDeleteProjects: async (ids: string[]) => {
 const promises = ids.map(id => updateDoc(doc(db, "projects", id), { isDeleted: true }));
 await Promise.all(promises);
 },

 // --- Tools ---
 addTool: async (tool: Tool) => {
 return await addDoc(collection(db, "tools"), {
 ...tool,
 isDeleted: false,
 createdAt: Timestamp.now(),
 });
 },

 getTools: async (limitCount: number = 20) => {
 try {
 const q = query(
 collection(db, "tools"),
 where("isDeleted", "==", false),
 orderBy("createdAt", "desc"),
 limit(limitCount)
 );
 const snapshot = await getDocs(q);
 return snapshot.docs
 .map(doc => ({ id: doc.id, ...doc.data() } as Tool));
 } catch (error) {
 console.error("[ProjectService] getTools failed:", error);
 throw error;
 }
 },

 getLatestTool: async () => {
 try {
 const q = query(
 collection(db, "tools"),
 where("isDeleted", "==", false),
 orderBy("createdAt", "desc"),
 limit(1)
 );
 const snapshot = await getDocs(q);
 return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Tool;
 } catch (error) {
 console.error("[ProjectService] getLatestTool failed:", error);
 return null;
 }
 },

 deleteTool: async (id: string) => {
 // Soft Delete
 await updateDoc(doc(db, "tools", id), { isDeleted: true });
 },

 updateTool: async (id: string, data: Partial<Tool>) => {
 const docRef = doc(db, "tools", id);
 await updateDoc(docRef, data);
 },

 bulkDeleteTools: async (ids: string[]) => {
 const promises = ids.map(id => updateDoc(doc(db, "tools", id), { isDeleted: true }));
 await Promise.all(promises);
 },
};
;
