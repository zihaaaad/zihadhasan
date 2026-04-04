"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Loader2, BookOpen, PenTool, Layout, Calendar } from "lucide-react";
import { CMSService, BlogPost, Project, Course, Event } from "@/lib/cms-service";
import { cn } from "@/lib/utils";

interface SearchResult {
    id: string;
    type: 'course' | 'project' | 'blog' | 'event';
    title: string;
    description?: string;
    url: string;
}

export function SearchCommand() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Cache
    const [allData, setAllData] = useState<SearchResult[]>([]);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    // Prefetch data when opened or on mount appropriately
    useEffect(() => {
        if (open && allData.length === 0) {
            setLoading(true);
            Promise.all([
                CMSService.getPublishedCourses(),
                CMSService.getProjects(),
                CMSService.getPosts(true), // Only published
                CMSService.getEvents()     // Potentially verify published/upcoming logic if needed
            ]).then(([courses, projects, posts, events]) => {
                const standardized: SearchResult[] = [
                    ...courses.map((c: Course) => ({
                        id: c.id!, type: 'course' as const, title: c.title, description: c.description, url: `/courses/view?id=${c.id}`
                    })),
                    ...projects.map((p: Project) => ({
                        id: p.id!, type: 'project' as const, title: p.title, description: p.description, url: p.liveLink || p.githubLink || '/projects' // fallback
                    })),
                    ...posts.map((p: BlogPost) => ({
                        id: p.id!, type: 'blog' as const, title: p.title, description: p.excerpt, url: `/blog/view?id=${p.id}`
                    })),
                    ...events.map((e: Event) => ({
                        id: e.id!, type: 'event' as const, title: e.title, description: e.description, url: '/events' // fallback or specific
                    }))
                ];
                setAllData(standardized);
                setLoading(false);
            }).catch(err => {
                console.error("Search fetch failed", err);
                setLoading(false);
            });
        }
    }, [open, allData.length]);

    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }

        const lower = query.toLowerCase();
        const filtered = allData.filter(item =>
            item.title.toLowerCase().includes(lower) ||
            (item.description && item.description.toLowerCase().includes(lower))
        ).slice(0, 5); // Limit 5

        setResults(filtered);
    }, [query, allData]);

    const handleSelect = (url: string) => {
        setOpen(false);
        if (url.startsWith("http")) {
            window.open(url, "_blank");
        } else {
            router.push(url);
        }
    };

    const getIcon = (type: string) => {
        const props = { strokeWidth: 1.5, className: "h-4 w-4" };
        switch (type) {
            case 'course': return <BookOpen {...props} />;
            case 'project': return <Layout {...props} />;
            case 'blog': return <PenTool {...props} />;
            case 'event': return <Calendar {...props} />;
            default: return <Search {...props} />;
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="p-0 gap-0 bg-black border-white/10 sm:max-w-[550px] shadow-2xl backdrop-blur-3xl rounded-3xl overflow-hidden">
                    <DialogHeader className="p-6 border-b border-white/5 bg-white/[0.02]">
                        <DialogTitle className="sr-only">Search</DialogTitle>
                        <div className="flex items-center gap-4 px-2">
                            <Search strokeWidth={1.5} className="h-5 w-5 text-neutral-500" />
                            <Input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search everything..."
                                className="border-0 bg-transparent text-xl focus-visible:ring-0 placeholder:text-neutral-600 h-auto p-0 text-white font-medium tracking-tight"
                                autoFocus
                            />
                            {loading && <Loader2 className="h-5 w-5 animate-spin text-white/20" />}
                        </div>
                    </DialogHeader>

                    <div className="max-h-[400px] overflow-y-auto p-3 bg-black">
                        {results.length > 0 ? (
                            <div className="space-y-1">
                                {results.map((result) => (
                                    <button
                                        key={`${result.type}-${result.id}`}
                                        onClick={() => handleSelect(result.url)}
                                        className="w-full text-left px-5 py-4 rounded-2xl hover:bg-white/5 active:bg-white/10 transition-all duration-300 group flex items-start gap-5"
                                    >
                                        <div className={cn(
                                            "mt-1 p-2.5 rounded-xl bg-white/5 text-neutral-500 group-hover:text-white group-hover:bg-white/10 transition-all duration-500"
                                        )}>
                                            {getIcon(result.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-base font-bold text-white truncate group-hover:translate-x-1 transition-transform duration-500">
                                                {result.title}
                                            </h4>
                                            <p className="text-xs text-neutral-500 truncate mt-1 font-medium">
                                                {result.description}
                                            </p>
                                        </div>
                                        <span className="text-[9px] uppercase font-black tracking-[0.2em] text-neutral-600 group-hover:text-neutral-400 self-center bg-white/5 px-2 py-1 rounded-md transition-colors">
                                            {result.type}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        ) : query ? (
                            <div className="py-20 text-center flex flex-col items-center gap-4">
                                <div className="p-4 bg-white/5 rounded-full">
                                    <Search strokeWidth={1.5} className="h-8 w-8 text-neutral-700" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-white font-bold">No results found</p>
                                    <p className="text-sm text-neutral-500">We couldn't find anything matching "{query}"</p>
                                </div>
                            </div>
                        ) : (
                            <div className="py-20 text-center flex flex-col items-center gap-4">
                                <div className="p-4 bg-white/5 rounded-full">
                                    <Search strokeWidth={1.5} className="h-8 w-8 text-neutral-800" />
                                </div>
                                <p className="text-sm text-neutral-600 font-medium tracking-wide uppercase">
                                    Type to explore the platform
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="p-4 border-t border-white/5 bg-white/[0.03] flex justify-between items-center px-6">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">Navigation</span>
                            <div className="h-px w-8 bg-white/10" />
                        </div>
                        <div className="flex gap-3">
                            <kbd className="pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded-md border border-white/10 bg-black px-2 font-mono text-[10px] font-bold text-neutral-500 uppercase">
                                esc
                            </kbd>
                            <span className="text-[10px] font-bold text-neutral-700 uppercase tracking-widest self-center">to close</span>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
