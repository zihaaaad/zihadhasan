import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Books | Digital Shikar & Other Publications",
  description: "Books by Zihad Hasan, including Digital Shikar (ডিজিটাল শিকার) — a Bengali guide to smartphone privacy, data tracking and safe internet use in the digital era.",
  keywords: ["Books", "Digital Shikar", "ডিজিটাল শিকার", "Cybersecurity Book", "Digital Privacy", "Bengali Cybersecurity", "Zihad Hasan"],
};

export default function BooksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
