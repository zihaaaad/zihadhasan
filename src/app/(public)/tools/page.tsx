"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/shared/glass-card";
import { Badge } from "@/components/ui/badge";
import { CMSService, Tool } from "@/lib/cms-service";
import { cn } from "@/lib/utils";

import { useMemo } from "react";

export default function ToolsPage() {
 const [tools, setTools] = useState<Tool[]>([]);
 const [loading, setLoading] = useState(true);
 const [search, setSearch] = useState("");
 const [activeCategory, setActiveCategory] = useState("All");

 useEffect(() => {
 async function fetchTools() {
 try {
 const data = await CMSService.getTools();
 setTools(data);
 } catch (error) {
 console.error("Error fetching tools:", error);
 } finally {
 setLoading(false);
 }
 }
 fetchTools();
 }, []);

 // Dynamically extract categories from the fetched tools
 const categories = useMemo(() => {
 const uniqueCategories = Array.from(new Set(tools.map(t => t.category).filter(Boolean)));
 // Sort alphabetically but keep "All" at the start (implied by separate array logic)
 uniqueCategories.sort();
 return ["All", ...uniqueCategories];
 }, [tools]);

 const filteredTools = tools.filter((tool) => {
 const matchesSearch = tool.name.toLowerCase().includes(search.toLowerCase()) ||
 (tool.description || "").toLowerCase().includes(search.toLowerCase());
 const matchesCategory = activeCategory === "All" || tool.category === activeCategory;
 return matchesSearch && matchesCategory;
 });

 return (
 <div className="min-h-screen pt-24 pb-20 container mx-auto px-4">
 {/* Header */}
 <div className="mb-20">
 <motion.h1
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl mb-4"
 >
 AI <span className="text-primary italic font-serif">Curations</span>
 </motion.h1>
 <motion.p
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.1 }}
 className="text-lg text-gray-500 font-medium max-w-2xl leading-relaxed"
 >
 A curated selection of cutting-edge artificial intelligence tools, benchmarked and verified for production environments.
 </motion.p>
 </div>

 {/* Controls */}
 <div className="mb-16 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
 {/* Search */}
 <div className="relative w-full max-w-md">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
 <Input
 placeholder="FILTER BY TOOL..."
 className="pl-11 h-12 bg-white/[0.03] border-white/[0.05] text-white rounded-xl focus-visible:ring-primary/20 text-[10px] font-bold uppercase tracking-widest"
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 />
 </div>

 {/* Categories */}
 <div className="flex flex-wrap gap-3">
 {categories.map((cat) => (
 <button
 key={cat}
 onClick={() => setActiveCategory(cat)}
 className={cn(
 "px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-500 border",
 activeCategory === cat
 ? "bg-white text-black border-white shadow-xl"
 : "bg-white/[0.02] text-gray-500 border-white/[0.05] hover:bg-white/[0.05] hover:text-white"
 )}
 >
 {cat}
 </button>
 ))}
 </div>
 </div>

 {/* Grid */}
 {loading ? (
 <div className="text-center py-20 text-gray-500 uppercase tracking-widest text-xs font-bold animate-pulse">Initializing Directory...</div>
 ) : (
 <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
 <AnimatePresence mode="popLayout">
 {filteredTools.map((tool) => (
 <motion.div
 key={tool.id}
 layout
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95 }}
 transition={{ duration: 0.4 }}
 >
 <a href={tool.url} target="_blank" rel="noopener noreferrer" className="block h-full group">
 <div className="relative h-full flex flex-col overflow-hidden rounded-[2rem] border border-white/[0.05] bg-white/[0.02] transition-all duration-500 hover:border-gray-200">

 <div className="p-8 flex flex-col h-full">
 <div className="flex items-start justify-between mb-8">
 <div className="h-14 w-14 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-2xl font-bold text-neutral-700 group-hover:text-primary transition-all duration-500 overflow-hidden">
 {tool.imageUrl ? (
 <img src={tool.imageUrl} alt={tool.name} className="h-full w-full object-cover" />
 ) : (
 tool.name.substring(0, 1)
 )}
 </div>
 <div className="px-3 py-1 bg-white/[0.03] text-[9px] font-bold text-gray-500 uppercase tracking-widest rounded-full border border-white/[0.05]">
 {tool.category}
 </div>
 </div>

 <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-primary transition-colors duration-300">
 {tool.name}
 </h3>

 <p className="text-sm text-gray-500 font-medium line-clamp-3 mb-8 flex-1 leading-relaxed">
 {tool.description}
 </p>

 <div className="flex items-center text-[10px] font-bold uppercase tracking-widest text-white/30 group-hover:text-primary transition-colors duration-300 mt-auto">
 Launch Tool <ExternalLink className="ml-2 h-3 w-3" />
 </div>
 </div>
 </div>
 </a>
 </motion.div>
 ))}
 </AnimatePresence>
 </div>
 )}

 {!loading && filteredTools.length === 0 && (
 <div className="text-center py-20">
 <p className="text-muted-foreground">No tools found. Add some via the Dashboard!</p>
 </div>
 )}
 </div>
 );
}
