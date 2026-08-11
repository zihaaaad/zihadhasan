"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Code, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/ui/magnetic-button";
import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/lib/cloudinary-utils";
import { GlobalSettings } from "@/lib/cms-service";

interface HeroProps {
    settings: GlobalSettings | null;
    projectCount: number;
    toolCount: number;
}

import { useRef } from 'react';

export function Hero({ settings, projectCount, toolCount }: HeroProps) {
    const headlineRef = useRef(null);
    const containerRef = useRef(null);

    // 3D Tilt Logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 50 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 50 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["8deg", "-8deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-8deg", "8deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const heroTitle = settings?.heroTitle || (
        <>
            Teaching <span className="text-primary italic font-serif">Generative AI</span>
            <br />
            & Digital Literacy.
        </>
    );

    const heroSubtitle = settings?.heroSubtitle || "Author, Tech Educator at As-Sunnah Skill Development Institute, and Software Engineer crafting high-performance digital experiences.";

    const heroImage = settings?.heroImage || "https://i.postimg.cc/nzhzNpDP/372A6446.jpg";

    return (
        <section ref={containerRef} className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4 md:px-8 pt-20">
            {/* Minimal Background */}
            <div className="absolute inset-0 -z-10 bg-white">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_70%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            </div>

            <div className="container mx-auto grid gap-12 lg:grid-cols-12 lg:items-center relative z-10 py-12">
                {/* Text Content */}
                <div className="flex flex-col items-center text-center lg:col-span-7 lg:items-start lg:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h1 className="mb-6 text-5xl font-bold tracking-tight text-black sm:text-6xl md:text-7xl xl:text-8xl leading-[1.1]">
                            {typeof heroTitle === 'string' ? (
                                <span dangerouslySetInnerHTML={{ __html: heroTitle.replace(/\n/g, "<br/>") }} />
                            ) : heroTitle}
                        </h1>

                        <p className="mb-10 max-w-xl text-lg md:text-xl text-emerald-100/70 font-normal leading-relaxed">
                            {heroSubtitle}
                        </p>

                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-5">
                            <Button size="lg" className="rounded-full bg-white px-8 text-black hover:bg-neutral-200 transition-colors h-14 font-semibold" asChild>
                                <Link href="/projects">
                                    View Projects <ArrowRight strokeWidth={1.5} className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>

                            <Button size="lg" variant="outline" className="rounded-full px-8 text-black border-gray-200 hover:bg-white h-14" asChild>
                                <Link href="/contact">
                                    Get in Touch
                                </Link>
                            </Button>
                        </div>

                        {/* Minimal Stats */}
                        <div className="mt-16 flex flex-wrap items-center justify-center lg:justify-start gap-10 border-t border-gray-100 pt-8">
                            {[
                                { label: "Projects", value: `${projectCount}+` },
                                { label: "Students", value: "500+" },
                                { label: "AI Tools", value: `${toolCount}+` }
                            ].map((stat, i) => (
                                <div key={i} className="flex flex-col">
                                    <span className="text-xl font-semibold text-black tracking-tight">{stat.value}</span>
                                    <span className="text-[11px] text-emerald-500/60 uppercase tracking-widest">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Refined Visual Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="lg:col-span-5 relative hidden lg:block"
                >
                    <motion.div
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        style={{
                            rotateX,
                            rotateY,
                            transformStyle: "preserve-3d",
                        }}
                        className="relative aspect-[4/5] w-full"
                    >
                        <div className="relative h-full w-full overflow-hidden rounded-3xl bg-gray-100 border border-gray-100 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]">
                            <Image
                                src={getImageUrl(heroImage)}
                                alt="Zihad Hasan"
                                fill
                                className="object-cover object-center transition-all duration-700 ease-in-out scale-105"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent" />
                        </div>

                        {/* Floating Elements - More Subtle */}
                        <div
                            style={{ transform: "translateZ(30px)" }}
                            className="absolute -bottom-4 -left-4 z-40 flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 "
                        >
                            <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
                                <Code strokeWidth={1.5} className="h-4 w-4 text-black/70" />
                            </div>
                            <div className="text-[10px] text-black/50 font-mono tracking-widest uppercase">DHAKA, BD</div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
