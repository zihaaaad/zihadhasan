"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Tiptap (rich text editor) is heavy and DOM-dependent - load it only when this
// page is actually visited instead of bundling it into every admin route.
const BookEditor = dynamic(
 () => import("@/components/admin/book-editor").then((mod) => mod.BookEditor),
 { ssr: false, loading: () => <Skeleton className="h-[600px] w-full bg-background" /> }
);

export default function CreateBookPage() {
 return (
 <div className="animate-in fade-in duration-500">
 <BookEditor />
 </div>
 );
}
