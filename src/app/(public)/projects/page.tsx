"use client";

import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Cpu, Globe, Code2, ArrowUpRight, Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CMSService, Project } from "@/lib/cms-service";

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProjects() {
            try {
                const data = await CMSService.getProjects();
                setProjects(data);
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProjects();
    }, []);

    if (loading) return <div className="min-h-screen pt-24 text-center text-white">Loading projects...</div>;

    return (
        <div className="min-h-screen pt-24 pb-20 px-4">
            <div className="mb-20 container mx-auto px-4 max-w-7xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-4">
                    Case <span className="text-primary italic font-serif">Studies</span>
                </h1>
                <p className="text-lg text-neutral-500 max-w-2xl font-medium leading-relaxed">
                    A collection of high-performance projects at the intersection of complex engineering and digital philosophy.
                </p>
            </div>

            {projects.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground uppercase tracking-widest text-xs font-bold">No projects found.</div>
            ) : (
                <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8 max-w-7xl mx-auto px-4">
                    {projects.map((project, i) => (
                        <div key={i} className="break-inside-avoid mb-8">
                            <SpotlightCard className="group p-0 h-full flex flex-col bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-700 border-white/[0.05] hover:border-white/20 rounded-3xl overflow-hidden">
                                <div className="relative aspect-video w-full overflow-hidden bg-neutral-900 transition-shadow duration-500">
                                    <Image
                                        src={project.imageUrl || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b"}
                                        alt={project.title}
                                        fill
                                        className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110 grayscale group-hover:grayscale-0"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                                </div>

                                <div className="p-8 flex-1 flex flex-col relative z-10">
                                    <div className="flex items-start justify-between mb-4">
                                        <h3 className="text-xl font-bold text-white tracking-tight leading-snug">{project.title}</h3>
                                        <div className="flex gap-4 items-center">
                                            {project.githubLink && (
                                                <Link href={project.githubLink} target="_blank" className="text-neutral-500 hover:text-white transition-all duration-300">
                                                    <Github strokeWidth={1.5} className="h-4 w-4" />
                                                </Link>
                                            )}
                                            {project.liveLink && (
                                                <Link href={project.liveLink} target="_blank" className="text-neutral-500 hover:text-white transition-all duration-300">
                                                    <ArrowUpRight strokeWidth={1.5} className="h-4 w-4" />
                                                </Link>
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-neutral-500 text-sm mb-8 flex-1 leading-relaxed">
                                        {project.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mt-auto">
                                        {project.tags.map(tag => (
                                            <Badge key={tag} variant="secondary" className="bg-white/5 text-[9px] font-bold text-neutral-400 border-white/[0.05] uppercase tracking-widest backdrop-blur-sm px-2.5 h-5 rounded-full">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </SpotlightCard>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
