"use client";

import { useEffect, useState } from "react";
import { CMSService, Book } from "@/lib/cms-service";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, ShieldCheck, ShoppingCart, Eye } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/components/auth/auth-provider";
import { GlassCard } from "@/components/shared/glass-card";
import { AssetPurchaseModal } from "@/components/shared/asset-purchase-modal";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/format";

interface BookDetailsClientProps {
 book: Book;
 initialPurchaseStatus: boolean;
}

export default function BookDetailsClient({ book, initialPurchaseStatus }: BookDetailsClientProps) {
 const { user, openAuthModal } = useAuth();
 const [hasPurchased, setHasPurchased] = useState(initialPurchaseStatus);
 const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

 useEffect(() => {
 if (user && !initialPurchaseStatus) {
 CMSService.getUserProductPurchase(user.uid, book.id!).then((purchase) => {
 setHasPurchased(!!purchase);
 });
 }
 }, [user, book.id, initialPurchaseStatus]);

 const handlePurchaseClick = () => {
 if (!user) {
 toast.error("Authentication required");
 openAuthModal();
 return;
 }
 setIsPurchaseModalOpen(true);
 };

 return (
 <div className="min-h-screen pt-24 pb-20 container mx-auto px-4 max-w-7xl">
 <Link href="/books" className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white mb-12 transition-colors">
 <ArrowLeft className="mr-2 h-3.5 w-3.5" /> Back to Library
 </Link>

 <div className="grid lg:grid-cols-12 gap-16 items-start">
 {/* Left: Book Cover */}
 <div className="lg:col-span-5">
 <motion.div
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 className="relative aspect-[3/4] w-full rounded-[2.5rem] overflow-hidden border border-white/[0.05] bg-gray-50"
 >
 {book.imageUrl ? (
 <img src={book.imageUrl} alt={book.title} className="w-full h-full object-cover grayscale-0" />
 ) : (
 <div className="flex items-center justify-center h-full text-white/5">
 <BookOpen className="h-20 w-20" />
 </div>
 )}
 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
 </motion.div>
 </div>

 {/* Right: Details */}
 <div className="lg:col-span-7 flex flex-col gap-10">
 <div>
 <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
 {book.title}
 </h1>
 <div className="flex items-center gap-4 text-primary text-[10px] font-bold uppercase tracking-widest mb-8">
 <span>Author: {book.author}</span>
 <span>•</span>
 <span>Edition 2024</span>
 </div>
 <p className="text-gray-500 text-lg font-medium leading-relaxed max-w-2xl">
 {book.description}
 </p>
 </div>

 <div className="grid sm:grid-cols-2 gap-6">
 <GlassCard className="bg-white/[0.01] border-white/[0.05] p-8 flex flex-col gap-4 rounded-3xl">
 <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">E-Book Edition</span>
 <div className="flex items-end gap-2">
 <span className="text-3xl font-bold text-white tracking-tight">{formatCurrency(book.price)}</span>
 <span className="text-gray-800 text-xs mb-1 line-through">{formatCurrency(book.price + 100)}</span>
 </div>
 <ul className="text-xs font-semibold text-gray-500 space-y-2 mt-2">
 <li className="flex items-center gap-2"><ShieldCheck className="h-3 w-3 text-primary" /> Instant System Access</li>
 <li className="flex items-center gap-2"><ShieldCheck className="h-3 w-3 text-primary" /> Lifetime Updates</li>
 <li className="flex items-center gap-2"><ShieldCheck className="h-3 w-3 text-primary" /> Piracy Protected</li>
 </ul>
 </GlassCard>

 {book.hardcopyPrice && (
 <GlassCard className="bg-white/[0.01] border-white/[0.05] p-8 flex flex-col gap-4 rounded-3xl">
 <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Hardcopy Print</span>
 <div className="flex items-end gap-2">
 <span className="text-3xl font-bold text-white tracking-tight">{formatCurrency(book.hardcopyPrice)}</span>
 </div>
 <ul className="text-xs font-semibold text-gray-500 space-y-2 mt-2">
 <li className="flex items-center gap-2"><ShieldCheck className="h-3 w-3 text-primary" /> Premium Paper</li>
 <li className="flex items-center gap-2"><ShieldCheck className="h-3 w-3 text-primary" /> Island-wide Delivery</li>
 <li className="flex items-center gap-2"><ShieldCheck className="h-3 w-3 text-primary" /> Author Signature</li>
 </ul>
 </GlassCard>
 )}
 </div>

 <div className="flex flex-col sm:flex-row gap-4 pt-6">
 {hasPurchased ? (
 <Link href={`/books/${book.slug}/read`}>
 <Button size="lg" className="rounded-xl h-14 px-10 text-[11px] font-bold uppercase tracking-[0.2em] bg-white text-black hover:bg-neutral-200">
 Read Online Now <BookOpen className="ml-2 h-4 w-4" />
 </Button>
 </Link>
 ) : (
 <>
 <Button size="lg" onClick={handlePurchaseClick} className="rounded-xl h-14 px-10 text-[11px] font-bold uppercase tracking-[0.2em] bg-white text-black hover:bg-neutral-200">
 Acquire Full Edition <ShoppingCart className="ml-2 h-4 w-4" />
 </Button>
 <Link href={`/books/${book.slug}/preview`}>
 <Button variant="outline" size="lg" className="rounded-xl h-14 px-10 text-[11px] font-bold uppercase tracking-[0.2em]">
 Read Preview <Eye className="ml-2 h-4 w-4" />
 </Button>
 </Link>
 </>
 )}
 </div>
 </div>
 </div>

 {book && (
 <AssetPurchaseModal
 open={isPurchaseModalOpen}
 onOpenChange={setIsPurchaseModalOpen}
 asset={book}
 type="book"
 />
 )}
 </div>
 );
}
