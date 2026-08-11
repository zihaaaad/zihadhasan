"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
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
    // Sort alphabetically but keep "All" at the start
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
    <div className="min-h-screen bg-background text-foreground pt-32 pb-24 font-sans">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-20 text-center border-b border-border pb-10">
          <div className="text-[10px] font-mono font-bold tracking-widest text-muted-foreground/80 uppercase mb-4 inline-block">
            / index / tools
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6"
          >
            AI <span className="text-foreground italic font-serif opacity-80">Curations</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed"
          >
            A curated selection of cutting-edge artificial intelligence tools, benchmarked and verified for production environments.
          </motion.p>
        </div>

        {/* Controls */}
        <div className="mb-16 flex flex-col md:flex-row md:items-center gap-6 justify-between bg-gray-50/50 p-6 rounded-[2rem] border border-border">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 order-2 md:order-1 flex-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border shadow-sm",
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-gray-600 border-border hover:bg-gray-100 hover:text-foreground hover:border-gray-300"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:max-w-xs order-1 md:order-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/80" />
            <Input
              placeholder="FILTER BY NAME..."
              className="pl-12 h-12 bg-background border border-border text-foreground rounded-xl focus-visible:ring-1 focus-visible:ring-gray-300 text-[10px] font-bold uppercase tracking-widest placeholder:text-muted-foreground/80 shadow-sm transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-24 text-muted-foreground/80 uppercase tracking-widest text-xs font-bold animate-pulse border border-dashed border-border rounded-[2rem] bg-gray-50/50">
            Initializing Directory...
          </div>
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
                                       <div className="relative h-full flex flex-col overflow-hidden rounded-[1.5rem] border border-border bg-background transition-all duration-300 hover:shadow-xl hover:border-gray-300">
                      
                      <div className="p-8 flex flex-col h-full">
                        <div className="flex items-start justify-between mb-8">
                          <div className="h-16 w-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl font-bold text-muted-foreground/80 group-hover:text-foreground group-hover:border-gray-300 transition-all duration-500 overflow-hidden shadow-sm">
                            {tool.imageUrl ? (
                              <img src={tool.imageUrl} alt={tool.name} className="h-full w-full object-cover" />
                            ) : (
                              tool.name.substring(0, 1)
                            )}
                          </div>
                          <div className="px-3 py-1.5 bg-gray-50 text-[9px] font-bold text-muted-foreground uppercase tracking-widest rounded-lg border border-border shadow-sm">
                            {tool.category}
                          </div>
                        </div>

                        <h3 className="text-2xl font-bold text-foreground mb-3 tracking-tight group-hover:text-gray-900 transition-colors duration-300">
                          {tool.name}
                        </h3>

                        <p className="text-sm text-muted-foreground font-medium line-clamp-3 mb-8 flex-1 leading-relaxed">
                          {tool.description}
                        </p>

                        <div className="flex items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 group-hover:text-foreground transition-colors duration-300 mt-auto pt-5 border-t border-gray-100">
                          Launch Tool <ExternalLink className="ml-2 h-3.5 w-3.5" />
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
          <div className="text-center py-24 border border-dashed border-border rounded-[2rem] bg-gray-50/50">
            <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">No tools found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
