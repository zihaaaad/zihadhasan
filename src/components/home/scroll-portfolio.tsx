"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowRight, Code, Briefcase, GraduationCap, Lightbulb } from "lucide-react";
import Link from "next/link";
import { GlobalSettings } from "@/lib/cms-service";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface ScrollPortfolioProps {
  settings?: GlobalSettings | null;
}

export function ScrollPortfolio({ settings }: ScrollPortfolioProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // The timeline logic exactly as requested by the user's wireframe
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 1, // Smooth viscous scrubbing effect
        start: "top top",
        end: "+=3500", // Controls the scroll duration length (3500px is a smooth length for 4 slides)
      }
    });

    // 1. First Transition: Slide 0 -> Slide 1
    tl.to(".text-slide-0", { y: -100, opacity: 0, duration: 1 }, 0)
      .to(".img-slide-0", { xPercent: -120, scale: 0.8, rotationY: -15, rotationZ: -5, opacity: 0, duration: 1, transformOrigin: "left center" }, 0)
      .to(".text-slide-1", { y: 0, opacity: 1, duration: 1 }, 0.5) // New text slides in halfway through
      
      // Pause/Plateau to comfortably read Slide 1
      .to({}, { duration: 0.5 }) 

    // 2. Second Transition: Slide 1 -> Slide 2
      .to(".text-slide-1", { y: -100, opacity: 0, duration: 1 })
      .to(".img-slide-1", { xPercent: -120, scale: 0.8, rotationY: -15, rotationZ: -5, opacity: 0, duration: 1, transformOrigin: "left center" }, "<") 
      .to(".text-slide-2", { y: 0, opacity: 1, duration: 1 }, "<0.5")

      // Pause/Plateau to comfortably read Slide 2
      .to({}, { duration: 0.5 })

    // 3. Third Transition: Slide 2 -> Slide 3 (Grand Finale)
      .to(".text-slide-2", { y: -100, opacity: 0, duration: 1 })
      .to(".img-slide-2", { xPercent: -120, scale: 0.8, rotationY: -15, rotationZ: -5, opacity: 0, duration: 1, transformOrigin: "left center" }, "<")
      
      // The landscape grand finale image scales up to fill the space
      .to(".img-slide-3", { scale: 1, opacity: 1, duration: 1 }, "<")
      .to(".text-slide-3", { y: 0, opacity: 1, duration: 1 }, "<0.5")

      // Final Pause at the bottom
      .to({}, { duration: 0.5 });
      
  }, { scope: containerRef });

  // Slide Data
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
      )
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
      )
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
      )
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
      )
    }
  ];

  return (
    <div className="bg-white text-black relative">
      
      {/* 
        GSAP PINNED CONTAINER: 
        This is a standard 100vh height container. GSAP's pin: true will automatically wrap it in a pin-spacer 
        and handle all the scroll padding (unlike Framer Motion where we had to manually set it to 500vh). 
      */}
      <div ref={containerRef} className="h-screen w-full relative overflow-hidden bg-white">
        
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12 lg:gap-20 h-full py-20 relative">
          
          {/* 
            LEFT COLUMN: Text Content
            z-index 50 ensures that images slide seamlessly UNDER the text.
          */}
          <div className="w-full md:w-[45%] relative h-full z-50">
            {slides.map((slide, index) => (
              <div
                key={`text-${slide.id}`}
                className={`text-slide-${index} absolute inset-0 flex flex-col justify-center pointer-events-none ${
                  index === 0 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[100px]"
                }`}
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
              </div>
            ))}
          </div>

          {/* 
            RIGHT COLUMN: Images Stack (Deck of Cards)
            perspective creates the 3D flip effect.
          */}
          <div className="hidden md:flex w-full md:w-[55%] h-full items-center justify-center relative perspective-[1200px] z-40">
            
            {/* Image 3: Grand Finale Widescreen. Starts completely hidden and scaled down */}
            <div className="img-slide-3 absolute w-full max-w-[600px] aspect-[4/3] lg:aspect-video rounded-3xl overflow-hidden shadow-2xl bg-gray-100 z-10 opacity-0 scale-[0.6]">
              <Image 
                src="/images/portfolio/Man_working_at_desk.png"
                alt="Zihad Hasan working at desk"
                fill 
                className="object-cover" 
                priority
              />
              <div className="absolute inset-0 bg-black/5 mix-blend-overlay pointer-events-none" />
            </div>

            {/* Images 2, 1, 0: The Portrait Stack */}
            <div className="img-slide-2 absolute w-[85%] max-w-[400px] aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl bg-gray-100 z-20">
              <Image src="/images/portfolio/Man_thinking.png" alt="Thinking" fill className="object-cover" priority />
            </div>
            
            <div className="img-slide-1 absolute w-[85%] max-w-[400px] aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl bg-gray-100 z-30">
              <Image src="/images/portfolio/Man_speaking_in_technology_class.png" alt="Teaching" fill className="object-cover" priority />
            </div>

            <div className="img-slide-0 absolute w-[85%] max-w-[400px] aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl bg-gray-100 z-40">
              <Image src="/images/portfolio/Man_posing_for_professional_port.png" alt="Professional Portrait" fill className="object-cover" priority />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
