"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { User as UserIcon } from "lucide-react";
import { NotificationBell } from "@/components/shared/notification-bell";
import { SearchCommand } from "@/components/shared/search-command";
import { Search } from "lucide-react";
import { useSettings } from "@/components/providers/settings-provider";

const baseNavItems = [
  { name: "Home", href: "/", feature: null },
  { name: "Courses", href: "/courses", feature: "showCourses" },
  { name: "Books", href: "/books", feature: "showBooks" },
  { name: "Store", href: "/shop", feature: "showShop" },
  { name: "Tools", href: "/tools", feature: "showTools" },
  { name: "Projects", href: "/projects", feature: "showProjects" },
  { name: "Blog", href: "/blog", feature: "showBlog" },
  { name: "Contact", href: "/contact", feature: null },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navItems, setNavItems] = useState(baseNavItems);
  const [showEvents, setShowEvents] = useState(true);
  const { user, profile, openAuthModal } = useAuth();
  const { settings } = useSettings();

  const [hasPending] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Derive nav items from shared settings
  useEffect(() => {
    if (settings?.features) {
      const f = settings.features;
      setShowEvents(f.showEvents);
      const filtered = baseNavItems.filter(item => {
        if (!item.feature) return true;
        // @ts-ignore
        return f[item.feature] !== false;
      });
      setNavItems(filtered);
    }
  }, [settings]);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        scrolled ? "bg-white border-b border-gray-200 py-3" : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="relative mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold tracking-tighter text-black flex items-center group">
            ZH<span className="text-black group-hover:scale-125 transition-transform duration-300">.</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-xs font-semibold tracking-wider uppercase transition-all duration-300 hover:text-black",
                  pathname === item.href ? "text-black font-bold" : "text-gray-400"
                )}
              >
                {item.name}
                {pathname === item.href && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="h-[2px] w-full bg-black mt-1 absolute"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* CTA & Auth */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
              aria-label="Open search"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 bg-gray-50 text-xs text-gray-500 hover:bg-gray-100 hover:text-black transition-all duration-300"
            >
              <Search strokeWidth={2} className="h-3 w-3" />
              <span className="text-[10px] tracking-widest uppercase font-bold">Search</span>
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <NotificationBell />
                <Link href="/my-account" className="flex items-center gap-2 group">
                  <div className="h-8 w-8 rounded-full bg-gray-100 overflow-hidden border border-gray-200 group-hover:border-black transition-all duration-500 relative">
                    {profile?.photoURL ? (
                      <img src={profile.photoURL} alt={profile.name || "Your profile picture"} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <UserIcon strokeWidth={1.5} className="h-4 w-4 text-gray-400" />
                      </div>
                    )}
                    {hasPending && (
                      <div className="absolute top-0 right-0 h-2 w-2 bg-black rounded-full border border-white" />
                    )}
                  </div>
                </Link>
              </div>
            ) : (
              <Button
                variant="ghost"
                className="text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-black hover:bg-gray-100 px-4 rounded-full"
                onClick={openAuthModal}
              >
                Login
              </Button>
            )}

            {showEvents && (
              <Button
                size="sm"
                className="rounded-full bg-black text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:bg-gray-800 transition-all duration-300 h-8 px-6 shadow-md shadow-black/10"
                asChild
              >
                <Link href="/events">Join Event</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-black p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X strokeWidth={1.5} className="h-6 w-6" /> : <Menu strokeWidth={1.5} className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Nav Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute left-4 right-4 top-full mt-4 rounded-3xl border border-gray-100 bg-white shadow-2xl p-6 md:hidden overflow-hidden"
            >
              <nav className="flex flex-col gap-6">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "text-xl font-bold tracking-tight transition-colors",
                      pathname === item.href ? "text-black" : "text-gray-400 hover:text-black"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                {showEvents && (
                  <Link
                    href="/events"
                    className="text-xl font-bold tracking-tight text-gray-400 hover:text-black mt-2"
                    onClick={() => setIsOpen(false)}
                  >
                    Events
                  </Link>
                )}
                
                <div className="h-px w-full bg-gray-100 my-2" />
                
                {user ? (
                   <Link
                   href="/my-account"
                   className="text-lg font-bold text-black flex items-center gap-3"
                   onClick={() => setIsOpen(false)}
                 >
                   <UserIcon className="h-5 w-5" /> My Account
                 </Link>
                ) : (
                  <button
                    className="text-lg font-bold text-black text-left flex items-center gap-3"
                    onClick={() => {
                      setIsOpen(false);
                      openAuthModal();
                    }}
                  >
                    Login
                  </button>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <SearchCommand />
    </header>
  );
}
