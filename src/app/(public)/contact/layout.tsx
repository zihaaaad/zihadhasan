import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Hire a Generative AI & Full-Stack Developer",
  description: "Get in touch with Zihad Hasan — based in Dhaka, Bangladesh — for full-stack development, workflow automation, security reviews, or Generative AI training.",
  keywords: ["Contact", "Hire Full Stack Developer", "Hire AI Developer", "Workflow Automation", "Security Consulting", "Generative AI Training", "Dhaka", "Zihad Hasan"],
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
