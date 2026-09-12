import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events | Tech Talks & AI Training",
  description: "Join Zihad Hasan in upcoming tech talks, webinars, and in-person events focused on Web Development and Generative AI.",
  keywords: ["Events", "Tech Talks", "Webinars", "AI Training", "Web Development Seminars", "Zihad Hasan"],
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
