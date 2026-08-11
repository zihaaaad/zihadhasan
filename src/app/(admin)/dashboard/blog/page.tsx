"use client";

"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Calendar, FileText, CheckCircle, XCircle, Loader2, Search } from "lucide-react";
import { BlogPost, CMSService } from "@/lib/cms-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Timestamp } from "firebase/firestore";
import { formatDate } from "@/lib/format";
import {
 AlertDialog,
 AlertDialogAction,
 AlertDialogCancel,
 AlertDialogContent,
 AlertDialogDescription,
 AlertDialogFooter,
 AlertDialogHeader,
 AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function BlogAdminPage() {
 const [posts, setPosts] = useState<BlogPost[]>([]);
 const [loading, setLoading] = useState(true);
 const [searchQuery, setSearchQuery] = useState("");
 const [deletingId, setDeletingId] = useState<string | null>(null);

 useEffect(() => {
 loadPosts();
 }, []);

 const loadPosts = async () => {
 setLoading(true);
 try {
 // Fetch all posts (both draft and published)
 const data = await CMSService.getPosts(false);
 setPosts(data);
 } catch (error) {
 console.error("Failed to load posts", error);
 } finally {
 setLoading(false);
 }
 };

 const handleDelete = (id: string) => {
 setDeletingId(id);
 };

 const confirmDelete = async (id: string) => {
 try {
 await CMSService.deletePost(id);
 setPosts(prev => prev.filter(p => p.id !== id));
 setDeletingId(null);
 } catch (error) {
 console.error("Failed to delete", error);
 }
 };

 const filteredPosts = posts.filter(post =>
 post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
 post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
 );

 return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Blog Management</h2>
          <p className="text-muted-foreground font-medium">Write, edit, and publish articles.</p>
        </div>
        <Link href="/dashboard/blog/create">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" /> New Post
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <Search className="h-4 w-4 text-muted-foreground/80" />
        <Input
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-background border-border text-foreground font-medium focus-visible:ring-black"
        />
      </div>

 {loading ? (
 <div className="flex justify-center p-12">
 <Loader2 className="animate-spin text-primary h-8 w-8" />
 </div>
 ) : (
 <div className="grid gap-4">
 {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex flex-col md:flex-row gap-4 p-4 rounded-xl border border-border bg-background hover:border-gray-300 transition-colors shadow-sm group"
                >
                  {/* Image Thumbnail */}
                  <div className="h-24 w-full md:w-32 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                    {post.coverImage ? (
                      <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground/80">
                        <FileText className="h-8 w-8" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-foreground truncate group-hover:text-gray-600 transition-colors">
                          {post.title}
                        </h3>
                        <Badge variant="outline" className={`h-5 text-[10px] font-bold uppercase tracking-widest border-border ${post.published ? "bg-background text-foreground" : "bg-gray-100 text-muted-foreground"}`}>
                          {post.published ? "Published" : "Draft"}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-muted-foreground line-clamp-2">{post.excerpt || "No excerpt..."}</p>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {post.createdAt ? formatDate(post.createdAt) : "Unknown"}
                      </span>
                      <span className="flex items-center gap-1">
                        /api/blog/{post.slug}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 md:self-center">
                    <Link href={`/dashboard/blog/edit?id=${post.id}`}>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-gray-100">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => post.id && handleDelete(post.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
 ))}

            {filteredPosts.length === 0 && (
              <div className="text-center py-20 text-muted-foreground font-medium">
                No posts found. Start writing something new!
              </div>
            )}
 </div>
 )}
 <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
 <AlertDialogContent>
 <AlertDialogHeader>
 <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
 <AlertDialogDescription>
 This action cannot be undone. This will permanently delete the blog post.
 </AlertDialogDescription>
 </AlertDialogHeader>
 <AlertDialogFooter>
 <AlertDialogCancel>Cancel</AlertDialogCancel>
 <AlertDialogAction
 onClick={() => deletingId && confirmDelete(deletingId)}
 className="bg-red-600 hover:bg-red-700 text-primary-foreground"
 >
 Delete
 </AlertDialogAction>
 </AlertDialogFooter>
 </AlertDialogContent>
 </AlertDialog>
 </div>
 );
}
