"use client";

import { motion } from "framer-motion";
import { Github, Twitter, Linkedin, Mail, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const socialLinks = [
 { icon: Github, href: "https://github.com/Z-root-X", label: "GitHub" },
 { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
 { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
 { icon: Mail, href: "mailto:contact@zihadhasan.com", label: "Email" },
];

export function PhilosophySection() {
 return (
 <section className="relative py-32 px-4 overflow-hidden bg-white text-black">
 {/* Background Grids for that "Figma" precision look */}
 <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
 
 <div className="container mx-auto max-w-5xl relative z-10">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8 items-center">
 
 {/* Left: Large Typography Statement */}
 <div className="space-y-8">
 <motion.h2 
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.8 }}
 className="text-4xl md:text-6xl font-medium tracking-tight leading-[1.1] text-black"
 >
 Software that feels <br />
 <span className="text-emerald-500/60">biological.</span>
 </motion.h2>

 <motion.div 
 initial={{ opacity: 0, x: -20 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.8, delay: 0.2 }}
 className="h-px w-24 bg-white" 
 />

 <motion.p 
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.8, delay: 0.4 }}
 className="text-lg md:text-xl text-emerald-100/70 font-light leading-relaxed max-w-md"
 >
 I believe the gap between complex AI systems and intuitive human experiences is the new frontier. My mission is to bridge this gap with code that breathes.
 </motion.p>
 </div>

 {/* Right: Clean Info Card (Glassmorphism + Border) */}
 <motion.div 
 initial={{ opacity: 0, scale: 0.95 }}
 whileInView={{ opacity: 1, scale: 1 }}
 viewport={{ once: true }}
 transition={{ duration: 0.8, delay: 0.2 }}
 className="relative"
 >
 {/* Decorative 'Connect' line */}
 <div className="absolute -left-8 top-1/2 w-8 h-px bg-gradient-to-r from-transparent to-white/20 hidden md:block" />

 <div className="group relative rounded-2xl border border-gray-200 bg-gray-50 p-8 md:p-12 overflow-hidden transition-all hover:border-gray-200">
 
 {/* Subtle hover gradient */}
 <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

 <div className="relative z-10 space-y-8">
 <div>
 <h3 className="text-sm font-mono text-emerald-500/60 mb-2 tracking-widest uppercase">Connect</h3>
 <p className="text-2xl font-semibold text-black">Let's build something impossible.</p>
 </div>

 <div className="grid grid-cols-2 gap-4">
 {socialLinks.map((social, i) => (
 <Link 
 key={i} 
 href={social.href} 
 target="_blank"
 className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-white hover:bg-white transition-colors group/link"
 >
 <social.icon className="h-5 w-5 text-emerald-100/70 group-hover/link:text-black transition-colors" />
 <span className="text-sm text-gray-700 group-hover/link:text-black transition-colors font-medium">
 {social.label}
 </span>
 <ArrowUpRight className="h-3 w-3 text-gray-800 group-hover/link:text-emerald-100/70 ml-auto opacity-0 group-hover/link:opacity-100 transition-all transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
 </Link>
 ))}
 </div>
 </div>
 </div>
 </motion.div>
 </div>
 </div>
 </section>
 );
}
