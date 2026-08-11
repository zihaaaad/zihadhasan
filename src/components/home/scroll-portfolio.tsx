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
  
  // Track scroll progress over a very tall container (500vh) to give plenty of scrolling room
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // ==========================================
  // PERFECTLY CALCULATED SCROLL RANGES
  // ==========================================
  // P0 (0.00) to P1 (0.15): Slide 0 is fully visible and idle.
  // P1 (0.15) to P2 (0.30): Transition Slide 0 -> Slide 1
  // P2 (0.30) to P3 (0.45): Slide 1 is fully visible and idle.
  // P3 (0.45) to P4 (0.60): Transition Slide 1 -> Slide 2
  // P4 (0.60) to P5 (0.75): Slide 2 is fully visible and idle.
  // P5 (0.75) to P6 (0.90): Transition Slide 2 -> Slide 3 (Finale)
  // P6 (0.90) to P7 (1.00): Slide 3 is fully visible and idle.

  // --- TEXT ANIMATIONS (Vertical Slide Up & Fade) ---
  const y0 = useTransform(scrollYProgress, [0.15, 0.3], ["0px", "-100px"]);
  const o0 = useTransform(scrollYProgress, [0.15, 0.25], [1, 0]);

  const y1 = useTransform(scrollYProgress, [0.15, 0.3, 0.45, 0.6], ["100px", "0px", "0px", "-100px"]);
  const o1 = useTransform(scrollYProgress, [0.2, 0.3, 0.45, 0.55], [0, 1, 1, 0]);

  const y2 = useTransform(scrollYProgress, [0.45, 0.6, 0.75, 0.9], ["100px", "0px", "0px", "-100px"]);
  const o2 = useTransform(scrollYProgress, [0.5, 0.6, 0.75, 0.85], [0, 1, 1, 0]);

  const y3 = useTransform(scrollYProgress, [0.75, 0.9], ["100px", "0px"]);
  const o3 = useTransform(scrollYProgress, [0.8, 0.9], [0, 1]);

  const textTransforms = [
    { y: y0, opacity: o0 },
    { y: y1, opacity: o1 },
    { y: y2, opacity: o2 },
    { y: y3, opacity: o3 },
  ];

  // --- IMAGE ANIMATIONS (Deck of Cards effect) ---
  // Top image slides left (towards the text), scales down, and flips back in 3D perspective.
  // Because the text column has a higher z-index, the image slides UNDER the text, disappearing elegantly.

  // Image 0 (Top card)
  const xImg0 = useTransform(scrollYProgress, [0.15, 0.3], ["0%", "-100%"]); 
  const sImg0 = useTransform(scrollYProgress, [0.15, 0.3], [1, 0.8]); 
  const rY0 = useTransform(scrollYProgress, [0.15, 0.3], ["0deg", "-15deg"]); // 3D flip backwards
  const rZ0 = useTransform(scrollYProgress, [0.15, 0.3], ["0deg", "-5deg"]);  // 2D tilt
  const oImg0 = useTransform(scrollYProgress, [0.25, 0.3], [1, 0]); 
  
  // Image 1
  const xImg1 = useTransform(scrollYProgress, [0.45, 0.6], ["0%", "-100%"]);
  const sImg1 = useTransform(scrollYProgress, [0.45, 0.6], [1, 0.8]);
  const rY1 = useTransform(scrollYProgress, [0.45, 0.6], ["0deg", "-15deg"]);
  const rZ1 = useTransform(scrollYProgress, [0.45, 0.6], ["0deg", "-5deg"]);
  const oImg1 = useTransform(scrollYProgress, [0.55, 0.6], [1, 0]);

  // Image 2
  const xImg2 = useTransform(scrollYProgress, [0.75, 0.9], ["0%", "-100%"]);
  const sImg2 = useTransform(scrollYProgress, [0.75, 0.9], [1, 0.8]);
  const rY2 = useTransform(scrollYProgress, [0.75, 0.9], ["0deg", "-15deg"]);
  const rZ2 = useTransform(scrollYProgress, [0.75, 0.9], ["0deg", "-5deg"]);
  const oImg2 = useTransform(scrollYProgress, [0.85, 0.9], [1, 0]);

  // Image 3 (Grand Finale Widescreen)
  // Sits at the very bottom. Scales up powerfully as the final portrait card flies away.
  const sImg3 = useTransform(scrollYProgress, [0.75, 0.9], [0.6, 1.0]);
  const oImg3 = useTransform(scrollYProgress, [0.75, 0.85], [0, 1]);

  const imgTransforms = [
    { x: xImg0, scale: sImg0, rotateY: rY0, rotateZ: rZ0, opacity: oImg0, zIndex: 40 },
    { x: xImg1, scale: sImg1, rotateY: rY1, rotateZ: rZ1, opacity: oImg1, zIndex: 30 },
    { x: xImg2, scale: sImg2, rotateY: rY2, rotateZ: rZ2, opacity: oImg2, zIndex: 20 },
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
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-light mb-8 max-w-lg">
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
          <p className="text-lg text-gray-600 leading-relaxed font-light mb-6 max-w-lg">
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
          <p className="text-lg text-gray-600 leading-relaxed font-light mb-6 max-w-lg">
            Great software isn't just about writing code; it's about solving real human problems elegantly. I approach every project with a mindset geared towards scalability, security, and exceptional user experience.
          </p>
          <blockquote className="border-l-4 border-black pl-6 italic text-xl text-gray-800 my-8 py-2 max-w-lg">
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
        <div className="space-y-8 max-w-lg">
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
        TALL CONTAINER: 500vh tall to allow plenty of scrubbing room and plateaus where the user can comfortably read text.
      */}
      <div ref={containerRef} className="h-[500vh] relative w-full">
        
        {/* 
          STICKY WINDOW: 100vh tall, stays pinned to the screen while you scroll.
        */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
          
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12 lg:gap-20 h-full py-20 relative">
            
            {/* 
              LEFT COLUMN: Text Content (Scrubbed Vertical Slide) 
              z-index 50 ensures that when the images slide left, they slide UNDER the text column elegantly.
            */}
            <div className="w-full md:w-[45%] relative h-full z-50">
              {slides.map((slide, index) => (
                <motion.div
                  key={`text-${slide.id}`}
                  style={{
                    y: textTransforms[index].y,
                    opacity: textTransforms[index].opacity,
                  }}
                  className="absolute inset-0 flex flex-col justify-center pointer-events-none"
                >
                  <div className="pointer-events-auto bg-white/80 backdrop-blur-md md:bg-transparent md:backdrop-blur-none p-6 md:p-0 rounded-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 bg-gray-50 text-xs font-mono uppercase tracking-widest text-gray-600 mb-6 shadow-sm">
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

            {/* 
              RIGHT COLUMN: Images (Scrubbed Stack of Cards) 
              perspective ensures the rotateY (3D flip) looks realistic.
            */}
            <div className="hidden md:flex w-full md:w-[55%] h-full items-center justify-center relative perspective-[1200px] z-40">
              
              {/* Image 3: Grand Finale (Landscape) - Bottom of the stack */}
              <motion.div
                style={{
                  scale: sImg3,
                  opacity: oImg3,
                  zIndex: 10,
                }}
                className="absolute w-full aspect-[4/3] lg:aspect-video rounded-3xl overflow-hidden shadow-2xl border-[6px] border-white bg-gray-100"
              >
                <Image 
                  src={slides[3].imageSrc}
                  alt={slides[3].imageAlt}
                  fill 
                  className="object-cover" 
                  priority
                />
                <div className="absolute inset-0 bg-black/5 mix-blend-overlay pointer-events-none" />
              </motion.div>

              {/* Images 0, 1, 2 (Portraits) - Top of the stack sliding away */}
              {[2, 1, 0].map((idx) => (
                <motion.div
                  key={`img-${slides[idx].id}`}
                  style={{
                    x: imgTransforms[idx].x,
                    scale: imgTransforms[idx].scale,
                    rotateY: imgTransforms[idx].rotateY,
                    rotateZ: imgTransforms[idx].rotateZ,
                    opacity: imgTransforms[idx].opacity,
                    zIndex: imgTransforms[idx].zIndex,
                    transformOrigin: "left center" 
                  }}
                  className="absolute w-[75%] max-w-md aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-[6px] border-white bg-gray-100"
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
