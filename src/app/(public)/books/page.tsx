"use client";

import { useEffect, useState } from "react";
import { CMSService, Book } from "@/lib/cms-service";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { BookOpen, Download, ShoppingCart, Eye, Lock } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export default function BooksPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const data = await CMSService.getBooks();
                setBooks(data);
            } catch (error) {
                console.error("Failed to load books", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, []);

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="mb-20">
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl mb-4"
                >
                    Published <span className="text-primary italic font-serif">Works</span>
                </motion.h1>
                <p className="text-lg text-neutral-500 font-medium max-w-2xl leading-relaxed">
                    Explore my collection of books on Generative AI, Digital Literacy, and Modern Engineering.
                </p>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-[500px] rounded-[2rem] bg-white/5" />
                    ))}
                </div>
            ) : books.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {books.map((book, index) => (
                        <motion.div
                            key={book.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <GlassCard className="h-full p-0 overflow-hidden flex flex-col group hover:border-white/20 transition-all duration-700 shadow-none border-white/[0.05] bg-white/[0.02] rounded-[2rem]">
                                <div className="relative aspect-[3/4] bg-neutral-900 overflow-hidden">
                                    {book.imageUrl ? (
                                        <img
                                            src={book.imageUrl}
                                            alt={book.title}
                                            className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 ease-out group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-white/5">
                                            <BookOpen className="h-20 w-20" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                                    
                                    <div className="absolute top-6 left-6">
                                        <span className="px-3 py-1 bg-white/10 backdrop-blur-xl text-[9px] font-bold text-white/80 rounded-full border border-white/5 uppercase tracking-widest">
                                            {book.type === 'both' ? 'Print + Ebook' : book.type}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-8 flex flex-col flex-1">
                                    <h3 className="text-2xl font-bold text-white tracking-tight mb-3 leading-tight line-clamp-2">
                                        {book.title}
                                    </h3>
                                    <p className="text-neutral-500 text-sm font-medium line-clamp-2 mb-8 leading-relaxed">
                                        {book.description}
                                    </p>

                                    <div className="mt-auto space-y-6">
                                        <div className="flex items-center justify-between pt-6 border-t border-white/[0.05]">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Starting from</span>
                                                <span className="text-xl font-bold text-white tracking-tight">৳{book.price}</span>
                                            </div>
                                            <Link href={`/books/${book.slug}`}>
                                                <Button variant="outline" size="sm" className="rounded-xl h-10 px-6 text-[10px] font-bold uppercase tracking-widest">
                                                    Details <Eye className="ml-2 h-3 w-3" />
                                                </Button>
                                            </Link>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-3">
                                            <Button className="rounded-xl h-12 text-[10px] font-bold uppercase tracking-widest bg-white text-black hover:bg-neutral-200">
                                                Order Now <ShoppingCart className="ml-2 h-3 w-3" />
                                            </Button>
                                            <Link href={`/books/${book.slug}/preview`} className="w-full">
                                                <Button variant="secondary" className="w-full rounded-xl h-12 text-[10px] font-bold uppercase tracking-widest bg-white/[0.03] text-white border-white/[0.05]">
                                                    Preview <BookOpen className="ml-2 h-3 w-3" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 border border-dashed border-white/[0.05] rounded-[2rem] bg-white/[0.02]">
                    <BookOpen className="h-12 w-12 text-neutral-800 mx-auto mb-4" />
                    <p className="text-neutral-500 uppercase tracking-widest text-xs font-bold">New titles arriving soon.</p>
                </div>
            )}
        </div>
    );
}
