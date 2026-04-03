"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Book, CMSService } from "@/lib/cms-service";
import { BookEditor } from "@/components/admin/book-editor";
import { Skeleton } from "@/components/ui/skeleton";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function EditBookPage() {
    const { id } = useParams();
    const [book, setBook] = useState<Book | null>(null);
    const [secureContent, setSecureContent] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                const b = await CMSService.getBook(id as string);
                if (b) {
                    setBook(b);
                    // Fetch secure content directly as admin
                    const secureRef = doc(db, "books", id as string, "secure", "content");
                    const secureSnap = await getDoc(secureRef);
                    if (secureSnap.exists()) {
                        setSecureContent(secureSnap.data().fullContent || "");
                    }
                }
                setLoading(false);
            };
            fetchData();
        }
    }, [id]);

    if (loading) return <Skeleton className="h-[600px] w-full rounded-[2rem] bg-white/5" />;
    if (!book) return <div className="text-white">Book not found.</div>;

    return (
        <div className="animate-in fade-in duration-500">
            <BookEditor initialData={book} initialSecureContent={secureContent} />
        </div>
    );
}
