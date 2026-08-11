"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowRight, Code, Briefcase, GraduationCap, Lightbulb } from "lucide-react";
import Link from "next/link";
import { GlobalSettings } from "@/lib/cms-service";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register GSAP plugins (Safe for Next.js SSR)
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface ScrollPortfolioProps {
  settings?: GlobalSettings | null;
}

export function ScrollPortfolio({ settings }: ScrollPortfolioProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // RESET: Clear any Tailwind transform classes by forcing GSAP initial states
    // This ensures GSAP has absolute control and prevents CSS conflict glitches
    gsap.set(".text-slide", { y: 100, opacity: 0 });
    gsap.set(".text-slide-0", { y: 0, opacity: 1 });
    
    gsap.set(".img-slide-3", { scale: 0.6, opacity: 0 }); // The finale image sits hidden & small

    // The Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true, // Pins the 100vh container to the screen
        scrub: 1, // 1-second lag for a fluid, viscous scroll feeling
        start: "top top",
        end: "+=4000", // Total scroll distance (4000px provides plenty of room for 4 slides)
        // markers: false, // Turn on for debugging scroll positions
      }
    });

    // 1. Transition: Slide 0 -> Slide 1
    tl.to(".text-slide-0", { y: -100, opacity: 0, duration: 1 }, 0)
      // Slide left (xPercent: -120) and flip backwards (rotationY: 15) to simulate falling into the background
      .to(".img-slide-0", { xPercent: -120, scale: 0.8, rotationY: 15, rotationZ: -5, opacity: 0, duration: 1, ease: "power1.inOut" }, 0)
      
      .to(".text-slide-1", { y: 0, opacity: 1, duration: 1, ease: "power2.out" }, 0.5) 
      .to({}, { duration: 0.7 }) // Plateau: Pause so the user can read Slide 1

    // 2. Transition: Slide 1 -> Slide 2
      .to(".text-slide-1", { y: -100, opacity: 0, duration: 1 })
      .to(".img-slide-1", { xPercent: -120, scale: 0.8, rotationY: 15, rotationZ: -5, opacity: 0, duration: 1, ease: "power1.inOut" }, "<") 
      
      .to(".text-slide-2", { y: 0, opacity: 1, duration: 1, ease: "power2.out" }, "<0.5")
      .to({}, { duration: 0.7 }) // Plateau: Pause so the user can read Slide 2

    // 3. Transition: Slide 2 -> Slide 3 (Grand Finale)
      .to(".text-slide-2", { y: -100, opacity: 0, duration: 1 })
      .to(".img-slide-2", { xPercent: -120, scale: 0.8, rotationY: 15, rotationZ: -5, opacity: 0, duration: 1, ease: "power1.inOut" }, "<")
      
      // The landscape grand finale image scales up to fill the space
      .to(".img-slide-3", { scale: 1, opacity: 1, duration: 1, ease: "power2.out" }, "<")
      .to(".text-slide-3", { y: 0, opacity: 1, duration: 1, ease: "power2.out" }, "<0.5")

      .to({}, { duration: 0.7 }); // Final Pause
      
  }, { scope: containerRef });

  const slides = [
    {
      id: 0,
      tagIcon: <Code className="h-4 w-4" />,
      tagText: "Hello, I am Zihad",
      title: <>The <span className="text-gray-400">Architect.</span></>,
      content: (
        <>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed font-light mb-6 md:mb-8 max-w-lg">
            I am a full-stack engineer and educator who bridges the gap between complex technical systems and human-centered design. I specialize in building scalable software, teaching artificial intelligence, and crafting digital experiences that feel intuitive and powerful.
          </p>
          <div className="flex flex-wrap gap-3 md:gap-4">
            <Link href="/contact" className="inline-flex h-10 md:h-12 items-center justify-center rounded-full bg-black px-6 md:px-8 text-xs md:text-sm font-semibold text-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-black/10">
              Get in Touch
            </Link>
            <Link href="/projects" className="inline-flex h-10 md:h-12 items-center justify-center rounded-full border border-gray-200 bg-white px-6 md:px-8 text-xs md:text-sm font-semibold text-black transition-all hover:bg-gray-50 hover:scale-105 active:scale-95">
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
      title: <>Empowering through <br className="hidden md:block"/><span className="text-gray-400">Education.</span></>,
      content: (
        <>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed font-light mb-4 md:mb-6 max-w-lg">
            I believe that technology is only as powerful as the people who know how to use it. That's why I dedicate my time to teaching digital literacy and Generative AI to hundreds of students, helping them unlock their full potential.
          </p>
          <ul className="space-y-2 md:space-y-4">
            {["500+ Students Mentored", "Curriculum Development", "AI-Assisted Learning", "Interactive Workshops"].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-sm md:text-base text-gray-800 font-medium">
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
      title: <>Building for the <br className="hidden md:block"/><span className="text-gray-400">Long Term.</span></>,
      content: (
        <>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed font-light mb-4 md:mb-6 max-w-lg">
            Great software isn't just about writing code; it's about solving real human problems elegantly. I approach every project with a mindset geared towards scalability, security, and exceptional user experience.
          </p>
          <blockquote className="border-l-4 border-black pl-4 md:pl-6 italic text-lg md:text-xl text-gray-800 my-6 md:my-8 py-1 md:py-2 max-w-lg">
            "Technology should fade into the background, allowing human creativity and connection to take center stage."
          </blockquote>
          <Link href="/blog" className="font-semibold text-black hover:text-gray-600 transition-colors inline-flex items-center gap-2 text-sm md:text-base">
            Read my latest thoughts <ArrowRight className="h-4 w-4" />
          </Link>
        </>
      )
    },
    {
      id: 3,
      tagIcon: <Briefcase className="h-4 w-4" />,
      tagText: "Career Journey",
      title: <>Engineering <br className="hidden md:block"/><span className="text-gray-400">Excellence.</span></>,
      content: (
        <div className="space-y-6 md:space-y-8 max-w-lg">
          <div className="border-l-2 border-gray-100 pl-4 md:pl-6 relative">
            <div className="absolute w-3 h-3 bg-black rounded-full -left-[7px] top-1.5 md:top-2" />
            <h3 className="text-lg md:text-xl font-bold">Core AI Team & Trainer</h3>
            <p className="text-xs md:text-sm font-mono text-gray-500 mb-2 md:mb-3 mt-1">As-Sunnah Foundation • 2024 - Present</p>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              Architected enterprise event automation using Google Apps Script. Managed large-scale AI instruction and mitigated critical data breaches.
            </p>
          </div>
          <div className="border-l-2 border-gray-100 pl-4 md:pl-6 relative">
            <div className="absolute w-3 h-3 bg-gray-300 rounded-full -left-[7px] top-1.5 md:top-2" />
            <h3 className="text-lg md:text-xl font-bold">Assistant Teacher & IT Admin</h3>
            <p className="text-xs md:text-sm font-mono text-gray-500 mb-2 md:mb-3 mt-1">Real Multimedia School • 2022 - 2023</p>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
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
        The GSAP Pinned Container 
        Must be exactly 100vh. GSAP wraps it in a pin-spacer automatically.
      */}
      <div ref={containerRef} className="h-screen w-full relative overflow-hidden bg-white">
        
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-4 md:gap-12 lg:gap-20 h-full py-24 md:py-20 relative">
          
          {/* 
            IMAGES (Top on mobile, Right on desktop) 
            order-first on mobile ensures images are displayed above the text.
          */}
          <div className="flex w-full h-[40%] md:h-full md:w-[55%] items-center justify-center relative perspective-[1200px] z-40 order-first md:order-last">
            
            {/* Image 3: Grand Finale Widescreen */}
            <div className="img-slide-3 absolute w-full max-w-[320px] md:max-w-[600px] aspect-[4/3] lg:aspect-video rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl bg-gray-100 z-10 will-change-transform">
              <Image 
                src="/images/portfolio/Man_working_at_desk.png"
                alt="Zihad Hasan working at desk"
                fill 
                className="object-cover" 
                priority
              />
              <div className="absolute inset-0 bg-black/5 mix-blend-overlay pointer-events-none" />
            </div>

            {/* Images 2, 1, 0: Portrait Stack */}
            <div className="img-slide-2 absolute w-[70%] md:w-[85%] max-w-[260px] md:max-w-[400px] aspect-[3/4] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl bg-gray-100 z-20 will-change-transform">
              <Image src="/images/portfolio/Man_thinking.png" alt="Thinking" fill className="object-cover" priority />
            </div>
            
            <div className="img-slide-1 absolute w-[70%] md:w-[85%] max-w-[260px] md:max-w-[400px] aspect-[3/4] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl bg-gray-100 z-30 will-change-transform">
              <Image src="/images/portfolio/Man_speaking_in_technology_class.png" alt="Teaching" fill className="object-cover" priority />
            </div>

            <div className="img-slide-0 absolute w-[70%] md:w-[85%] max-w-[260px] md:max-w-[400px] aspect-[3/4] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl bg-gray-100 z-40 will-change-transform">
              <Image src="/images/portfolio/Man_posing_for_professional_port.png" alt="Professional Portrait" fill className="object-cover" priority />
            </div>

          </div>

          {/* 
            TEXT (Bottom on mobile, Left on desktop) 
            Higher z-index (50) so the images slide UNDER the text column perfectly.
          */}
          <div className="w-full h-[60%] md:h-full md:w-[45%] relative z-50 order-last md:order-first flex items-start md:items-center">
            {slides.map((slide, index) => (
              <div
                key={`text-${slide.id}`}
                className={`text-slide text-slide-${index} absolute inset-x-0 top-0 md:inset-0 flex flex-col justify-start md:justify-center pointer-events-none`}
              >
                {/* 
                  Backdrop blur removed on mobile so it doesn't blur the background. 
                  On desktop, a subtle blur ensures text is always legible if an image slides directly under it.
                */}
                <div className="pointer-events-auto bg-white/60 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none p-4 md:p-0 rounded-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 bg-gray-50 text-[10px] md:text-xs font-mono uppercase tracking-widest text-gray-600 mb-4 md:mb-6 shadow-sm">
                    {slide.tagIcon} {slide.tagText}
                  </div>
                  <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-4 md:mb-8 leading-[1.1]">
                    {slide.title}
                  </h2>
                  {slide.content}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
