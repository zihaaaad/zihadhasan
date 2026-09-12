import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Articles on Web Development & Generative AI",
  description: "Read the latest articles by Zihad Hasan on Web Development, Software Engineering, and Generative AI tools.",
  keywords: ["Blog", "Zihad Hasan", "Web Development", "Generative AI", "Software Engineering", "Articles", "Tech Blog"],
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
