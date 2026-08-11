"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Download, Lock } from "lucide-react";
import { Product, CMSService } from "@/lib/cms-service";
import { Button } from "@/components/ui/button";
import { PurchaseModal } from "@/components/shop/purchase-modal";
import { Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/format";

export default function ShopPage() {
 const [products, setProducts] = useState<Product[]>([]);
 const [loading, setLoading] = useState(true);
 const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
 const [showModal, setShowModal] = useState(false);

 useEffect(() => {
 const fetchProducts = async () => {
 try {
 const data = await CMSService.getPublishedProducts();
 setProducts(data);
 } catch (error) {
 console.error("Failed to fetch products", error);
 } finally {
 setLoading(false);
 }
 };
 fetchProducts();
 }, []);

 const handleBuy = (product: Product) => {
 setSelectedProduct(product);
 setShowModal(true);
 };

 if (loading) {
 return (
 <div className="flex min-h-screen items-center justify-center bg-black">
 <Loader2 className="h-8 w-8 animate-spin text-primary" />
 </div>
 );
 }

 return (
 <main className="min-h-screen bg-black px-4 py-24 md:px-8">
 <div className="container mx-auto max-w-7xl px-4">
 {/* Header */}
 <div className="mb-20">
 <motion.h1
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl"
 >
 Digital <span className="text-primary italic font-serif">Assets</span>
 </motion.h1>
 <motion.p
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 transition={{ delay: 0.1 }}
 className="max-w-2xl text-lg text-gray-500 font-medium leading-relaxed"
 >
 Premium source codes, architecture patterns, and tools designed to accelerate your development workflow.
 </motion.p>
 </div>

 {/* Product Grid (Refined Bento Style) */}
 <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
 {products.map((product, i) => (
 <motion.div
 key={product.id}
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: i * 0.05 }}
 className={`group relative overflow-hidden rounded-[2rem] border border-white/[0.05] bg-white/[0.02] transition-all duration-700 hover:border-gray-200 h-[500px] flex flex-col ${i === 0 ? "md:col-span-2 lg:col-span-2" : ""
 }`}
 >
 {/* Image Background */}
 <div className="absolute inset-0 z-0">
 {product.imageUrl ? (
 <img
 src={product.imageUrl}
 alt={product.title}
 className="h-full w-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-1000 ease-out group-hover:scale-110"
 />
 ) : (
 <div className="h-full w-full bg-gray-50" />
 )}
 <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
 </div>

 {/* Content */}
 <div className="absolute inset-0 z-10 flex flex-col justify-end p-10">
 <div className="mb-8">
 <div className="mb-4 inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white/70 ">
 {product.type === 'digital' ? <Download className="mr-2 h-3 w-3" /> : <ShoppingBag className="mr-2 h-3 w-3" />}
 {product.type}
 </div>
 <h3 className="text-3xl font-bold text-white tracking-tight leading-tight">{product.title}</h3>
 <p className="mt-3 line-clamp-2 text-sm text-gray-600 font-medium leading-relaxed">{product.description}</p>
 </div>

 <div className="flex items-center justify-between border-t border-white/[0.05] pt-6">
 <div className="flex flex-col">
 <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Value</span>
 <span className="text-xl font-bold text-white tracking-tight">{formatCurrency(product.price)}</span>
 </div>
 <Button
 onClick={() => handleBuy(product)}
 className="rounded-xl bg-white px-8 h-12 text-[11px] font-bold uppercase tracking-widest text-black hover:bg-neutral-200 transition-all duration-500"
 >
 Acquire Asset
 </Button>
 </div>
 </div>
 </motion.div>
 ))}
 </div>

 {products.length === 0 && (
 <div className="text-center text-gray-500 py-20">
 No products available yet. Check back soon!
 </div>
 )}
 </div>

 {selectedProduct && (
 <PurchaseModal
 open={showModal}
 onOpenChange={setShowModal}
 product={selectedProduct}
 />
 )}
 </main>
 );
}
