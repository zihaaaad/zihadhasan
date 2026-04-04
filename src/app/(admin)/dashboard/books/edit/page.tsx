"use client";

import { useEffect, useState, Suspense } from "react";
import { Book, CMSService } from "@/lib/cms-service";
import { BookEditor } from "@/components/admin/book-editor";
import { Skeleton } from "@/components/ui/skeleton";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

function EditBookContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
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
        } else {
            setLoading(false);
        }
    }, [id]);

    if (loading) {
        return <Skeleton className="h-[600px] w-full rounded-[2rem] bg-white/5" />;
    }

    if (!id) {
        return (
            <div className="flex h-[50vh] items-center justify-center text-gray-400">
                Invalid Request: Missing Book ID.
            </div>
        );
    }

    if (!book) {
        return (
            <div className="flex h-[50vh] items-center justify-center text-gray-400">
                Book not found.
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-500">
            <BookEditor initialData={book} initialSecureContent={secureContent} />
        </div>
    );
}

export default function EditBookPage() {
    return (
        <Suspense fallback={<div className="flex h-[50vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
            <EditBookContent />
        </Suspense>
    );
}
