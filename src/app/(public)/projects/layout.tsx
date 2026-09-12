import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Full-Stack, AI & Automation Engineering",
  description: "Explore Zihad Hasan's portfolio — Fast Service, Rupantor, EchoScript, Equilivant and open-source GitHub repositories spanning Next.js, Electron, Firebase and Generative AI.",
  keywords: ["Projects", "Portfolio", "Full Stack Developer", "AI Engineering", "Generative AI", "Electron", "Next.js", "Firebase", "GitHub", "Zihad Hasan"],
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
