import { Suspense } from "react";
import { CoreService } from "@/lib/services/core-service";
import { ScrollPortfolio } from "@/components/home/scroll-portfolio";

export default async function Home() {
  const settings = await CoreService.getGlobalSettings().catch((err) => {
    console.error("[Home] Failed to fetch settings:", err);
    return null;
  });

  return (
    <main className="bg-white min-h-screen text-black overflow-hidden selection:bg-black selection:text-white">
      <ScrollPortfolio settings={settings} />
    </main>
  );
}
