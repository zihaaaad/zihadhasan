import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Courses | Learn Web Development & Generative AI",
  description: "Join Zihad Hasan's premium courses to master Web Development and learn how to leverage Generative AI tools to boost your productivity.",
  keywords: ["Courses", "AI Teacher", "Generative AI Tools", "Web Development Courses", "Learn AI", "Zihad Hasan"],
};

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
