"use client";

import { useEffect, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { BlogPost, CMSService } from "@/lib/cms-service";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

// Tiptap (rich text editor) is heavy and DOM-dependent - load it only when this
// page is actually visited instead of bundling it into every admin route.
const BlogEditor = dynamic(
 () => import("@/components/admin/blog-editor").then((mod) => mod.BlogEditor),
 { ssr: false, loading: () => <Skeleton className="h-[600px] w-full bg-background" /> }
);

function EditBlogPostContent() {
 const searchParams = useSearchParams();
 const id = searchParams.get('id');
 const [post, setPost] = useState<BlogPost | null>(null);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 if (id) {
 loadPost(id);
 } else {
 setLoading(false);
 }
 }, [id]);

 const loadPost = async (postId: string) => {
 try {
 const fetchedPost = await CMSService.getPost(postId);
 if (fetchedPost) {
 setPost(fetchedPost);
 }
 } catch (error) {
 console.error("Failed to load post", error);
 } finally {
 setLoading(false);
 }
 };

 if (loading) {
 return (
 <div className="flex h-[50vh] items-center justify-center">
 <Loader2 className="h-8 w-8 animate-spin text-primary" />
 </div>
 );
 }

 if (!id) {
 return (
 <div className="flex h-[50vh] items-center justify-center text-muted-foreground/80">
 Invalid Request: Missing Post ID.
 </div>
 );
 }

 if (!post) {
 return (
 <div className="flex h-[50vh] items-center justify-center text-muted-foreground/80">
 Post not found.
 </div>
 );
 }

 return (
 <div className="space-y-6">
 <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Edit Post</h2>
 <p className="text-muted-foreground">Make changes to your article.</p>
 </div>
 <BlogEditor initialData={post} localStorageKey={`blog_draft_${post.id}`} />
 </div>
 );
}

export default function EditBlogPostPage() {
 return (
 <Suspense fallback={<div className="flex h-[50vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
 <EditBlogPostContent />
 </Suspense>
 );
}
