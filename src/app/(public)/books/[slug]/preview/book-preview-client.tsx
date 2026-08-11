"use client";

import { CMSService, Book } from "@/lib/cms-service";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import sanitizeHtml from "sanitize-html";

interface BookPreviewClientProps {
 book: Book;
}

export default function BookPreviewClient({ book }: BookPreviewClientProps) {
 return (
 <div className="min-h-screen pt-24 pb-20 container mx-auto px-4 max-w-3xl">
        <Link href="/books" className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground mb-12 transition-colors">
 <ArrowLeft className="mr-2 h-3.5 w-3.5" /> Back to Library
 </Link>

 <header className="mb-16">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-6 leading-tight">
          {book.title} <span className="text-primary italic font-serif text-2xl md:text-3xl ml-2">(Preview)</span>
        </h1>
 <div className="flex items-center gap-4 text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
 <span>By {book.author}</span>
 <span>•</span>
 <span>Free Sample</span>
 </div>
 </header>

      <div className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-gray-600 prose-p:leading-relaxed prose-strong:text-foreground border-l border-border pl-8">
 {book.previewContent ? (
 <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(book.previewContent) }} />
 ) : (
 <p className="italic text-gray-800">No preview available for this title yet.</p>
 )}
 </div>

      <div className="mt-20 p-10 rounded-[2rem] border border-border bg-background text-center shadow-sm">
        <Lock className="h-8 w-8 text-primary mx-auto mb-6" />
        <h3 className="text-xl font-bold text-foreground mb-4 tracking-tight">Enjoyed the preview?</h3>
 <p className="text-muted-foreground text-sm font-medium mb-8 max-w-xs mx-auto">
 Purchase the full edition to unlock all chapters and supporting materials.
 </p>
 <div className="flex flex-col sm:flex-row gap-4 justify-center">
 <Link href={`/books/${book.slug}`}>
            <Button className="rounded-xl h-12 px-8 text-[10px] font-bold uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
              Purchase Full Book
            </Button>
 </Link>
 </div>
 </div>
 </div>
 );
}
