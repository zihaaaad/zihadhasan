"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Code, Briefcase, GraduationCap, Lightbulb } from "lucide-react";
import Link from "next/link";
import { GlobalSettings } from "@/lib/cms-service";

interface ScrollPortfolioProps {
  settings: GlobalSettings | null;
}

export function ScrollPortfolio({ settings }: ScrollPortfolioProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress over the tall container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [activeSlide, setActiveSlide] = useState(0);

  // Map 0-1 scroll progress to 4 discrete slides
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.25) setActiveSlide(0);
    else if (latest < 0.5) setActiveSlide(1);
    else if (latest < 0.75) setActiveSlide(2);
    else setActiveSlide(3);
  });

  const slides = [
    {
      id: 0,
      tagIcon: <Code className="h-4 w-4" />,
      tagText: "Hello, I am Zihad",
      title: <>The <span className="text-gray-400">Architect.</span></>,
      content: (
        <>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-light mb-8">
            I am a full-stack engineer and educator who bridges the gap between complex technical systems and human-centered design. I specialize in building scalable software, teaching artificial intelligence, and crafting digital experiences that feel intuitive and powerful.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/contact" className="inline-flex h-12 items-center justify-center rounded-full bg-black px-8 text-sm font-semibold text-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-black/10">
              Get in Touch
            </Link>
            <Link href="/projects" className="inline-flex h-12 items-center justify-center rounded-full border border-gray-200 bg-white px-8 text-sm font-semibold text-black transition-all hover:bg-gray-50 hover:scale-105 active:scale-95">
              View Projects <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </>
      ),
      imageSrc: "/images/portfolio/Man_posing_for_professional_port.png",
      imageAlt: "Zihad Hasan posing",
      imageAspect: "aspect-[3/4] h-[75vh] max-h-[800px]", // Portrait
    },
    {
      id: 1,
      tagIcon: <Briefcase className="h-4 w-4" />,
      tagText: "Career Journey",
      title: <>Engineering <br/><span className="text-gray-400">Excellence.</span></>,
      content: (
        <div className="space-y-8">
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
      ),
      imageSrc: "/images/portfolio/Man_working_at_desk.png",
      imageAlt: "Zihad Hasan working at desk",
      imageAspect: "aspect-video md:aspect-[16/9] w-full max-w-3xl", // Real Aspect Ratio (16:9 widescreen)
    },
    {
      id: 2,
      tagIcon: <GraduationCap className="h-4 w-4" />,
      tagText: "Digital Literacy",
      title: <>Empowering through <br/><span className="text-gray-400">Education.</span></>,
      content: (
        <>
          <p className="text-lg text-gray-600 leading-relaxed font-light mb-6">
            I believe that technology is only as powerful as the people who know how to use it. That's why I dedicate my time to teaching digital literacy and Generative AI to hundreds of students, helping them unlock their full potential.
          </p>
          <ul className="space-y-4">
            {["500+ Students Mentored", "Curriculum Development", "AI-Assisted Learning", "Interactive Workshops"].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-800 font-medium">
                <div className="h-1.5 w-1.5 bg-black rounded-full" />
                {item}
              </li>
            ))}
          </ul>
        </>
      ),
      imageSrc: "/images/portfolio/Man_speaking_in_technology_class.png",
      imageAlt: "Zihad Hasan teaching in class",
      imageAspect: "aspect-[3/4] h-[75vh] max-h-[800px]", // Portrait
    },
    {
      id: 3,
      tagIcon: <Lightbulb className="h-4 w-4" />,
      tagText: "Core Philosophy",
      title: <>Building for the <br/><span className="text-gray-400">Long Term.</span></>,
      content: (
        <>
          <p className="text-lg text-gray-600 leading-relaxed font-light mb-6">
            Great software isn't just about writing code; it's about solving real human problems elegantly. I approach every project with a mindset geared towards scalability, security, and exceptional user experience.
          </p>
          <blockquote className="border-l-4 border-black pl-6 italic text-xl text-gray-800 my-8 py-2">
            "Technology should fade into the background, allowing human creativity and connection to take center stage."
          </blockquote>
          <Link href="/blog" className="font-semibold text-black hover:text-gray-600 transition-colors inline-flex items-center gap-2">
            Read my latest thoughts <ArrowRight className="h-4 w-4" />
          </Link>
        </>
      ),
      imageSrc: "/images/portfolio/Man_thinking.png",
      imageAlt: "Zihad Hasan thinking",
      imageAspect: "aspect-[3/4] h-[75vh] max-h-[800px]", // Portrait
    },
  ];

  // Simultaneous Crossfade text transition (Strong but soft)
  const textVariants = {
    initial: { opacity: 0, y: 40, filter: "blur(8px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: { opacity: 0, y: -40, filter: "blur(8px)" },
  };

  const transitionSpring = {
    type: "spring",
    stiffness: 70,
    damping: 20,
    mass: 1.2,
  };

  return (
    <div className="bg-white text-black relative">
      
      {/* 
        TALL CONTAINER: 400vh tall to allow scrolling.
      */}
      <div ref={containerRef} className="h-[400vh] relative w-full">
        
        {/* 
          STICKY WINDOW: 100vh tall, stays pinned to the screen while you scroll through the 400vh.
        */}
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
          
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12 lg:gap-20">
            
            {/* LEFT COLUMN: Text Content (Slideshow) */}
            {/* We explicitly define a fixed height container here so absolute positioning works without layout jumping */}
            <div className="w-full md:w-1/2 flex flex-col justify-center relative min-h-[60vh]">
              {/* Removed mode="wait" so they crossfade beautifully in realtime */}
              <AnimatePresence>
                <motion.div
                  key={activeSlide}
                  variants={textVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={transitionSpring as any}
                  className="absolute inset-x-0 top-1/2 -translate-y-1/2" // Perfect absolute centering
                  style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)' }} 
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 bg-gray-50 text-xs font-mono uppercase tracking-widest text-gray-600 mb-6">
                    {slides[activeSlide].tagIcon} {slides[activeSlide].tagText}
                  </div>
                  
                  <h2 className="text-5xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
                    {slides[activeSlide].title}
                  </h2>
                  
                  {slides[activeSlide].content}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* RIGHT COLUMN: Images (Slideshow) */}
            <div className="hidden md:flex w-full md:w-1/2 h-[80vh] items-center justify-center relative">
              {/* 
                We use a SINGLE container that morphs its shape using `layout`. 
                Inside, the images just crossfade. This prevents the "vanishing" glitch.
              */}
              <motion.div
                layout
                transition={transitionSpring as any}
                className={`relative overflow-hidden rounded-[2rem] shadow-2xl bg-gray-100 border border-gray-200 ${slides[activeSlide].imageAspect}`}
              >
                <AnimatePresence>
                  <motion.div
                    key={activeSlide}
                    initial={{ opacity: 0, filter: "blur(10px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(10px)" }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <Image 
                      src={slides[activeSlide].imageSrc}
                      alt={slides[activeSlide].imageAlt}
                      fill 
                      className="object-cover" 
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
                {/* Subtle lighting gradient */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/10 pointer-events-none" />
              </motion.div>
            </div>
            
            {/* MOBILE IMAGE PREVIEW (Fallback if screen is too small) */}
            <div className="flex md:hidden w-full relative h-[40vh] mt-auto">
              <AnimatePresence>
                <motion.div
                  key={`mobile-${activeSlide}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 rounded-2xl overflow-hidden shadow-lg border border-gray-100"
                >
                  <Image 
                    src={slides[activeSlide].imageSrc}
                    alt={slides[activeSlide].imageAlt}
                    fill 
                    className="object-cover" 
                  />
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
