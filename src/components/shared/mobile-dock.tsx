"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
 Home,
 BookOpen,
 Wrench,
 Layers,
 FileText,
 Mail,
 Calendar,
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { useSettings } from "@/components/providers/settings-provider";

const navItems = [
 { name: "Home", href: "/", icon: Home, feature: null },
 { name: "Courses", href: "/courses", icon: BookOpen, feature: null },
 { name: "Projects", href: "/projects", icon: Layers, feature: "showProjects" },
 { name: "Tools", href: "/tools", icon: Wrench, feature: "showTools" },
 { name: "Blog", href: "/blog", icon: FileText, feature: "showBlog" },
 // { name: "Contact", href: "/contact", icon: Mail, feature: null },
 { name: "Events", href: "/events", icon: Calendar, feature: "showEvents" },
];

export function MobileDock() {
 const pathname = usePathname();
 const { user, openAuthModal } = useAuth();
 const { settings } = useSettings();
 const [items, setItems] = useState(navItems);
 const [isVisible, setIsVisible] = useState(true);
 const [lastScrollY, setLastScrollY] = useState(0);

 useEffect(() => {
 const handleScroll = () => {
 const currentScrollY = window.scrollY;

 // Hide dock when scrolling down, show when scrolling up
 if (currentScrollY > lastScrollY && currentScrollY > 100) {
 setIsVisible(false);
 } else {
 setIsVisible(true);
 }

 setLastScrollY(currentScrollY);
 };

 window.addEventListener("scroll", handleScroll);
 return () => window.removeEventListener("scroll", handleScroll);
 }, [lastScrollY]);

 // Derive items from shared settings
 useEffect(() => {
 if (settings?.features) {
 const f = settings.features;
 const filtered = navItems.filter((item) => {
 if (!item.feature) return true;
 // @ts-ignore
 return f[item.feature] !== false;
 });
 setItems(filtered);
 }
 }, [settings]);

 return (
 <AnimatePresence>
 {isVisible && (
 <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] md:hidden pointer-events-none">
 <motion.div
 initial={{ y: 100, opacity: 0 }}
 animate={{ y: 0, opacity: 1 }}
 exit={{ y: 100, opacity: 0 }}
 transition={{ type: "spring", damping: 20, stiffness: 300 }}
 className="pointer-events-auto flex items-center gap-2 rounded-2xl border border-border bg-gray-50 p-2 shadow-2xl ring-1 ring-gray-200"
 >
 {items.map((item) => {
 const Icon = item.icon;
 const isActive = pathname === item.href;

 return (
 <Link
 key={item.href}
 href={item.href}
 aria-label={item.name}
 aria-current={isActive ? "page" : undefined}
 className={cn(
 "relative flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-gray-200 hover:text-foreground"
 )}
 >
 <Icon strokeWidth={1.5} className="h-5.5 w-5.5" />
 {isActive && (
                    <motion.div
                      layoutId="active-dock-indicator"
                      className="absolute -bottom-1 h-1 w-1 rounded-full bg-primary"
                    />
 )}
 </Link>
 );
 })}

 {/* Profile / Login Button */}
 <button
 onClick={() => {
 if (user) {
 window.location.href = "/my-account";
 } else {
 openAuthModal();
 }
 }}
 aria-label={user ? "My account" : "Log in"}
              className={cn(
                "relative flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 text-muted-foreground hover:bg-gray-200 hover:text-foreground"
              )}
 >
 <div className="h-7 w-7 rounded-full overflow-hidden border border-border bg-background">
 {user?.photoURL ? (
 <img src={user.photoURL} alt="User" className="h-full w-full object-cover" />
 ) : (
 <div className="h-full w-full flex items-center justify-center text-[10px] font-bold text-gray-600">
 {user ? user.email?.[0].toUpperCase() : "IN"}
 </div>
 )}
 </div>
 </button>
 </motion.div>
 </div>
 )}
 </AnimatePresence>
 );
}
