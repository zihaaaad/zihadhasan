"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { CMSService } from "@/lib/cms-service";
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
                scrolled ? "py-3" : "py-5"
            )}
        >
            <div className="container mx-auto px-4">
                <div
                    className={cn(
                        "relative mx-auto flex items-center justify-between rounded-full border border-white/[0.05] px-6 py-2 transition-all duration-500",
                        scrolled
                            ? "bg-black/20 backdrop-blur-2xl sm:w-full md:max-w-3xl border-white/[0.08]"
                            : "bg-transparent border-transparent"
                    )}
                >
                    {/* Logo */}
                    <Link href="/" className="text-lg font-bold tracking-tighter text-white flex items-center group">
                        ZH<span className="text-primary group-hover:scale-125 transition-transform duration-300">.</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-7">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "text-xs font-semibold tracking-wide uppercase transition-all duration-300 hover:text-white",
                                    pathname === item.href ? "text-primary" : "text-white/40"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* CTA & Auth */}
                    <div className="hidden md:flex items-center gap-4">
                        <button
                            onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.03] bg-white/[0.02] text-xs text-muted-foreground hover:bg-white/[0.05] hover:text-white transition-all duration-300"
                        >
                            <Search className="h-3 w-3" />
                            <span className="text-[10px] tracking-widest uppercase opacity-50 font-bold">Search</span>
                        </button>
                        {user ? (
                            <div className="flex items-center gap-3">
                                <NotificationBell />
                                <Link href="/my-account" className="flex items-center gap-2 group">
                                    <div className="h-8 w-8 rounded-full bg-white/[0.03] overflow-hidden border border-white/[0.08] group-hover:border-primary/50 transition-all duration-500 relative">
                                        {profile?.photoURL ? (
                                            <img src={profile.photoURL} alt="Profile" className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center">
                                                <UserIcon className="h-4 w-4 text-white/50" />
                                            </div>
                                        )}
                                        {hasPending && (
                                            <div className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full border border-black shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                                        )}
                                    </div>
                                </Link>
                            </div>
                        ) : (
                            <Button
                                variant="ghost"
                                className="text-[11px] font-bold uppercase tracking-widest text-white/70 hover:text-white hover:bg-white/[0.03] px-4"
                                onClick={openAuthModal}
                            >
                                Login
                            </Button>
                        )}

                        {showEvents && (
                            <Button
                                size="sm"
                                variant="outline"
                                className="rounded-full border-primary/20 bg-primary/5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary hover:bg-primary/20 hover:text-white backdrop-blur-sm transition-all duration-500 h-8"
                                asChild
                            >
                                <Link href="/events">Join Event</Link>
                            </Button>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden text-white"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Nav Overlay */}
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute left-0 right-0 top-full mt-2 mx-4 rounded-3xl border border-white/10 bg-black/90 p-6 backdrop-blur-3xl md:hidden"
                    >
                        <nav className="flex flex-col gap-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="text-lg font-medium text-white/80 hover:text-primary transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            {showEvents && (
                                <Link
                                    href="/events"
                                    className="text-lg font-medium text-primary"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Events
                                </Link>
                            )}
                        </nav>
                    </motion.div>
                )}
            </div>
            <SearchCommand />
        </header>
    );
}
