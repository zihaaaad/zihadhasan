"use client";

import { useEffect, useState } from "react";
import { CMSService, Book } from "@/lib/cms-service";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, BookOpen, ExternalLink } from "lucide-react";
import { GlassCard } from "@/components/shared/glass-card";
import Link from "next/link";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/format";

export default function AdminBooksPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBooks();
    }, []);

    const loadBooks = async () => {
        setLoading(true);
        const data = await CMSService.getBooks(false); // get all including unpublished
        setBooks(data);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? This will soft-delete the book.")) return;
        try {
            await CMSService.deleteBook(id);
            toast.success("Book deleted");
            loadBooks();
        } catch (e) {
            toast.error("Failed to delete");
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Library Management</h1>
                    <p className="text-neutral-500">Add and manage your e-books and hardcopies.</p>
                </div>
                <Link href="/dashboard/books/create">
                    <Button className="bg-white text-black hover:bg-neutral-200 rounded-xl h-12 px-6 font-bold uppercase tracking-widest text-[10px]">
                        <Plus className="mr-2 h-4 w-4" /> Add New Title
                    </Button>
                </Link>
            </div>

            {loading ? (
                <div className="text-center py-20 text-neutral-500 animate-pulse uppercase tracking-widest text-xs font-bold">Syncing Library...</div>
            ) : (
                <div className="grid gap-6">
                    {books.map((book) => (
                        <GlassCard key={book.id} className="p-6 flex items-center justify-between border-white/[0.05] bg-white/[0.02] hover:border-white/20 transition-all duration-500 rounded-3xl group">
                            <div className="flex items-center gap-6">
                                <div className="h-20 w-16 rounded-lg bg-neutral-900 border border-white/10 overflow-hidden shrink-0">
                                    {book.imageUrl ? (
                                        <img src={book.imageUrl} alt="" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center"><BookOpen className="h-6 w-6 text-white/10" /></div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white tracking-tight mb-1">{book.title}</h3>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${book.published ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-neutral-500/10 text-neutral-500 border border-neutral-500/20'}`}>
                                            {book.published ? 'Live' : 'Draft'}
                                        </span>
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-600">
                                            {book.type} • {formatCurrency(book.price)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Link href={`/books/${book.slug}`} target="_blank">
                                    <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 text-neutral-500 hover:text-white hover:bg-white/5">
                                        <ExternalLink className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <Link href={`/dashboard/books/edit?id=${book.id}`}>
                                    <Button variant="outline" size="icon" className="rounded-xl h-10 w-10 border-white/5 hover:bg-white/5">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <Button onClick={() => handleDelete(book.id!)} variant="ghost" size="icon" className="rounded-xl h-10 w-10 text-red-500/50 hover:text-red-500 hover:bg-red-500/5">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            )}
        </div>
    );
}
