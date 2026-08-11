"use client";

import { useEffect, useState } from "react";
import { CMSService, Book } from "@/lib/cms-service";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, BookOpen, ExternalLink } from "lucide-react";
import { GlassCard } from "@/components/shared/glass-card";
import Link from "next/link";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/format";
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

export default function AdminBooksPage() {
 const [books, setBooks] = useState<Book[]>([]);
 const [loading, setLoading] = useState(true);
 const [deletingId, setDeletingId] = useState<string | null>(null);

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
 try {
 await CMSService.deleteBook(id);
 toast.success("Book deleted");
 setDeletingId(null);
 loadBooks();
 } catch (e) {
 toast.error("Failed to delete");
 }
 };

 return (
 <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Library Management</h1>
          <p className="text-muted-foreground font-medium">Add and manage your e-books and hardcopies.</p>
        </div>
        <Link href="/dashboard/books/create">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-12 px-6 font-bold uppercase tracking-widest text-[10px]">
            <Plus className="mr-2 h-4 w-4" /> Add New Title
          </Button>
        </Link>
      </div>

 {loading ? (
 <div className="text-center py-20 text-muted-foreground animate-pulse uppercase tracking-widest text-xs font-bold">Syncing Library...</div>
 ) : (
 <div className="grid gap-6">
          {books.map((book) => (
            <div key={book.id} className="p-6 flex items-center justify-between border-border bg-background hover:border-gray-300 shadow-sm transition-all duration-500 rounded-3xl group border">
              <div className="flex items-center gap-6">
                <div className="h-20 w-16 rounded-lg bg-gray-100 border border-border overflow-hidden shrink-0">
                  {book.imageUrl ? (
                    <img src={book.imageUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center"><BookOpen className="h-6 w-6 text-muted-foreground/80" /></div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground tracking-tight mb-1">{book.title}</h3>
                  <div className="flex items-center gap-3">
                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${book.published ? 'bg-gray-100 text-foreground border border-border' : 'bg-gray-50 text-muted-foreground border border-border'}`}>
                      {book.published ? 'Live' : 'Draft'}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                      {book.type} • {formatCurrency(book.price)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link href={`/books/${book.slug}`} target="_blank">
                  <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-gray-100">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/dashboard/books/edit?id=${book.id}`}>
                  <Button variant="outline" size="icon" className="rounded-xl h-10 w-10 border-border hover:bg-gray-50 text-foreground">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
                <Button onClick={() => book.id && setDeletingId(book.id)} variant="ghost" size="icon" className="rounded-xl h-10 w-10 text-red-500 hover:text-red-600 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
 </div>
 )}

 <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
 <AlertDialogContent>
 <AlertDialogHeader>
 <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
 <AlertDialogDescription>
 This will soft-delete the book. It can be restored from the trash bin on the System page until it's permanently purged.
 </AlertDialogDescription>
 </AlertDialogHeader>
 <AlertDialogFooter>
 <AlertDialogCancel>Cancel</AlertDialogCancel>
 <AlertDialogAction
 onClick={() => deletingId && handleDelete(deletingId)}
 className="bg-red-600 hover:bg-red-700 text-primary-foreground"
 >
 Delete Book
 </AlertDialogAction>
 </AlertDialogFooter>
 </AlertDialogContent>
 </AlertDialog>
 </div>
 );
}
