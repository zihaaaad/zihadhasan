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
    <div className="min-h-screen pt-32 pb-20 container mx-auto px-4 lg:px-8 bg-white text-black">
      <div className="mb-16">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold tracking-tight text-black sm:text-5xl lg:text-6xl mb-6"
        >
          Latest <span className="text-gray-400 italic font-serif">Articles</span>
        </motion.h1>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 pb-8">
          <p className="text-gray-500 text-lg font-medium max-w-xl">
            Deep dives into software engineering, artificial intelligence, and the philosophy of digital craftsmanship.
          </p>

          <div className="relative w-full md:w-80">
            <Search strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search archive..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-12 bg-gray-50 border-gray-200 text-black rounded-lg focus-visible:ring-1 focus-visible:ring-gray-300 text-xs font-semibold placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
              <Skeleton className="aspect-[16/10] w-full bg-gray-100" />
              <div className="p-6 space-y-4">
                <Skeleton className="h-3 w-24 bg-gray-200" />
                <Skeleton className="h-6 w-3/4 bg-gray-200" />
                <Skeleton className="h-4 w-full bg-gray-100" />
                <Skeleton className="h-4 w-5/6 bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post, index) => (
            <ArticleCard key={post.id} post={post} index={index} />
          ))}

          {filteredPosts.length === 0 && (
            <div className="col-span-full text-center py-24 text-gray-500 bg-gray-50 rounded-xl border border-gray-200 border-dashed">
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
    <Link href={`/blog/${post.slug}`} className="group relative flex flex-col rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="aspect-[16/10] w-full bg-gray-100 overflow-hidden relative border-b border-gray-100">
        {post.coverImage ? (
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-300 font-black text-3xl tracking-tighter uppercase italic">Article</span>
          </div>
        )}
        <div className="absolute top-4 left-4 flex gap-2">
          {post.tags.slice(0, 1).map(tag => (
            <Badge key={tag} variant="secondary" className="bg-white/90 backdrop-blur-sm text-black border-gray-200 text-[10px] h-6 px-3 uppercase tracking-wider font-bold shadow-sm">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">{date}</div>
        <h3 className="text-xl font-bold text-black mb-3 line-clamp-2 leading-snug tracking-tight group-hover:text-gray-600 transition-colors">
          {post.title}
        </h3>
        <p className="text-sm text-gray-500 font-medium line-clamp-2 mb-6 leading-relaxed">
          {post.excerpt}
        </p>

        <div className="flex items-center text-xs font-bold text-black mt-auto">
          Read Article <ArrowRight strokeWidth={2} className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
