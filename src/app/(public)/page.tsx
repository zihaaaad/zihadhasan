import { Suspense } from "react";
import { Hero } from "@/components/home/hero";
import { TechMarquee } from "@/components/home/tech-marquee";
import { BentoShowcase } from "@/components/home/bento-showcase";
import { CourseTeaser } from "@/components/home/course-teaser";
import { PhilosophySection } from "@/components/home/philosophy-section";
import { NewsletterForm } from "@/components/shared/newsletter-form";
import { ExperienceSection } from "@/components/home/experience-section";
import { SkillsSection } from "@/components/home/skills-section";
import { Anime3DScroll } from "@/components/home/anime-3d-scroll";
// Modular Imports for Tree Shaking
import { CoreService } from "@/lib/services/core-service";
import { ProjectService } from "@/lib/services/project-service";
import { CourseService } from "@/lib/services/course-service";
import { BlogService } from "@/lib/services/blog-service";

import { Section } from "./components/section"; // Helper component

// --- Suspense Wrappers ---

async function HeroSection() {
 const [settings, projects, tools] = await Promise.all([
 CoreService.getGlobalSettings().catch((err) => {
 console.error("[HeroSection] Failed to fetch settings:", err);
 return null;
 }),
 ProjectService.getProjects(5).catch((err) => {
 console.error("[HeroSection] Failed to fetch projects:", err);
 return [];
 }),
 ProjectService.getTools(5).catch((err) => {
 console.error("[HeroSection] Failed to fetch tools:", err);
 return [];
 })
 ]);

 return (
 <Hero
 settings={settings}
 projectCount={projects.length}
 toolCount={tools.length}
 />
 );
}

async function BentoSection() {
 const [featuredProject, featuredTool, featuredBlog] = await Promise.all([
 ProjectService.getLatestProject(),
 ProjectService.getLatestTool(),
 BlogService.getLatestPost(true)
 ]);

 return (
 <Section>
 <BentoShowcase
 project={featuredProject}
 blog={featuredBlog}
 tool={featuredTool}
 />
 </Section>
 );
}

async function CourseSection() {
 const courses = await CourseService.getPublishedCourses().catch((err) => {
 console.error("[CourseSection] Failed to fetch courses:", err);
 return [];
 });

 return (
 <Section>
 <CourseTeaser courses={courses.slice(0, 3)} />
 </Section>
 );
}

// --- Skeletons ---
function HeroSkeleton() {
 return <div className="h-screen w-full bg-gray-50 animate-pulse" />;
}

function SectionSkeleton() {
 return <div className="h-[500px] w-full bg-gray-100/20 animate-pulse my-20" />;
}

export default function Home() {
 return (
 <main className="bg-white min-h-screen text-black overflow-hidden selection:bg-white selection:text-black relative">
 {/* Global Noise Texture for that "Film/Figma" Feel */}
 <div className="noise-bg" />

 <>
 {/* A. Hero Section - Suspense enables instant page load while data fetches */}
 <Suspense fallback={<HeroSkeleton />}>
 <div>
 <HeroSection />
 </div>
 </Suspense>

 {/* B. Tech Marquee - Cleaner, Floating */}
 <div className="relative z-10 w-full max-w-7xl mx-auto px-4 border-b border-gray-100">
 <TechMarquee />
 </div>

 {/* C. Bento Showcase - Massive Spacing */}
 <Suspense fallback={<SectionSkeleton />}>
 <div>
 <BentoSection />
 </div>
 </Suspense>

 {/* D. Course Teaser */}
 <Suspense fallback={<SectionSkeleton />}>
 <div>
 <CourseSection />
 </div>
 </Suspense>

 {/* E. Experience Section */}
 <div>
 <ExperienceSection />
 </div>
 
 {/* E2. Skills Section */}
 <div>
 <SkillsSection />
 </div>

 {/* F. Philosophy / About - Clean Component */}
 <div>
 <PhilosophySection />
 </div>

 {/* G. Newsletter */}
 <div>
 <Section className="py-40 px-4 container mx-auto relative z-10">
 <div className="relative rounded-[2.5rem] overflow-hidden bg-gray-100/30 border border-gray-200 p-8 md:p-24 text-center group hover:border-gray-200 transition-all duration-500">
 {/* Subtle Grid Background for this card too */}
 <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

 {/* Background Glow - Reduced intensity, White */}
 <div className="absolute top-0 right-1/2 w-[300px] h-[300px] bg-white rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-white transition-all duration-700" />

 <div className="relative z-10 max-w-2xl mx-auto space-y-8">
 <div>
 <h2 className="text-3xl md:text-5xl font-bold text-black mb-6 tracking-tighter">Join the Inner Circle</h2>
 <p className="text-emerald-100/70 text-lg font-light leading-relaxed">
 Get weekly insights on full-stack development, AI engineering, and building software products from scratch.
 </p>
 </div>

 <div className="max-w-md mx-auto">
 <NewsletterForm />
 </div>

 <div className="pt-8 text-gray-800 text-[10px] uppercase tracking-[0.2em] font-medium">
 No spam. Unsubscribe at any time.
 </div>
 </div>
 </div>
 </Section>
 </div>
 </>
 </main>
 );
}
