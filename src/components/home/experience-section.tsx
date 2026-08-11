"use client";

import { motion } from "framer-motion";
import { Briefcase, Calendar, ChevronRight } from "lucide-react";

const experiences = [
  {
    role: "Core AI Team Member & Assistant Trainer",
    company: "As-Sunnah Foundation",
    period: "May 2024 – Present",
    description: "Architected enterprise event automation using Google Apps Script. Managed large-scale AI instruction for hundreds of students. Mitigated critical data breaches.",
    skills: ["Generative AI", "Automation", "Cybersecurity", "Google Apps Script"]
  },
  {
    role: "Field Volunteer & Logistics Coordinator",
    company: "As-Sunnah Foundation",
    period: "Aug 2024 – Present",
    description: "Coordinated and distributed relief supplies during the 2024 Bangladesh floods. Demonstrated empathy and rapid problem-solving in high-stress disaster zones.",
    skills: ["Logistics", "Crisis Management", "Empathy"]
  },
  {
    role: "Assistant Teacher & Office Administrator",
    company: "Real Multimedia School",
    period: "Jan 2022 – Aug 2023",
    description: "Taught English, Math, and ICT. Integrated Generative AI into lesson plans. Managed digital student records and enforced institutional data compliance.",
    skills: ["Education", "Data Management", "Communication"]
  },
  {
    role: "Cybersecurity Competitor",
    company: "Cyber Bangla",
    period: "Jan 2020 – Present",
    description: "Specialized in penetration testing, CTF competitions, and real-world security challenges using Kali Linux and Parrot OS.",
    skills: ["Ethical Hacking", "Penetration Testing", "CTF"]
  }
];

export function ExperienceSection() {
  return (
    <section className="py-32 px-4 relative bg-forest-950 text-white overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="mb-20 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-sm text-neutral-300 mb-6 font-mono uppercase tracking-widest"
          >
            <Briefcase className="h-4 w-4" />
            <span>Career</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-6xl font-medium tracking-tight text-white mb-6"
          >
            Professional <span className="text-emerald-500/60">Experience</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-emerald-100/70 font-light max-w-2xl"
          >
            A track record of building automated systems, teaching generative AI, and leading community initiatives.
          </motion.p>
        </div>

        <div className="space-y-6">
          {experiences.map((exp, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 * idx }}
              className="group relative p-8 md:p-10 rounded-3xl border border-white/5 bg-forest-800/20 hover:bg-forest-800/40 hover:border-white/10 transition-all backdrop-blur-sm"
            >
              {/* Subtle hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none" />

              <div className="relative z-10 grid md:grid-cols-[1fr_3fr] gap-6 md:gap-12 items-start">
                <div className="text-emerald-500/60 font-mono text-sm uppercase tracking-widest pt-1 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {exp.period}
                </div>
                
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-2">{exp.role}</h3>
                  <div className="text-lg text-emerald-100/70 mb-6">{exp.company}</div>
                  <p className="text-neutral-300 font-light leading-relaxed mb-8 max-w-2xl">
                    {exp.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {exp.skills.map((skill, sIdx) => (
                      <span 
                        key={sIdx}
                        className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-neutral-300 tracking-wide font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
