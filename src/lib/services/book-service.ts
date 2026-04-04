import { db } from "../firebase";
import {
    collection,
    doc,
    getDocs,
    getDoc,
    query,
    where,
    limit,
    Timestamp,
    addDoc,
    setDoc,
    updateDoc,
    deleteDoc,
} from "firebase/firestore";

export interface Book {
    id?: string;
    title: string;
    slug: string;
    description: string;
    author: string;
    price: number;
    hardcopyPrice?: number;
    imageUrl: string;
    published: boolean;
    previewContent?: string; // HTML content for the free preview
    createdAt?: Timestamp;
    isDeleted?: boolean;
    type: 'ebook' | 'hardcopy' | 'both';
}

export const BookService = {
    getBooks: async (onlyPublished = true) => {
        const constraints = [where("isDeleted", "==", false)];
        if (onlyPublished) constraints.push(where("published", "==", true));
        
        const q = query(collection(db, "books"), ...constraints);
        const snapshot = await getDocs(q);
        const books = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Book));
        return books.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    },

    getBookBySlug: async (slug: string, onlyPublished = true) => {
        const constraints = [where("slug", "==", slug), limit(1)];
        if (onlyPublished) constraints.push(where("published", "==", true));
        
        const q = query(collection(db, "books"), ...constraints);
        const snapshot = await getDocs(q);
        if (snapshot.empty) return null;
        return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Book;
    },

    getBook: async (id: string) => {
        const docRef = doc(db, "books", id);
        const snapshot = await getDoc(docRef);
        return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } as Book : null;
    },

    getEbookContent: async (bookId: string, userId: string) => {
        // First verify purchase
        const purchaseId = `${userId}_${bookId}`;
        const regRef = doc(db, "registrations", purchaseId);
        const regSnap = await getDoc(regRef);

        if (!regSnap.exists() || regSnap.data().status !== 'approved') {
            return { success: false, error: "Access Denied: Purchase not verified." };
        }

        // Fetch secure content
        const secureRef = doc(db, "books", bookId, "secure", "content");
        const secureSnap = await getDoc(secureRef);
        
        if (!secureSnap.exists()) {
            return { success: false, error: "Content not found." };
        }

        return { success: true, content: secureSnap.data().fullContent };
    },

    addBook: async (book: Omit<Book, "id" | "createdAt"> & { fullContent?: string }) => {
        const { fullContent, ...publicData } = book;
        const docRef = await addDoc(collection(db, "books"), {
            ...publicData,
            isDeleted: false,
            createdAt: Timestamp.now(),
        });

        if (fullContent) {
            const secureRef = doc(db, "books", docRef.id, "secure", "content");
            await setDoc(secureRef, { fullContent });
        }

        return docRef;
    },

    updateBook: async (id: string, data: Partial<Book> & { fullContent?: string }) => {
        const { fullContent, ...publicData } = data;
        const docRef = doc(db, "books", id);

        if (Object.keys(publicData).length > 0) {
            await updateDoc(docRef, publicData);
        }

        if (fullContent !== undefined) {
            const secureRef = doc(db, "books", id, "secure", "content");
            await setDoc(secureRef, { fullContent }, { merge: true });
        }
    },

    deleteBook: async (id: string) => {
        await updateDoc(doc(db, "books", id), { isDeleted: true });
    },

    registerForBook: async (bookId: string, userDetails: { userId?: string; email: string; name: string; phone?: string; trxId?: string; paymentMethod?: string }) => {
        const docId = userDetails.userId ? `${userDetails.userId}_${bookId}` : undefined;
        const registrationRef = docId ? doc(db, "registrations", docId) : doc(collection(db, "registrations"));
        
        try {
            const payload: any = {
                bookId,
                email: userDetails.email,
                name: userDetails.name,
                status: "pending",
                registeredAt: Timestamp.now()
            };
            if (userDetails.userId) payload.userId = userDetails.userId;
            if (userDetails.phone) payload.phone = userDetails.phone;
            if (userDetails.trxId) payload.trxId = userDetails.trxId;
            if (userDetails.paymentMethod) payload.paymentMethod = userDetails.paymentMethod;

            await setDoc(registrationRef, payload);
            return { success: true, id: registrationRef.id };
        } catch (e) {
            console.error("Book purchase failed", e);
            return { success: false, error: e };
        }
    },
};
