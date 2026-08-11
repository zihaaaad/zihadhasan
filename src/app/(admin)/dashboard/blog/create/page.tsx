"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Tiptap (rich text editor) is heavy and DOM-dependent - load it only when this
// page is actually visited instead of bundling it into every admin route.
const BlogEditor = dynamic(
 () => import("@/components/admin/blog-editor").then((mod) => mod.BlogEditor),
 { ssr: false, loading: () => <Skeleton className="h-[600px] w-full bg-background" /> }
);

export default function CreateBlogPostPage() {
 return (
 <div className="space-y-6">
 <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Create New Post</h2>
 <p className="text-muted-foreground">Share your thoughts with the world.</p>
 </div>

 <BlogEditor localStorageKey="blog_draft_new_v1" />
 </div>
 );
}
