"use client";

import { useState } from "react";
import Link from "next/link";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderGit,
  Hammer,
  PenTool,
  Settings,
  LogOut,
  Menu,
  Calendar,
  Mail,
  Users,
  BookOpen,
  Activity,
  ChevronLeft,
  ChevronRight,
  ShoppingBag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const sidebarItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Courses", href: "/dashboard/courses", icon: BookOpen },
  { label: "Books", href: "/dashboard/books", icon: BookOpen },
  { label: "Events", href: "/dashboard/events", icon: Calendar },
  { label: "Projects", href: "/dashboard/projects", icon: FolderGit },
  { label: "AI Tools", href: "/dashboard/tools", icon: Hammer },
  { label: "Products", href: "/dashboard/products", icon: ShoppingBag },
  { label: "Blog", href: "/dashboard/blog", icon: PenTool },
  { label: "Registrations", href: "/dashboard/registrations", icon: Users },
  { label: "Users", href: "/dashboard/users", icon: Users },
  { label: "Newsletter", href: "/dashboard/newsletter", icon: Mail },
  { label: "Messages", href: "/dashboard/messages", icon: Mail },
  { label: "System", href: "/dashboard/system", icon: Activity },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <motion.aside
      className="hidden relative flex-col border-r border-border bg-background md:flex"
      initial={{ width: 256 }}
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 z-50 h-6 w-6 rounded-full border border-border bg-background text-muted-foreground hover:bg-gray-50 shadow-sm"
      >
        {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>

      <div className={cn("flex h-16 items-center px-6 overflow-hidden border-b border-gray-100", isCollapsed && "px-2 justify-center")}>
        <span className="text-xl font-bold tracking-tighter text-foreground whitespace-nowrap">
          {isCollapsed ? "Z" : <>Zihad<span className="text-muted-foreground/80">.Admin</span></>}
        </span>
      </div>

      <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-xl py-2.5 transition-all relative group overflow-hidden font-medium",
                isCollapsed ? "justify-center px-2" : "px-4 gap-3",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-gray-100 hover:text-foreground"
              )}
            >
              <item.icon strokeWidth={2} className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
              {isCollapsed && (
                <div className="absolute left-14 hidden rounded-lg bg-primary border border-border px-3 py-1.5 text-xs font-bold text-primary-foreground group-hover:block z-50 whitespace-nowrap shadow-xl">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-100 p-3 bg-gray-50/50">
        <Button
          variant="ghost"
          className={cn(
            "w-full text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl",
            isCollapsed ? "justify-center px-0" : "justify-start gap-3"
          )}
          onClick={handleLogout}
        >
          <LogOut strokeWidth={2} className="h-4 w-4 flex-shrink-0" />
          {!isCollapsed && <span className="whitespace-nowrap font-bold text-sm">Sign Out</span>}
        </Button>
      </div>
    </motion.aside>
  );
}
