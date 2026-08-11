"use client";

import { useEffect, useState } from "react";
import { CMSService, Book } from "@/lib/cms-service";
import { Button } from "@/components/ui/button";
import { BookOpen, Download, ShoppingCart, Eye, Lock } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/format";

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
    <div className="min-h-screen bg-background text-foreground pt-32 pb-24 font-sans">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="mb-16 border-b border-border pb-10">
          <div className="text-[10px] font-mono font-bold tracking-widest text-muted-foreground/80 uppercase mb-4">
            / index / books
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4"
          >
            Published <span className="text-foreground italic font-serif opacity-80">Works</span>
          </motion.h1>
          <p className="text-lg text-muted-foreground font-medium max-w-2xl leading-relaxed">
            Explore my collection of books on Generative AI, Digital Literacy, and Modern Engineering.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[500px] rounded-[1.5rem] bg-gray-50 border border-border" />
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
                <div className="h-full p-0 overflow-hidden flex flex-col group hover:shadow-lg border border-border bg-background rounded-[1.5rem] transition-all duration-300">
                  <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden border-b border-gray-100">
                    {book.imageUrl ? (
                      <img
                        src={book.imageUrl}
                        alt={book.title}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-300">
                        <BookOpen className="h-20 w-20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent" />
                    
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1.5 bg-background text-[9px] font-bold text-foreground rounded-lg border border-border shadow-sm uppercase tracking-widest">
                        {book.type === 'both' ? 'Print + Ebook' : book.type}
                      </span>
                    </div>
                  </div>

                  <div className="p-8 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-foreground tracking-tight mb-3 leading-tight line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-muted-foreground text-sm font-medium line-clamp-2 mb-8 leading-relaxed">
                      {book.description}
                    </p>

                    <div className="mt-auto space-y-5">
                      <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/80">Starting from</span>
                          <span className="text-lg font-bold text-foreground tracking-tight">{formatCurrency(book.price)}</span>
                        </div>
                        <Link href={`/books/${book.slug}`}>
                          <Button variant="outline" size="sm" className="rounded-lg h-10 px-5 text-[10px] font-bold uppercase tracking-widest border-border text-gray-600 hover:text-foreground hover:bg-gray-50 shadow-sm">
                            Details <Eye className="ml-2 h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <Button className="rounded-lg h-12 text-[10px] font-bold uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm">
                          Order <ShoppingCart className="ml-2 h-3.5 w-3.5" />
                        </Button>
                        <Link href={`/books/${book.slug}/preview`} className="w-full">
                          <Button variant="secondary" className="w-full rounded-lg h-12 text-[10px] font-bold uppercase tracking-widest bg-gray-50 text-gray-700 border border-border hover:bg-gray-100 hover:text-foreground shadow-sm">
                            Preview <BookOpen className="ml-2 h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border border-dashed border-border rounded-[2rem] bg-gray-50/50">
            <BookOpen className="h-10 w-10 text-gray-300 mx-auto mb-4" />
            <p className="text-muted-foreground uppercase tracking-widest text-xs font-bold">New titles arriving soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
