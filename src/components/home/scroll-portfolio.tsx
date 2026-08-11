"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Code, Briefcase, GraduationCap, Lightbulb } from "lucide-react";
import Link from "next/link";
import { GlobalSettings } from "@/lib/cms-service";

interface ScrollPortfolioProps {
  settings: GlobalSettings | null;
}

// Custom hook to detect when a section is active
function useSectionObserver(sectionIds: string[]) {
  const [activeSection, setActiveSection] = useState(-1);

  useEffect(() => {
    const observers = sectionIds.map((id, index) => {
      const element = document.getElementById(id);
      if (!element) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(index);
            }
          });
        },
        { rootMargin: "-40% 0px -40% 0px" } // Triggers slightly before the exact middle
      );

      observer.observe(element);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, [sectionIds]);

  return activeSection;
}

export function ScrollPortfolio({ settings }: ScrollPortfolioProps) {
  const sectionIds = ["section-0", "section-1", "section-2", "section-3"];
  const activeIndex = useSectionObserver(sectionIds);

  const heroTitle = settings?.heroTitle || "Teaching Generative AI & Digital Literacy.";
  const heroSubtitle = settings?.heroSubtitle || "Software Engineer and Tech Educator crafting high-performance digital experiences.";

  const images = [
    { 
      src: "/images/portfolio/Man_posing_for_professional_port.png", 
      alt: "Zihad Hasan posing",
      aspect: "aspect-[3/4]" // Portrait style for intro
    },
    { 
      src: "/images/portfolio/Man_working_at_desk.png", 
      alt: "Zihad Hasan working at desk",
      aspect: "aspect-[4/3]" // Landscape-ish for desk
    },
    { 
      src: "/images/portfolio/Man_speaking_in_technology_class.png", 
      alt: "Zihad Hasan teaching in class",
      aspect: "aspect-video" // Wide for teaching class
    },
    { 
      src: "/images/portfolio/Man_thinking.png", 
      alt: "Zihad Hasan thinking",
      aspect: "aspect-square" // Square for philosophy
    },
  ];

  return (
    <div className="relative w-full bg-white text-black">
      
      {/* 
        INITIAL LOAD HERO 
        Clean, centered, no image initially.
      */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} // Custom spring-like bezier
        >
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-gray-50 text-sm font-mono uppercase tracking-widest text-gray-600 mb-8">
            <Code className="h-4 w-4" /> Hello, I am Zihad
          </div>
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.1]">
            {typeof heroTitle === 'string' 
              ? <span dangerouslySetInnerHTML={{ __html: heroTitle.replace(/\n/g, "<br/>") }} /> 
              : heroTitle}
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-500 font-light leading-relaxed max-w-3xl mx-auto mb-12">
            {heroSubtitle}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="inline-flex h-14 items-center justify-center rounded-full bg-black px-8 text-base font-semibold text-white transition-all hover:scale-105 active:scale-95">
              Get in Touch
            </Link>
            <Link href="/projects" className="inline-flex h-14 items-center justify-center rounded-full border border-gray-200 bg-white px-8 text-base font-semibold text-black transition-all hover:bg-gray-50 hover:scale-105 active:scale-95">
              View Projects <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* 
        STICKY SCROLLING PORTFOLIO
        Left side: Text. Right side: Dynamic Images.
      */}
      <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* LEFT COLUMN: Scrolling Content */}
        <div className="w-full md:w-1/2 md:pr-12 lg:pr-20 pb-40">
          
          {/* SECTION 0: About Me */}
          <section id="section-0" className="min-h-screen flex flex-col justify-center py-20">
            <h2 className="text-5xl lg:text-6xl font-bold tracking-tight mb-8">
              The <span className="text-gray-400">Architect.</span>
            </h2>

            {/* Mobile Image */}
            <div className="md:hidden relative w-full aspect-[3/4] rounded-2xl overflow-hidden mb-10 shadow-sm border border-gray-100">
              <Image src={images[0].src} alt={images[0].alt} fill className="object-cover" />
            </div>

            <p className="text-xl text-gray-600 leading-relaxed">
              I am a full-stack engineer and educator who bridges the gap between complex technical systems and human-centered design. I specialize in building scalable software, teaching artificial intelligence, and crafting digital experiences that feel intuitive and powerful.
            </p>
          </section>


          {/* SECTION 1: Professional Experience */}
          <section id="section-1" className="min-h-screen flex flex-col justify-center py-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 bg-gray-50 text-xs font-mono uppercase tracking-widest text-gray-600 mb-8 self-start">
              <Briefcase className="h-3 w-3" /> Career Journey
            </div>
            
            <h2 className="text-4xl lg:text-6xl font-bold tracking-tight mb-12">
              Engineering <br/><span className="text-gray-400">Excellence.</span>
            </h2>

            {/* Mobile Image */}
            <div className="md:hidden relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-10 shadow-sm border border-gray-100">
              <Image src={images[1].src} alt={images[1].alt} fill className="object-cover" />
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


          {/* SECTION 2: Teaching & Leadership */}
          <section id="section-2" className="min-h-screen flex flex-col justify-center py-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 bg-gray-50 text-xs font-mono uppercase tracking-widest text-gray-600 mb-8 self-start">
              <GraduationCap className="h-3 w-3" /> Digital Literacy
            </div>
            
            <h2 className="text-4xl lg:text-6xl font-bold tracking-tight mb-8">
              Empowering through <br/><span className="text-gray-400">Education.</span>
            </h2>

            {/* Mobile Image */}
            <div className="md:hidden relative w-full aspect-video rounded-2xl overflow-hidden mb-10 shadow-sm border border-gray-100">
              <Image src={images[2].src} alt={images[2].alt} fill className="object-cover" />
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


          {/* SECTION 3: Philosophy & Future */}
          <section id="section-3" className="min-h-screen flex flex-col justify-center py-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 bg-gray-50 text-xs font-mono uppercase tracking-widest text-gray-600 mb-8 self-start">
              <Lightbulb className="h-3 w-3" /> Core Philosophy
            </div>
            
            <h2 className="text-4xl lg:text-6xl font-bold tracking-tight mb-8">
              Building for the <br/><span className="text-gray-400">Long Term.</span>
            </h2>

            {/* Mobile Image */}
            <div className="md:hidden relative w-full aspect-square rounded-2xl overflow-hidden mb-10 shadow-sm border border-gray-100">
              <Image src={images[3].src} alt={images[3].alt} fill className="object-cover" />
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
        <div className="hidden md:flex w-1/2 h-screen sticky top-0 items-center justify-center p-8">
          
          {/* 
            The activeIndex controls whether an image is shown.
            We use framer-motion layout animations to smoothly morph the container size
            between aspect-[4/3], aspect-[16/9], aspect-square, etc.
            A highly damped spring gives it that "sticky/viscous" water-like premium feel.
          */}
          <AnimatePresence mode="wait">
            {activeIndex >= 0 && (
              <motion.div
                key={activeIndex}
                layoutId="portfolio-image-container"
                initial={{ opacity: 0, scale: 0.8, y: 50, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.1, y: -50, filter: "blur(10px)" }}
                transition={{ 
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                  mass: 1
                }}
                className={`relative w-full max-h-[80vh] rounded-[2rem] overflow-hidden shadow-2xl bg-gray-100 border border-gray-200 ${images[activeIndex].aspect}`}
              >
                <Image 
                  src={images[activeIndex].src}
                  alt={images[activeIndex].alt}
                  fill 
                  className="object-cover" 
                  priority={activeIndex === 0}
                />
                
                {/* Subtle vignette/gradient over the image for premium feel */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
              </motion.div>
            )}
          </AnimatePresence>
          
        </div>

      </div>
    </div>
  );
}
