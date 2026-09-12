import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tools | Web Development & AI Utilities",
  description: "A collection of web development and AI tools built by Zihad Hasan to enhance productivity.",
  keywords: ["Tools", "Developer Tools", "AI Tools", "Productivity", "Web Development", "Zihad Hasan"],
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
