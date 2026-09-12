import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop | Web Templates & Developer Resources",
  description: "Browse high-quality web templates, developer resources, and digital assets crafted by Zihad Hasan to accelerate your development workflow.",
  keywords: ["Shop", "Web Templates", "Developer Resources", "UI Kits", "Digital Assets", "Zihad Hasan"],
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
