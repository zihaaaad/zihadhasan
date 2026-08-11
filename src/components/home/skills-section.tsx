"use client";

import { motion } from "framer-motion";
import { Code2, ShieldAlert, Cpu, Sparkles, Wand2, Database, LayoutTemplate } from "lucide-react";

const skillCategories = [
 {
 title: "AI & Automation",
 icon: Sparkles,
 skills: ["Generative AI (ChatGPT, Gemini)", "Prompt Engineering", "Custom AI Agents", "Google Apps Script", "Workflow Automation"],
 colSpan: "md:col-span-2",
 },
 {
 title: "Full-Stack Development",
 icon: Code2,
 skills: ["React & Next.js", "TypeScript / JavaScript", "Django & Python", "Laravel & PHP", "Tailwind CSS"],
 colSpan: "md:col-span-1",
 },
 {
 title: "Cybersecurity",
 icon: ShieldAlert,
 skills: ["Ethical Hacking", "Penetration Testing", "CTF Competitions", "InfoSec Analysis", "Kali Linux & Parrot OS"],
 colSpan: "md:col-span-1",
 },
 {
 title: "Cloud & Databases",
 icon: Database,
 skills: ["Google Cloud Platform", "Kubernetes", "Firebase", "Supabase", "Serverless Architecture"],
 colSpan: "md:col-span-2",
 },
 {
 title: "Design & Content",
 icon: LayoutTemplate,
 skills: ["Glassmorphism UI", "Vibe Coding", "Bengali Content Writing", "Community Management", "Adobe Suite (Ps, Ai)"],
 colSpan: "md:col-span-3",
 }
];

export function SkillsSection() {
 return (
 <section className="py-24 px-4 relative bg-white text-black overflow-hidden border-t border-gray-100">
 <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
 
 <div className="container mx-auto max-w-5xl relative z-10">
 <div className="text-center mb-16">
 <motion.h2
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.8 }}
 className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
 >
 Technical Arsenal
 </motion.h2>
 <motion.p
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.8, delay: 0.1 }}
 className="text-emerald-100/70 max-w-xl mx-auto"
 >
 A diverse toolkit enabling the creation of intelligent, secure, and beautiful digital experiences.
 </motion.p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 {skillCategories.map((category, idx) => (
 <motion.div
 key={idx}
 initial={{ opacity: 0, scale: 0.95 }}
 whileInView={{ opacity: 1, scale: 1 }}
 viewport={{ once: true }}
 transition={{ duration: 0.5, delay: idx * 0.1 }}
 className={`p-8 rounded-3xl border border-gray-200 bg-gray-50 group hover:border-gray-200 transition-all ${category.colSpan}`}
 >
 <div className="flex items-center gap-4 mb-6">
 <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center border border-gray-200 group-hover:bg-white transition-colors">
 <category.icon className="h-5 w-5 text-gray-700" />
 </div>
 <h3 className="text-xl font-semibold">{category.title}</h3>
 </div>
 
 <div className="flex flex-wrap gap-2">
 {category.skills.map((skill, sIdx) => (
 <span 
 key={sIdx}
 className="px-3 py-1.5 rounded-lg bg-white border border-gray-100 text-sm text-emerald-100/70 hover:text-black transition-colors"
 >
 {skill}
 </span>
 ))}
 </div>
 </motion.div>
 ))}
 </div>
 </div>
 </section>
 );
}
