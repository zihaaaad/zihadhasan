import { Suspense } from "react";
import { CoreService } from "@/lib/services/core-service";
import { ScrollPortfolio } from "@/components/home/scroll-portfolio";

export default async function Home() {
  const settings = await CoreService.getGlobalSettings().catch((err) => {
    console.error("[Home] Failed to fetch settings:", err);
    return null;
  });

  return (
    <main className="bg-background min-h-screen text-foreground selection:bg-primary selection:text-primary-foreground">
      <ScrollPortfolio settings={settings} />
    </main>
  );
}
