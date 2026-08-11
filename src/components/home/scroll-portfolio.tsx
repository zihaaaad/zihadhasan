"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Code, Briefcase, GraduationCap, Lightbulb } from "lucide-react";
import Link from "next/link";

import { GlobalSettings } from "@/lib/cms-service";

interface ScrollPortfolioProps {
  settings?: GlobalSettings | null;
}

export function ScrollPortfolio({ settings }: ScrollPortfolioProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress over the tall container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // ==========================================
  // GSAP-like ScrollTrigger Logic (Scrubbed)
  // ==========================================

  // TEXT ANIMATIONS
  // Slide 0: The Architect (0 -> 0.25)
  const y0 = useTransform(scrollYProgress, [0, 0.1, 0.25], ["0px", "0px", "-80px"]);
  const o0 = useTransform(scrollYProgress, [0, 0.1, 0.25], [1, 1, 0]);

  // Slide 1: Education (0.1 -> 0.55)
  const y1 = useTransform(scrollYProgress, [0.1, 0.25, 0.4, 0.55], ["80px", "0px", "0px", "-80px"]);
  const o1 = useTransform(scrollYProgress, [0.1, 0.25, 0.4, 0.55], [0, 1, 1, 0]);

  // Slide 2: Philosophy (0.4 -> 0.9)
  const y2 = useTransform(scrollYProgress, [0.4, 0.55, 0.75, 0.9], ["80px", "0px", "0px", "-80px"]);
  const o2 = useTransform(scrollYProgress, [0.4, 0.55, 0.75, 0.9], [0, 1, 1, 0]);

  // Slide 3: Career Journey (0.75 -> 1.0)
  const y3 = useTransform(scrollYProgress, [0.75, 0.9, 1], ["80px", "0px", "0px"]);
  const o3 = useTransform(scrollYProgress, [0.75, 0.9, 1], [0, 1, 1]);

  const textTransforms = [
    { y: y0, opacity: o0 },
    { y: y1, opacity: o1 },
    { y: y2, opacity: o2 },
    { y: y3, opacity: o3 },
  ];

  // IMAGE ANIMATIONS (Deck of Cards effect)
  // Image 0 (Top card)
  const xImg0 = useTransform(scrollYProgress, [0, 0.1, 0.25], ["0%", "0%", "-120%"]);
  const sImg0 = useTransform(scrollYProgress, [0, 0.1, 0.25], [1, 1, 0.8]);
  const rImg0 = useTransform(scrollYProgress, [0.1, 0.25], ["0deg", "-8deg"]);
  const oImg0 = useTransform(scrollYProgress, [0.15, 0.25], [1, 0]);

  // Image 1
  const xImg1 = useTransform(scrollYProgress, [0, 0.4, 0.55], ["0%", "0%", "-120%"]);
  const sImg1 = useTransform(scrollYProgress, [0, 0.1, 0.25, 0.4, 0.55], [0.9, 0.9, 1, 1, 0.8]);
  const rImg1 = useTransform(scrollYProgress, [0.4, 0.55], ["0deg", "-8deg"]);
  const oImg1 = useTransform(scrollYProgress, [0.45, 0.55], [1, 0]);

  // Image 2
  const xImg2 = useTransform(scrollYProgress, [0, 0.75, 0.9], ["0%", "0%", "-120%"]);
  const sImg2 = useTransform(scrollYProgress, [0, 0.4, 0.55, 0.75, 0.9], [0.8, 0.8, 1, 1, 0.8]);
  const rImg2 = useTransform(scrollYProgress, [0.75, 0.9], ["0deg", "-8deg"]);
  const oImg2 = useTransform(scrollYProgress, [0.8, 0.9], [1, 0]);

  // Image 3 (Grand Finale Widescreen Card)
  // Wait to appear until Card 1 is gone, then scale up massively as Card 2 leaves
  const sImg3 = useTransform(scrollYProgress, [0.4, 0.55, 0.75, 0.9, 1], [0.5, 0.7, 0.8, 1.05, 1]);
  const oImg3 = useTransform(scrollYProgress, [0.4, 0.55], [0, 1]); // Fades in behind Card 2

  const imgTransforms = [
    { x: xImg0, scale: sImg0, rotate: rImg0, opacity: oImg0, zIndex: 40 },
    { x: xImg1, scale: sImg1, rotate: rImg1, opacity: oImg1, zIndex: 30 },
    { x: xImg2, scale: sImg2, rotate: rImg2, opacity: oImg2, zIndex: 20 },
  ];

  // Re-ordered data to match the requested animation sequence
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
      type: "portrait"
    },
    {
      id: 1,
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
      type: "portrait"
    },
    {
      id: 2,
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
      type: "portrait"
    },
    {
      id: 3, // GRAND FINALE
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
      type: "landscape"
    },
  ];

  return (
    <div className="bg-white text-black relative">
      
      {/* 
        TALL CONTAINER: 400vh tall to allow scrubbing over 4 sections.
      */}
      <div ref={containerRef} className="h-[400vh] relative w-full">
        
        {/* 
          STICKY WINDOW: 100vh tall, stays pinned to the screen while you scroll.
        */}
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
          
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12 lg:gap-20 h-full py-20">
            
            {/* LEFT COLUMN: Text Content (Scrubbed Vertical Slide) */}
            <div className="w-full md:w-[45%] flex flex-col justify-center relative h-full">
              {slides.map((slide, index) => (
                <motion.div
                  key={`text-${slide.id}`}
                  style={{
                    y: textTransforms[index].y,
                    opacity: textTransforms[index].opacity,
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "100%",
                    pointerEvents: "none" // prevents hidden elements from blocking clicks
                  }}
                  className="inset-x-0"
                >
                  <div className="pointer-events-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 bg-gray-50 text-xs font-mono uppercase tracking-widest text-gray-600 mb-6">
                      {slide.tagIcon} {slide.tagText}
                    </div>
                    
                    <h2 className="text-5xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
                      {slide.title}
                    </h2>
                    
                    {slide.content}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* RIGHT COLUMN: Images (Scrubbed Stack of Cards) */}
            <div className="hidden md:flex w-full md:w-[55%] h-full items-center justify-center relative perspective-1000">
              
              {/* Image 3: Grand Finale (Landscape) - Bottom of the stack */}
              <motion.div
                style={{
                  scale: sImg3,
                  opacity: oImg3,
                  zIndex: 10,
                }}
                className="absolute w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gray-100"
              >
                <Image 
                  src={slides[3].imageSrc}
                  alt={slides[3].imageAlt}
                  fill 
                  className="object-cover" 
                  priority
                />
              </motion.div>

              {/* Images 0, 1, 2 (Portraits) - Top of the stack sliding away */}
              {[2, 1, 0].map((idx) => (
                <motion.div
                  key={`img-${slides[idx].id}`}
                  style={{
                    x: imgTransforms[idx].x,
                    scale: imgTransforms[idx].scale,
                    rotateZ: imgTransforms[idx].rotate,
                    opacity: imgTransforms[idx].opacity,
                    zIndex: imgTransforms[idx].zIndex,
                    transformOrigin: "bottom left" // Makes the rotation feel like a card swiping away
                  }}
                  className="absolute w-[70%] max-w-md aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white bg-gray-100"
                >
                  <Image 
                    src={slides[idx].imageSrc}
                    alt={slides[idx].imageAlt}
                    fill 
                    className="object-cover" 
                    priority
                  />
                  {/* Subtle lighting gradient to add depth to the cards */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/20 pointer-events-none mix-blend-overlay" />
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
