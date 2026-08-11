import { db } from "../firebase";
import {
 collection,
 addDoc,
 updateDoc,
 doc,
 getDocs,
 getDoc,
 query,
 where,
 limit,
 setDoc,
 Timestamp,
 orderBy,
 runTransaction,
} from "firebase/firestore";
import { Registration } from "./registration-service";

export interface Product {
 id?: string;
 title: string;
 description: string;
 price: number;
 assets: string[]; // Cloudinary URLs
 imageUrl: string; // Cover Image
 type: 'digital' | 'physical';
 downloadUrl?: string; // Encrypted or hidden until approved
 published: boolean;
 createdAt?: Timestamp;
 isDeleted?: boolean;
}

export const ShopService = {
 // --- Products (Shop) ---
 getProducts: async (publishedOnly: boolean = false, limitCount: number = 50) => {
 try {
 const constraints = [where("isDeleted", "==", false)];
 if (publishedOnly) {
 constraints.push(where("published", "==", true));
 }

 const q = query(
 collection(db, "products"),
 ...constraints,
 orderBy("createdAt", "desc"),
 limit(limitCount)
 );
 const snapshot = await getDocs(q);
 return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
 } catch (error) {
 console.error("[ShopService] getProducts failed:", error);
 throw error;
 }
 },

 getPublishedProducts: async (limitCount: number = 20) => {
 return ShopService.getProducts(true, limitCount);
 },

 getProduct: async (id: string) => {
 const docRef = doc(db, "products", id);
 const snapshot = await getDoc(docRef);
 return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } as Product : null;
 },

 getSecureProductContent: async (id: string) => {
 // This query will fail unless the user has an approved registration (Security Rules)
 const docRef = doc(db, "products", id, "secure", "content");
 const snapshot = await getDoc(docRef);
 return snapshot.exists() ? snapshot.data()?.downloadUrl : null;
 },

 addProduct: async (product: Omit<Product, "id" | "createdAt">) => {
 // Separate sensitive data
 const { downloadUrl, ...publicData } = product;

 // Sanitize
 const sanitized = Object.fromEntries(
 Object.entries(publicData).filter(([_, v]) => v !== undefined)
 );

 const docRef = await addDoc(collection(db, "products"), {
 ...sanitized,
 isDeleted: false,
 createdAt: Timestamp.now(),
 });

 // Store secure content in sub-collection
 if (downloadUrl) {
 const secureRef = doc(db, "products", docRef.id, "secure", "content");
 await setDoc(secureRef, { downloadUrl });
 }

 return docRef;
 },

 updateProduct: async (id: string, data: Partial<Product>) => {
 const { downloadUrl, ...publicData } = data;
 const docRef = doc(db, "products", id);

 if (Object.keys(publicData).length > 0) {
 await updateDoc(docRef, publicData);
 }

 if (downloadUrl !== undefined) {
 const secureRef = doc(db, "products", id, "secure", "content");
 await setDoc(secureRef, { downloadUrl }, { merge: true });
 }
 },

 deleteProduct: async (id: string) => {
 await updateDoc(doc(db, "products", id), { isDeleted: true });
 },

 // --- Product Registration (Purchase) ---
 registerForProduct: async (productId: string, userDetails: { userId?: string; email: string; name: string; phone?: string; trxId?: string; screenshotUrl?: string; paymentMethod?: string; additionalInfo?: string }) => {
 const productRef = doc(db, "products", productId);
 const docId = userDetails.userId ? `${userDetails.userId}_${productId}` : undefined;
 const registrationRef = docId ? doc(db, "registrations", docId) : doc(collection(db, "registrations"));

 try {
 return await runTransaction(db, async (transaction) => {
 // 1. Check Product Existence
 const productDoc = await transaction.get(productRef);
 if (!productDoc.exists()) throw new Error("Product not found");

 // 2. Check Duplicates (if userId is known)
 if (docId) {
 const regDoc = await transaction.get(registrationRef);
 if (regDoc.exists()) {
 return { success: false, error: "Already purchased this product" };
 }
 }

 // 3. Prepare & Set Payload
 const payload: any = {
 productId,
 email: userDetails.email,
 name: userDetails.name,
 status: "pending", // Always pending for products unless free
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
 console.error("[ShopService] registerForProduct failed:", e);
 return { success: false, error: e };
 }
 },

 getUserProductPurchase: async (userId: string, productId: string) => {
 const q = query(
 collection(db, "registrations"),
 where("productId", "==", productId),
 where("userId", "==", userId),
 where("status", "==", "approved"),
 limit(1)
 );
 const snapshot = await getDocs(q);
 if (snapshot.empty) return null;
 const doc = snapshot.docs[0];
 return { id: doc.id, ...doc.data() } as Registration;
 },
};
