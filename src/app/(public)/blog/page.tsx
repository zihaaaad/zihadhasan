"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, ArrowRight } from "lucide-react";
import { BlogPost, CMSService } from "@/lib/cms-service";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/format";

export default function PublicBlogPage() {
 const [posts, setPosts] = useState<BlogPost[]>([]);
 const [loading, setLoading] = useState(true);
 const [searchQuery, setSearchQuery] = useState("");

 useEffect(() => {
 const fetchPosts = async () => {
 // Only published posts
 const data = await CMSService.getPosts(true);
 setPosts(data);
 setLoading(false);
 };
 fetchPosts();
 }, []);

 const filteredPosts = posts.filter(post =>
 post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
 post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
 );

 return (
 <div className="min-h-screen pt-24 pb-20 container mx-auto px-4">
 <div className="mb-20">
 <motion.h1
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl mb-4"
 >
 Latest <span className="text-primary italic font-serif">Articles</span>
 </motion.h1>
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
 <p className="text-gray-500 text-lg font-medium max-w-xl">
 Deep dives into software engineering, artificial intelligence, and the philosophy of digital craftsmanship.
 </p>

 <div className="relative w-full md:w-80">
 <Search strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
 <Input
 placeholder="FIND AN ARTICLE..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="pl-11 h-11 bg-white/[0.03] border-white/[0.05] text-white rounded-xl focus:ring-gray-200 text-[10px] font-bold uppercase tracking-widest"
 />
 </div>
 </div>
 </div>

 {loading ? (
 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
 {[1, 2, 3, 4, 5, 6].map((i) => (
 <div key={i} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
 <Skeleton className="aspect-video w-full bg-white" />
 <div className="p-6 space-y-3">
 <Skeleton className="h-4 w-24 bg-white" />
 <Skeleton className="h-6 w-3/4 bg-white" />
 <Skeleton className="h-4 w-full bg-white" />
 <Skeleton className="h-4 w-full bg-white" />
 </div>
 </div>
 ))}
 </div>
 ) : (
 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
 {filteredPosts.map((post, index) => (
 <ArticleCard key={post.id} post={post} index={index} />
 ))}

 {filteredPosts.length === 0 && (
 <div className="col-span-full text-center py-20 text-gray-500">
 No articles found matching your search.
 </div>
 )}
 </div>
 )}
 </div>
 );
}

function ArticleCard({ post, index }: { post: BlogPost, index: number }) {
 const date = post.publishedAt ? formatDate(post.publishedAt, { month: "short", day: "numeric", year: "numeric" }) : "";

 return (
 <Link href={`/blog/${post.slug}`} className="group relative flex flex-col rounded-2xl border border-white/[0.05] bg-white/[0.02] overflow-hidden hover:border-gray-200 transition-all duration-500">
 <div className="aspect-[16/10] w-full bg-gray-50 overflow-hidden relative">
 {post.coverImage ? (
 <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
 ) : (
 <div className="w-full h-full bg-gray-50 flex items-center justify-center">
 <span className="text-white/5 font-black text-4xl tracking-tighter uppercase italic">Article</span>
 </div>
 )}
 <div className="absolute top-4 left-4 flex gap-2">
 {post.tags.slice(0, 1).map(tag => (
 <Badge key={tag} variant="secondary" className="bg-white text-white/70 border-gray-200 text-[9px] h-5 uppercase tracking-widest font-bold">
 {tag}
 </Badge>
 ))}
 </div>
 </div>

 <div className="p-8 flex flex-col flex-1">
 <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.25em] mb-5">{date}</div>
 <h3 className="text-2xl font-bold text-white mb-4 line-clamp-2 leading-[1.2] tracking-tight">
 {post.title}
 </h3>
 <p className="text-sm text-gray-600 font-medium line-clamp-2 mb-8 leading-relaxed">
 {post.excerpt}
 </p>

 <div className="flex items-center text-[11px] font-bold uppercase tracking-[0.2em] text-white opacity-50 group-hover:opacity-100 transition-all duration-500 mt-auto">
 Full Story <ArrowRight strokeWidth={1.5} className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-2" />
 </div>
 </div>
 </Link>
 );
}
