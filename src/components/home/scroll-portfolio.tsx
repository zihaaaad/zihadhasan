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
      // Slide right (xPercent: 120) and flip backwards (rotationY: -15) to simulate falling into the right background
      .to(".img-slide-0", { xPercent: 120, scale: 0.8, rotationY: -15, rotationZ: 5, opacity: 0, duration: 1, ease: "power1.inOut" }, 0)
      
      .to(".text-slide-1", { y: 0, opacity: 1, duration: 1, ease: "power2.out" }, 0.5) 
      .to({}, { duration: 0.7 }) // Plateau: Pause so the user can read Slide 1

    // 2. Transition: Slide 1 -> Slide 2
      .to(".text-slide-1", { y: -100, opacity: 0, duration: 1 })
      .to(".img-slide-1", { xPercent: 120, scale: 0.8, rotationY: -15, rotationZ: 5, opacity: 0, duration: 1, ease: "power1.inOut" }, "<") 
      
      .to(".text-slide-2", { y: 0, opacity: 1, duration: 1, ease: "power2.out" }, "<0.5")
      .to({}, { duration: 0.7 }) // Plateau: Pause so the user can read Slide 2

    // 3. Transition: Slide 2 -> Slide 3 (Grand Finale)
      .to(".text-slide-2", { y: -100, opacity: 0, duration: 1 })
      .to(".img-slide-2", { xPercent: 120, scale: 0.8, rotationY: -15, rotationZ: 5, opacity: 0, duration: 1, ease: "power1.inOut" }, "<")
      
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
      title: <>The <span className="text-muted-foreground/80">Architect.</span></>,
      content: (
        <>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed font-light mb-6 md:mb-8 max-w-lg">
            I am a Generative AI and Full-Stack Developer on a core AI team, building scalable workflow automation and system architecture with a security engineer&apos;s instincts. I ship in Next.js, Laravel and Python, teach Generative AI tools to hundreds of students, and wrote <em>Digital Shikar</em> on digital security and privacy.
          </p>
          <div className="flex flex-wrap gap-3 md:gap-4">
            <Link href="/contact" className="inline-flex h-10 md:h-12 items-center justify-center rounded-full bg-primary px-6 md:px-8 text-xs md:text-sm font-semibold text-primary-foreground transition-all hover:scale-105 active:scale-95 shadow-lg shadow-black/10">
              Let's Collaborate
            </Link>
            <Link href="/projects" className="inline-flex h-10 md:h-12 items-center justify-center rounded-full border border-border bg-background px-6 md:px-8 text-xs md:text-sm font-semibold text-foreground transition-all hover:bg-gray-50 hover:scale-105 active:scale-95">
              Explore Archive <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </>
      )
    },
    {
      id: 1,
      tagIcon: <GraduationCap className="h-4 w-4" />,
      tagText: "Digital Literacy",
      title: <>Empowering through <br className="hidden md:block"/><span className="text-muted-foreground/80">Education.</span></>,
      content: (
        <>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed font-light mb-4 md:mb-6 max-w-lg">
            Technology is only as powerful as the people who know how to use it. As an assistant instructor I have trained hundreds of students across batches 28–35 on Generative AI tools, prompt engineering and ethical, safe use of the web.
          </p>
          <ul className="space-y-2 md:space-y-4">
            {["Hundreds of Students Trained", "Batch 28–35 AI Curriculum", "ChatGPT, Gemini CLI & AI Studio", "Interactive Workshops"].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-sm md:text-base text-gray-800 font-medium">
                <div className="h-1.5 w-1.5 bg-primary rounded-full" />
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
      title: <>Building for the <br className="hidden md:block"/><span className="text-muted-foreground/80">Long Term.</span></>,
      content: (
        <>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed font-light mb-4 md:mb-6 max-w-lg">
            Great software isn&apos;t just about writing code; it&apos;s about solving real human problems elegantly — and safely. Every system I design starts from the same three questions: will it scale, will it hold up under attack, and will it feel obvious to the person using it.
          </p>
          <blockquote className="border-l-4 border-primary pl-4 md:pl-6 italic text-lg md:text-xl text-gray-800 my-6 md:my-8 py-1 md:py-2 max-w-lg">
            "Technology should fade into the background, allowing human creativity and connection to take center stage."
          </blockquote>
          <Link href="/blog" className="font-semibold text-foreground hover:text-gray-600 transition-colors inline-flex items-center gap-2 text-sm md:text-base">
            Read my latest thoughts <ArrowRight className="h-4 w-4" />
          </Link>
        </>
      )
    },
    {
      id: 3,
      tagIcon: <Briefcase className="h-4 w-4" />,
      tagText: "Career Journey",
      title: <>Engineering <br className="hidden md:block"/><span className="text-muted-foreground/80">Excellence.</span></>,
      content: (
        <div className="space-y-6 md:space-y-8 max-w-lg">
          <div className="border-l-2 border-gray-100 pl-4 md:pl-6 relative">
            <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1.5 md:top-2" />
            <h3 className="text-lg md:text-xl font-bold">Core AI Team Member & Assistant Instructor</h3>
            <p className="text-xs md:text-sm font-mono text-muted-foreground mb-2 md:mb-3 mt-1">As-Sunnah Foundation & ASSDI • May 2024 – Present</p>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              Architected a Google Apps Script event automation system handling concurrent registrations, auto-generated PDF tickets and dynamic email delivery. Trained hundreds of students on Generative AI, and secured participant data within 24 hours after a critical external breach.
            </p>
          </div>
          <div className="border-l-2 border-gray-100 pl-4 md:pl-6 relative">
            <div className="absolute w-3 h-3 bg-gray-300 rounded-full -left-[7px] top-1.5 md:top-2" />
            <h3 className="text-lg md:text-xl font-bold">Internal Member</h3>
            <p className="text-xs md:text-sm font-mono text-muted-foreground mb-2 md:mb-3 mt-1">Cyber Bangla • Jan 2020 – Present</p>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              Penetration testing, cybersecurity workshops and Capture The Flag competitions — the security practice that informs how I architect everything else.
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="bg-background text-foreground relative">
      
      {/* 
        The GSAP Pinned Container 
        Must be exactly 100vh. GSAP wraps it in a pin-spacer automatically.
      */}
      <div ref={containerRef} className="h-screen w-full relative overflow-hidden bg-background">
        
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-4 md:gap-12 lg:gap-20 h-full py-8 pt-20 md:py-20 relative z-10">
          
          {/* 
            IMAGES (Top on mobile, Right on desktop) 
            order-first on mobile ensures images are displayed above the text.
          */}
          <div className="flex w-full h-[45%] md:h-full md:w-[50%] items-center justify-center relative perspective-[1200px] z-40 order-first md:order-last">
            
            {/* Image 3: Grand Finale */}
            <div className="img-slide-3 absolute w-[75%] md:w-[90%] max-w-[280px] md:max-w-[420px] aspect-[4/5] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl bg-gray-100 z-10 will-change-transform">
              <Image src="/images/portfolio/Man_typing_on_laptop.webp" alt="Development" fill className="object-cover" priority />
            </div>

            {/* Image 2 */}
            <div className="img-slide-2 absolute w-[75%] md:w-[90%] max-w-[280px] md:max-w-[420px] aspect-[4/5] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl bg-gray-100 z-20 will-change-transform">
              <Image src="/images/portfolio/Man_working_at_computer_workstation.webp" alt="Thinking" fill className="object-cover" priority />
            </div>
            
            {/* Image 1 */}
            <div className="img-slide-1 absolute w-[75%] md:w-[90%] max-w-[280px] md:max-w-[420px] aspect-[4/5] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl bg-gray-100 z-30 will-change-transform">
              <Image src="/images/portfolio/Man_speaking_in_technology_class.webp" alt="Teaching" fill className="object-cover" priority />
            </div>

            {/* Image 0 */}
            <div className="img-slide-0 absolute w-[75%] md:w-[90%] max-w-[280px] md:max-w-[420px] aspect-[4/5] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl bg-gray-100 z-40 will-change-transform">
              <Image src="/images/portfolio/Man_posing_for_studio_portrait.webp" alt="Professional Portrait" fill className="object-cover" priority />
            </div>

          </div>

          {/* 
            TEXT (Bottom on mobile, Left on desktop) 
            Higher z-index (50) so the images slide UNDER the text column perfectly.
          */}
          <div className="w-full h-[55%] md:h-full md:w-[50%] relative z-50 order-last md:order-first flex items-start md:items-center">
            {slides.map((slide, index) => (
              <div
                key={`text-${slide.id}`}
                className={`text-slide text-slide-${index} absolute inset-x-0 top-0 md:inset-0 flex flex-col justify-start md:justify-center pointer-events-none`}
              >
                {/* 
                  Backdrop blur removed on mobile so it doesn't blur the background. 
                  On desktop, a subtle blur ensures text is always legible if an image slides directly under it.
                */}
                               <div className="pointer-events-auto bg-background p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-gray-50 text-[10px] md:text-xs font-mono uppercase tracking-widest text-gray-600 mb-4 md:mb-6 shadow-sm">
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
