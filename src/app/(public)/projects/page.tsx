"use client";

import { 
 Cpu, 
 Globe, 
 Code2, 
 ArrowUpRight, 
 Github, 
 Search, 
 Star, 
 GitFork, 
 Layers, 
 GitBranch, 
 SlidersHorizontal,
 Code,
 Sparkles,
 Calendar
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CMSService, Project } from "@/lib/cms-service";
import githubReposData from "@/data/github-repos.json";

interface GitHubRepo {
 id: number;
 name: string;
 description: string | null;
 html_url: string;
 homepage: string | null;
 stargazers_count: number;
 forks_count: number;
 language: string | null;
 updated_at: string;
 topics: string[];
 private: boolean;
}

// Crisp monochrome and semantic colors (cleaner, no neon blur)
const LANGUAGE_COLORS: Record<string, string> = {
 TypeScript: "bg-neutral-300",
 JavaScript: "bg-neutral-400",
 Python: "bg-neutral-500",
 Dart: "bg-neutral-600",
 HTML: "bg-neutral-700",
 CSS: "bg-gray-100",
};

export default function ProjectsPage() {
 // CMS Case Studies state
 const [projects, setProjects] = useState<Project[]>([]);
 const [projectsLoading, setProjectsLoading] = useState(true);

 // GitHub Repos state
 const [repos, setRepos] = useState<GitHubRepo[]>(githubReposData as any);
 const [reposLoading, setReposLoading] = useState(false);

 // Active tab
 const [activeTab, setActiveTab] = useState<"featured" | "github">("featured");

 // Search and filters for GitHub tab
 const [searchQuery, setSearchQuery] = useState("");
 const [selectedLanguage, setSelectedLanguage] = useState<string>("All");
 const [sortBy, setSortBy] = useState<"stars" | "updated" | "name">("updated");

 useEffect(() => {
 // Fetch custom case studies from Firestore
 async function fetchProjects() {
 try {
 const data = await CMSService.getProjects();
 // Map human-written copy overrides
 const cleanData = data.map(p => {
 if (p.title === "Jontro") {
 p.description = "A package to simplify TypeScript build and compilation workflows.";
 } else if (p.title === "Chuti") {
 p.description = "A simple holiday and leave scheduling system for calendar workflows.";
 } else if (p.title === "Rupantor") {
 p.description = "A TypeScript-based compiler and source-to-source code transformer.";
 }
 return p;
 });
 setProjects(cleanData);
 } catch (error) {
 console.error("Error fetching projects:", error);
 } finally {
 setProjectsLoading(false);
 }
 }
 fetchProjects();
 }, []);

 // Get unique languages from Github repositories
 const availableLanguages = ["All", ...Array.from(new Set(repos.map(r => r.language).filter(Boolean) as string[]))];

 // Filtered and sorted GitHub repositories
 const filteredRepos = repos
 .filter(repo => {
 const matchesSearch = repo.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
 (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()));
 const matchesLanguage = selectedLanguage === "All" || repo.language === selectedLanguage;
 return matchesSearch && matchesLanguage;
 })
 .sort((a, b) => {
 if (sortBy === "stars") return b.stargazers_count - a.stargazers_count;
 if (sortBy === "name") return a.name.localeCompare(b.name);
 return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
 });

 return (
 <div className="min-h-screen bg-black text-white pt-36 pb-24 font-sans">
 <div className="container mx-auto px-6 max-w-6xl">
 {/* Header Section */}
 <div className="mb-16 border-b border-gray-100 pb-12">
 <div className="text-xs font-mono tracking-widest text-gray-500 uppercase mb-4">
 / index / projects
 </div>
 <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
 Case studies & repositories.
 </h1>
 <p className="text-base text-gray-600 max-w-2xl leading-relaxed font-light">
 A clean showcase of system designs, developer tools, and contributions. No filler text, just code.
 </p>
 </div>

 {/* Tab Switcher */}
 <div className="flex justify-start mb-12">
 <div className="flex bg-white p-1 rounded-xl border border-gray-100">
 <button
 onClick={() => setActiveTab("featured")}
 className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-150 ${
 activeTab === "featured"
 ? "bg-gray-50 text-white border border-gray-200"
 : "text-gray-500 hover:text-gray-700"
 }`}
 >
 Featured
 </button>
 <button
 onClick={() => setActiveTab("github")}
 className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-150 ${
 activeTab === "github"
 ? "bg-gray-50 text-white border border-gray-200"
 : "text-gray-500 hover:text-gray-700"
 }`}
 >
 All Repos
 {repos.length > 0 && (
 <span className="ml-1 text-[10px] text-gray-600 font-mono">
 ({repos.length})
 </span>
 )}
 </button>
 </div>
 </div>

 {/* Featured Projects Tab Content */}
 {activeTab === "featured" && (
 <>
 {projectsLoading ? (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 {[1, 2].map(i => (
 <div key={i} className="h-80 rounded-2xl bg-white border border-gray-100 animate-pulse" />
 ))}
 </div>
 ) : projects.length === 0 ? (
 <div className="text-center py-20 border border-gray-100 bg-white rounded-xl">
 <div className="text-gray-800 text-xs font-mono uppercase tracking-wider">No featured projects found</div>
 </div>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 {projects.map((project, i) => (
 <div 
 key={i} 
 className="group flex flex-col bg-white border border-gray-100 hover:border-neutral-700 transition-all duration-150 rounded-2xl overflow-hidden"
 >
 <div className="relative aspect-video w-full overflow-hidden border-b border-gray-100">
 <Image
 src={project.imageUrl || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b"}
 alt={project.title}
 fill
 className="object-cover transition-all duration-300 group-hover:scale-[1.02]"
 />
 </div>

 <div className="p-6 flex-1 flex flex-col">
 <div className="flex items-start justify-between mb-3">
 <h3 className="text-lg font-bold text-white tracking-tight">
 {project.title}
 </h3>
 <div className="flex gap-2.5 items-center">
 {project.githubLink && (
 <Link 
 href={project.githubLink} 
 target="_blank" 
 className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-white hover:bg-gray-50 transition-all duration-150"
 >
 <Github strokeWidth={1.5} className="h-3.5 w-3.5" />
 </Link>
 )}
 {project.liveLink && (
 <Link 
 href={project.liveLink} 
 target="_blank" 
 className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-white hover:bg-gray-50 transition-all duration-150"
 >
 <ArrowUpRight strokeWidth={1.5} className="h-3.5 w-3.5" />
 </Link>
 )}
 </div>
 </div>

 <p className="text-gray-600 text-sm mb-6 flex-1 leading-relaxed font-light">
 {project.description}
 </p>

 <div className="flex flex-wrap gap-1.5 mt-auto">
 {project.tags.map(tag => (
 <span 
 key={tag} 
 className="text-[10px] font-mono text-gray-500 bg-gray-50/60 px-2 py-0.5 border border-gray-100 rounded-md"
 >
 {tag}
 </span>
 ))}
 </div>
 </div>
 </div>
 ))}
 </div>
 )}
 </>
 )}

 {/* GitHub Repositories Tab Content */}
 {activeTab === "github" && (
 <div className="space-y-8">
 {/* Search, Filter & Sort Toolbar */}
 <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between p-4 rounded-xl bg-white border border-gray-100">
 {/* Search bar */}
 <div className="relative flex-1">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
 <input
 type="text"
 placeholder="Search repositories..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-full pl-10 pr-4 py-2 bg-black border border-gray-200 rounded-lg text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-600 transition-all"
 />
 </div>

 {/* Filters & Sorting */}
 <div className="flex flex-wrap gap-2.5 items-center">
 {/* Languages selector */}
 <div className="flex items-center gap-1.5 bg-black border border-gray-200 rounded-lg px-3 py-1.5 text-xs">
 <SlidersHorizontal className="h-3 w-3 text-gray-500" />
 <select
 value={selectedLanguage}
 onChange={(e) => setSelectedLanguage(e.target.value)}
 className="bg-transparent text-white focus:outline-none cursor-pointer font-mono"
 >
 {availableLanguages.map(lang => (
 <option key={lang} value={lang} className="bg-white text-white">
 {lang}
 </option>
 ))}
 </select>
 </div>

 {/* Sort Selector */}
 <div className="flex items-center gap-1.5 bg-black border border-gray-200 rounded-lg px-3 py-1.5 text-xs">
 <span className="text-gray-500 font-mono">SORT:</span>
 <select
 value={sortBy}
 onChange={(e) => setSortBy(e.target.value as any)}
 className="bg-transparent text-white focus:outline-none cursor-pointer font-mono"
 >
 <option value="updated" className="bg-white text-white">Recent</option>
 <option value="stars" className="bg-white text-white">Stars</option>
 <option value="name" className="bg-white text-white">Name</option>
 </select>
 </div>
 </div>
 </div>

 {reposLoading ? (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {[1, 2, 3].map(i => (
 <div key={i} className="h-40 rounded-xl bg-white border border-gray-100 animate-pulse" />
 ))}
 </div>
 ) : filteredRepos.length === 0 ? (
 <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
 <p className="text-gray-800 text-xs font-mono">No repositories found</p>
 </div>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {filteredRepos.map((repo) => (
 <div 
 key={repo.id} 
 className="p-6 bg-white hover:bg-gray-50/20 border border-gray-100 hover:border-neutral-700 transition-all duration-150 flex flex-col justify-between h-full rounded-xl"
 >
 <div>
 {/* Title & Github Icon */}
 <div className="flex items-start justify-between mb-3">
 <div className="flex flex-col gap-1.5 max-w-[80%]">
 <h3 className="text-sm font-bold text-white font-mono tracking-tight flex items-center gap-1.5 truncate">
 <GitBranch className="h-3.5 w-3.5 text-gray-600 shrink-0" />
 {repo.name}
 </h3>
 <div>
 <span className={`inline-block text-[8px] px-2 py-0.5 rounded font-mono font-bold tracking-wider uppercase ${
 repo.private 
 ? "bg-gray-50 text-gray-600 border border-gray-200" 
 : "bg-white text-white border border-gray-200"
 }`}>
 {repo.private ? "Private" : "Public"}
 </span>
 </div>
 </div>
 <Link 
 href={repo.html_url} 
 target="_blank" 
 className="text-gray-500 hover:text-white transition-colors"
 >
 <Github className="h-3.5 w-3.5" />
 </Link>
 </div>

 {/* Description */}
 <p className="text-gray-600 text-xs leading-relaxed mb-4 line-clamp-3 font-light">
 {repo.description || "No description provided."}
 </p>
 </div>

 {/* Footer Metadata */}
 <div className="mt-auto pt-4 border-t border-gray-100">
 <div className="flex items-center justify-between text-[10px] text-gray-500">
 {/* Language Indicator */}
 {repo.language ? (
 <div className="flex items-center gap-1.5">
 <span className={`w-1.5 h-1.5 rounded-full ${LANGUAGE_COLORS[repo.language] || "bg-neutral-600"}`} />
 <span className="font-medium text-gray-600">{repo.language}</span>
 </div>
 ) : (
 <span className="text-gray-800 font-medium">Text</span>
 )}

 {/* Stars & Forks */}
 <div className="flex items-center gap-2.5">
 {repo.stargazers_count > 0 && (
 <span className="flex items-center gap-0.5 hover:text-white transition-colors">
 <Star className="h-3 w-3 fill-neutral-500 text-gray-500" />
 {repo.stargazers_count}
 </span>
 )}
 {repo.forks_count > 0 && (
 <span className="flex items-center gap-0.5">
 <GitFork className="h-3 w-3" />
 {repo.forks_count}
 </span>
 )}
 {/* Updated Date */}
 <span className="flex items-center gap-1 shrink-0 font-mono text-[9px]">
 <Calendar className="h-3 w-3" />
 {new Date(repo.updated_at).toLocaleDateString(undefined, { 
 month: 'short', 
 year: 'numeric' 
 })}
 </span>
 </div>
 </div>

 {/* External Homepage if exists */}
 {repo.homepage && (
 <div className="mt-3">
 <Link 
 href={repo.homepage} 
 target="_blank" 
 className="inline-flex items-center gap-1 text-[10px] text-gray-700 hover:text-white"
 >
 <Globe className="h-3 w-3" />
 Live Demo
 <ArrowUpRight className="h-2.5 w-2.5" />
 </Link>
 </div>
 )}
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 )}
 </div>
 </div>
 );
}


