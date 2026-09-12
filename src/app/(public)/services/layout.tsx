import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | Full-Stack, AI Automation & Security",
  description: "Full-stack development, Generative AI and workflow automation, and security reviews by Zihad Hasan — from Next.js and Laravel builds to Google Apps Script automation and penetration testing.",
  keywords: ["Services", "Full Stack Development", "Workflow Automation", "Google Apps Script", "Generative AI Integration", "Penetration Testing", "Security Audit", "AI Consulting", "Zihad Hasan"],
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
