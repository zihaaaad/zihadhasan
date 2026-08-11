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

// Crisp monochrome and semantic colors for desktop feel
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "bg-blue-500",
  JavaScript: "bg-yellow-400",
  Python: "bg-green-500",
  Dart: "bg-cyan-500",
  HTML: "bg-orange-500",
  CSS: "bg-indigo-500",
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
    <div className="min-h-screen bg-white text-black pt-32 pb-24 font-sans">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-12 border-b border-gray-200 pb-10">
          <div className="text-[10px] font-mono font-bold tracking-widest text-gray-400 uppercase mb-4">
            / index / projects
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-black mb-4">
            Case studies & repositories.
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl font-medium">
            A clean showcase of system designs, developer tools, and contributions. No filler text, just code.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-start mb-10">
          <div className="flex bg-gray-50/50 p-1 rounded-xl border border-gray-200 shadow-sm">
            <button
              onClick={() => setActiveTab("featured")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                activeTab === "featured"
                  ? "bg-white text-black shadow-sm border border-gray-200/60"
                  : "text-gray-500 hover:text-black border border-transparent"
              }`}
            >
              Featured Work
            </button>
            <button
              onClick={() => setActiveTab("github")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                activeTab === "github"
                  ? "bg-white text-black shadow-sm border border-gray-200/60"
                  : "text-gray-500 hover:text-black border border-transparent"
              }`}
            >
              All Repositories
              {repos.length > 0 && (
                <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded font-mono ${activeTab === 'github' ? 'bg-gray-100 text-black' : 'bg-gray-200/50 text-gray-500'}`}>
                  {repos.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Featured Projects Tab Content */}
        {activeTab === "featured" && (
          <>
            {projectsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-[400px] rounded-2xl bg-gray-50 border border-gray-200 animate-pulse" />
                ))}
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-24 border border-gray-200 border-dashed bg-gray-50 rounded-2xl">
                <div className="text-gray-500 text-xs font-bold uppercase tracking-widest">No featured projects found</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, i) => (
                  <div 
                    key={i} 
                    className="group flex flex-col bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden"
                  >
                    <div className="relative aspect-video w-full overflow-hidden border-b border-gray-100 bg-gray-50">
                      <Image
                        src={project.imageUrl || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b"}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-black tracking-tight group-hover:text-gray-700 transition-colors">
                          {project.title}
                        </h3>
                        <div className="flex gap-2 items-center">
                          {project.githubLink && (
                            <Link 
                              href={project.githubLink} 
                              target="_blank" 
                              className="p-2 rounded-md border border-gray-200 text-gray-500 hover:text-black hover:bg-gray-50 transition-all duration-150"
                            >
                              <Github strokeWidth={2} className="h-4 w-4" />
                            </Link>
                          )}
                          {project.liveLink && (
                            <Link 
                              href={project.liveLink} 
                              target="_blank" 
                              className="p-2 rounded-md border border-gray-200 text-gray-500 hover:text-black hover:bg-gray-50 transition-all duration-150"
                            >
                              <ArrowUpRight strokeWidth={2} className="h-4 w-4" />
                            </Link>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-500 text-sm mb-6 flex-1 leading-relaxed font-medium">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-auto">
                        {project.tags.map(tag => (
                          <span 
                            key={tag} 
                            className="text-[10px] font-bold tracking-wider uppercase text-gray-600 bg-gray-100 px-2.5 py-1 border border-gray-200 rounded-md"
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
          <div className="space-y-6">
            {/* Search, Filter & Sort Toolbar - Desktop Native Feel */}
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between p-2 rounded-xl bg-gray-50/50 border border-gray-200 shadow-sm">
              {/* Search bar */}
              <div className="relative flex-1 min-w-[250px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filter repositories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all font-medium"
                />
              </div>

              {/* Filters & Sorting */}
              <div className="flex flex-wrap gap-3 items-center px-2">
                {/* Languages selector */}
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold text-gray-600 shadow-sm focus-within:ring-1 focus-within:ring-gray-300 transition-shadow">
                  <Code2 className="h-3.5 w-3.5 text-gray-400" />
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="bg-transparent focus:outline-none cursor-pointer uppercase tracking-wider"
                  >
                    {availableLanguages.map(lang => (
                      <option key={lang} value={lang}>
                        {lang === "All" ? "All Languages" : lang}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort Selector */}
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold text-gray-600 shadow-sm focus-within:ring-1 focus-within:ring-gray-300 transition-shadow">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent focus:outline-none cursor-pointer uppercase tracking-wider"
                  >
                    <option value="updated">Recently Updated</option>
                    <option value="stars">Most Stars</option>
                    <option value="name">Alphabetical</option>
                  </select>
                </div>
              </div>
            </div>

            {reposLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-48 rounded-xl bg-gray-50 border border-gray-200 animate-pulse" />
                ))}
              </div>
            ) : filteredRepos.length === 0 ? (
              <div className="text-center py-24 bg-gray-50 rounded-xl border border-gray-200 border-dashed">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">No repositories found matching filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRepos.map((repo) => (
                  <div 
                    key={repo.id} 
                    className="group p-5 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full rounded-xl"
                  >
                    <div>
                      {/* Title & Github Icon */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex flex-col gap-2 max-w-[85%]">
                          <h3 className="text-base font-bold text-black font-mono tracking-tight flex items-center gap-2 truncate group-hover:text-blue-600 transition-colors">
                            <GitBranch className="h-4 w-4 text-gray-400 shrink-0" />
                            {repo.name}
                          </h3>
                          <div>
                            <span className={`inline-block text-[9px] px-2 py-0.5 rounded-sm font-bold tracking-widest uppercase ${
                              repo.private 
                                ? "bg-gray-100 text-gray-500 border border-gray-200" 
                                : "bg-green-50 text-green-700 border border-green-200"
                            }`}>
                              {repo.private ? "Private" : "Public"}
                            </span>
                          </div>
                        </div>
                        <Link 
                          href={repo.html_url} 
                          target="_blank" 
                          className="text-gray-400 hover:text-black bg-white hover:bg-gray-100 p-1.5 rounded-md border border-transparent hover:border-gray-200 transition-all"
                        >
                          <Github className="h-4 w-4" />
                        </Link>
                      </div>

                      {/* Description */}
                      <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2 font-medium">
                        {repo.description || "No description provided for this repository."}
                      </p>
                    </div>

                    {/* Footer Metadata */}
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                        {/* Language Indicator */}
                        {repo.language ? (
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full shadow-sm ${LANGUAGE_COLORS[repo.language] || "bg-gray-400"}`} />
                            <span className="text-gray-700">{repo.language}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">Documentation</span>
                        )}

                        {/* Stars & Forks */}
                        <div className="flex items-center gap-3">
                          {repo.stargazers_count > 0 && (
                            <span className="flex items-center gap-1 hover:text-yellow-600 transition-colors">
                              <Star className="h-3.5 w-3.5 fill-current" />
                              {repo.stargazers_count}
                            </span>
                          )}
                          {repo.forks_count > 0 && (
                            <span className="flex items-center gap-1">
                              <GitFork className="h-3.5 w-3.5" />
                              {repo.forks_count}
                            </span>
                          )}
                        </div>
                      </div>
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


