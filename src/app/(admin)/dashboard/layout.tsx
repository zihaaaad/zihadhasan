"use client";

import { AuthGuard } from "@/components/admin/auth-guard";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { MobileHeader } from "@/components/admin/mobile-header";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-gray-50 text-foreground selection:bg-primary/10 font-sans">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <MobileHeader />
          <main className="flex-1 overflow-y-auto max-h-[calc(100vh-4rem)] md:max-h-screen">
            <div className="p-4 md:p-8 lg:p-10 max-w-7xl mx-auto space-y-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={pathname}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
