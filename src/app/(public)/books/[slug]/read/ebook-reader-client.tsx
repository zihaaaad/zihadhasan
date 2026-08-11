"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CMSService, Book } from "@/lib/cms-service";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldAlert, Lock, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-provider";
import sanitizeHtml from "sanitize-html";

interface EbookReaderClientProps {
 slug: string;
}

export default function EbookReaderClient({ slug }: EbookReaderClientProps) {
 const { user, loading: authLoading } = useAuth();
 const router = useRouter();
 const [book, setBook] = useState<Book | null>(null);
 const [content, setContent] = useState<string | null>(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);

 useEffect(() => {
 if (!authLoading && !user) {
 router.push("/login");
 return;
 }

 if (slug && user) {
 CMSService.getBookBySlug(slug as string).then(async (data) => {
 if (!data) {
 setError("Book not found.");
 setLoading(false);
 return;
 }
 setBook(data);
 
 const result = await CMSService.getEbookContent(data.id!, user.uid);
 if (result.success) {
 setContent(result.content);
 } else {
 setError(result.error || "Access Denied.");
 }
 setLoading(false);
 });
 }
 }, [slug, user, authLoading, router]);

 // Anti-Piracy: Disable right-click and copy
 useEffect(() => {
 const handleContextMenu = (e: MouseEvent) => e.preventDefault();
 const handleKeyDown = (e: KeyboardEvent) => {
 if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'u' || e.key === 's' || e.key === 'p')) {
 e.preventDefault();
 }
 };
 document.addEventListener('contextmenu', handleContextMenu);
 document.addEventListener('keydown', handleKeyDown);
 return () => {
 document.removeEventListener('contextmenu', handleContextMenu);
 document.removeEventListener('keydown', handleKeyDown);
 };
 }, []);

  if (loading || authLoading) return <div className="min-h-screen pt-24 text-center text-muted-foreground">Verifying credentials...</div>;

 if (error) {
 return (
 <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
 <ShieldAlert className="h-16 w-16 text-red-500 mb-6" />
        <h1 className="text-2xl font-bold text-foreground mb-4">{error}</h1>
 <p className="text-muted-foreground mb-8 max-w-sm">
 This content is protected. Please ensure you have purchased the book and your payment is approved.
 </p>
 <Link href={`/books/${slug}`}>
 <Button className="rounded-xl h-12 px-8 bg-background text-foreground font-bold uppercase tracking-widest">
 Back to Store
 </Button>
 </Link>
 </div>
 );
 }

 return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      {/* Header / Toolbar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-gray-50 border-b border-border z-50 flex items-center justify-between px-6">
          <Link href={`/books/${slug}`} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
 <ArrowLeft className="h-4 w-4" /> Exit Reader
 </Link>
 <div className="flex items-center gap-2">
 <ShieldCheck className="h-4 w-4 text-primary" />
 <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Secure Environment</span>
 </div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 select-none">
          {user?.email}
        </div>
 </div>

 <div className="pt-32 pb-20 container mx-auto px-4 max-w-3xl relative">
 {/* Watermark */}
 <div className="fixed inset-0 flex items-center justify-center pointer-events-none opacity-[0.02] select-none z-0">
        <div className="text-4xl font-bold text-gray-200 rotate-45">
          {user?.email}
        </div>
      </div>

      <div className="prose prose-lg max-w-none relative z-10" 
 dangerouslySetInnerHTML={{ __html: sanitizeHtml(content || "") }} />
 </div>
 </div>
 );
}
