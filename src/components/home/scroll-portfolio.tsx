"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Code, Briefcase, GraduationCap, Lightbulb } from "lucide-react";
import Link from "next/link";
import { GlobalSettings } from "@/lib/cms-service";

interface ScrollPortfolioProps {
  settings: GlobalSettings | null;
}

export function ScrollPortfolio({ settings }: ScrollPortfolioProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress across the entire container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Crossfade opacity mappings for the 4 images based on scroll percentage
  // Section 1 (Intro): 0.0 - 0.25
  const opacity1 = useTransform(scrollYProgress, [0, 0.2, 0.3], [1, 1, 0]);
  
  // Section 2 (Experience): 0.25 - 0.50
  const opacity2 = useTransform(scrollYProgress, [0.2, 0.3, 0.45, 0.55], [0, 1, 1, 0]);
  
  // Section 3 (Teaching): 0.50 - 0.75
  const opacity3 = useTransform(scrollYProgress, [0.45, 0.55, 0.7, 0.8], [0, 1, 1, 0]);
  
  // Section 4 (Philosophy): 0.75 - 1.0
  const opacity4 = useTransform(scrollYProgress, [0.7, 0.8, 1], [0, 1, 1]);

  // Content configuration for each section
  const heroTitle = settings?.heroTitle || "Teaching Generative AI & Digital Literacy.";
  const heroSubtitle = settings?.heroSubtitle || "Software Engineer and Tech Educator crafting high-performance digital experiences.";

  return (
    <div ref={containerRef} className="relative w-full bg-white text-black">
      
      {/* 
        Two-column layout on Desktop.
        Mobile defaults to a stacked layout where the images appear inline.
      */}
      <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* LEFT COLUMN: Scrolling Content */}
        <div className="w-full md:w-1/2 md:pr-12 lg:pr-20">
          
          {/* SECTION 1: Intro / Hero */}
          <section className="min-h-screen flex flex-col justify-center py-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 bg-gray-50 text-xs font-mono uppercase tracking-widest text-gray-600 mb-8 self-start">
              <Code className="h-3 w-3" /> Hello, I am Zihad
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
              {typeof heroTitle === 'string' 
                ? <span dangerouslySetInnerHTML={{ __html: heroTitle.replace(/\n/g, "<br/>") }} /> 
                : heroTitle}
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed mb-10">
              {heroSubtitle}
            </p>

            {/* Mobile-only image display */}
            <div className="md:hidden relative w-full aspect-[4/5] rounded-3xl overflow-hidden mb-10">
              <Image src="/images/portfolio/Man_posing_for_professional_port.png" alt="Zihad Hasan" fill className="object-cover" />
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/contact" className="inline-flex h-14 items-center justify-center rounded-full bg-black px-8 text-sm font-semibold text-white transition-colors hover:bg-gray-800">
                Get in Touch
              </Link>
              <Link href="/projects" className="inline-flex h-14 items-center justify-center rounded-full border border-gray-200 bg-white px-8 text-sm font-semibold text-black transition-colors hover:bg-gray-50">
                View Projects <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </section>


          {/* SECTION 2: Professional Experience */}
          <section className="min-h-screen flex flex-col justify-center py-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 bg-gray-50 text-xs font-mono uppercase tracking-widest text-gray-600 mb-8 self-start">
              <Briefcase className="h-3 w-3" /> Career Journey
            </div>
            
            <h2 className="text-4xl lg:text-6xl font-bold tracking-tight mb-12">
              Engineering <br/><span className="text-gray-400">Excellence.</span>
            </h2>

            {/* Mobile-only image display */}
            <div className="md:hidden relative w-full aspect-[4/5] rounded-3xl overflow-hidden mb-10">
              <Image src="/images/portfolio/Man_working_at_desk.png" alt="Working at desk" fill className="object-cover" />
            </div>

            <div className="space-y-12">
              <div className="border-l-2 border-gray-100 pl-6 relative">
                <div className="absolute w-3 h-3 bg-black rounded-full -left-[7px] top-2" />
                <h3 className="text-xl font-bold">Core AI Team & Trainer</h3>
                <p className="text-sm font-mono text-gray-500 mb-3 mt-1">As-Sunnah Foundation • 2024 - Present</p>
                <p className="text-gray-600 leading-relaxed">
                  Architected enterprise event automation using Google Apps Script. Managed large-scale AI instruction and mitigated critical data breaches.
                </p>
              </div>

              <div className="border-l-2 border-gray-100 pl-6 relative">
                <div className="absolute w-3 h-3 bg-gray-300 rounded-full -left-[7px] top-2" />
                <h3 className="text-xl font-bold">Assistant Teacher & IT Admin</h3>
                <p className="text-sm font-mono text-gray-500 mb-3 mt-1">Real Multimedia School • 2022 - 2023</p>
                <p className="text-gray-600 leading-relaxed">
                  Integrated Generative AI into lesson plans. Managed digital student records and enforced institutional data compliance.
                </p>
              </div>
            </div>
          </section>


          {/* SECTION 3: Teaching & Leadership */}
          <section className="min-h-screen flex flex-col justify-center py-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 bg-gray-50 text-xs font-mono uppercase tracking-widest text-gray-600 mb-8 self-start">
              <GraduationCap className="h-3 w-3" /> Digital Literacy
            </div>
            
            <h2 className="text-4xl lg:text-6xl font-bold tracking-tight mb-8">
              Empowering through <br/><span className="text-gray-400">Education.</span>
            </h2>

            {/* Mobile-only image display */}
            <div className="md:hidden relative w-full aspect-[4/5] rounded-3xl overflow-hidden mb-10">
              <Image src="/images/portfolio/Man_speaking_in_technology_class.png" alt="Teaching class" fill className="object-cover" />
            </div>

            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              I believe that technology is only as powerful as the people who know how to use it. That's why I dedicate my time to teaching digital literacy and Generative AI to hundreds of students, helping them unlock their full potential in the modern workforce.
            </p>

            <ul className="space-y-4">
              {["500+ Students Mentored", "Curriculum Development", "AI-Assisted Learning", "Interactive Workshops"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-800 font-medium">
                  <div className="h-1.5 w-1.5 bg-black rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
          </section>


          {/* SECTION 4: Philosophy & Future */}
          <section className="min-h-screen flex flex-col justify-center py-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 bg-gray-50 text-xs font-mono uppercase tracking-widest text-gray-600 mb-8 self-start">
              <Lightbulb className="h-3 w-3" /> Core Philosophy
            </div>
            
            <h2 className="text-4xl lg:text-6xl font-bold tracking-tight mb-8">
              Building for the <br/><span className="text-gray-400">Long Term.</span>
            </h2>

            {/* Mobile-only image display */}
            <div className="md:hidden relative w-full aspect-[4/5] rounded-3xl overflow-hidden mb-10">
              <Image src="/images/portfolio/Man_thinking.png" alt="Thinking" fill className="object-cover" />
            </div>

            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Great software isn't just about writing code; it's about solving real human problems elegantly. I approach every project with a mindset geared towards scalability, security, and exceptional user experience.
            </p>
            
            <blockquote className="border-l-4 border-black pl-6 italic text-xl text-gray-800 my-8 py-2">
              "Technology should fade into the background, allowing human creativity and connection to take center stage."
            </blockquote>

            <div className="pt-8">
              <Link href="/blog" className="font-semibold text-black hover:text-gray-600 transition-colors inline-flex items-center gap-2">
                Read my latest thoughts <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

        </div>


        {/* RIGHT COLUMN: Sticky Interactive Image (Desktop Only) */}
        <div className="hidden md:block w-1/2 h-screen sticky top-0 pt-[10vh] pb-[10vh]">
          {/* 
            The image container. We use motion.divs mapped to scrollYProgress to crossfade them.
          */}
          <div className="relative w-full h-[80vh] rounded-[2rem] overflow-hidden shadow-2xl bg-gray-100 border border-gray-200">
            
            {/* Image 1: Hero */}
            <motion.div style={{ opacity: opacity1 }} className="absolute inset-0 z-10 bg-gray-100">
              <Image 
                src="/images/portfolio/Man_posing_for_professional_port.png" 
                alt="Zihad Hasan posing" 
                fill 
                className="object-cover" 
                priority
              />
            </motion.div>
            
            {/* Image 2: Experience / Desk */}
            <motion.div style={{ opacity: opacity2 }} className="absolute inset-0 z-20 bg-gray-100">
              <Image 
                src="/images/portfolio/Man_working_at_desk.png" 
                alt="Zihad Hasan working at desk" 
                fill 
                className="object-cover" 
              />
            </motion.div>
            
            {/* Image 3: Teaching */}
            <motion.div style={{ opacity: opacity3 }} className="absolute inset-0 z-30 bg-gray-100">
              <Image 
                src="/images/portfolio/Man_speaking_in_technology_class.png" 
                alt="Zihad Hasan teaching in class" 
                fill 
                className="object-cover" 
              />
            </motion.div>
            
            {/* Image 4: Philosophy / Thinking */}
            <motion.div style={{ opacity: opacity4 }} className="absolute inset-0 z-40 bg-gray-100">
              <Image 
                src="/images/portfolio/Man_thinking.png" 
                alt="Zihad Hasan thinking" 
                fill 
                className="object-cover" 
              />
            </motion.div>

          </div>
        </div>

      </div>
    </div>
  );
}
