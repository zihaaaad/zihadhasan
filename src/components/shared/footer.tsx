"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github, Twitter, Linkedin, Mail, Youtube, Facebook, Instagram } from "lucide-react";
import { useState, useEffect } from "react";
import { SocialLink as SocialLinkType } from "@/lib/cms-service";
import { NewsletterForm } from "@/components/shared/newsletter-form";
import { useSettings } from "@/components/providers/settings-provider";

export function Footer() {
    const pathname = usePathname();
    const { settings } = useSettings();
    const [socials, setSocials] = useState<SocialLinkType[]>([]);

    useEffect(() => {
        if (settings?.socials) setSocials(settings.socials);
    }, [settings]);

    // Hide footer on home page as requested
    if (pathname === "/") return null;

    const getIcon = (platform: string) => {
        switch (platform) {
            case "github": return <Github className="h-5 w-5" />;
            case "twitter": return <Twitter className="h-5 w-5" />;
            case "linkedin": return <Linkedin className="h-5 w-5" />;
            case "email": return <Mail className="h-5 w-5" />;
            case "youtube": return <Youtube className="h-5 w-5" />;
            case "facebook": return <Facebook className="h-5 w-5" />;
            case "instagram": return <Instagram className="h-5 w-5" />;
            default: return <Github className="h-5 w-5" />;
        }
    };

    return (
        <footer className="w-full border-t border-white/[0.05] bg-black py-20 mt-20">
            <div className="container mx-auto px-4 grid gap-16 lg:grid-cols-12">

                {/* Brand & Socials */}
                <div className="lg:col-span-7 flex flex-col gap-8">
                    <div>
                        <span className="text-xl font-bold tracking-tighter text-white mb-3 block">
                            ZH<span className="text-white">.</span>
                        </span>
                        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest leading-relaxed max-w-sm">
                            Building digital experiences at the intersection of design, engineering, and artificial intelligence.
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        {socials.length > 0 ? (
                            socials.map((social, i) => (
                                <SocialLink
                                    key={i}
                                    href={social.url}
                                    icon={getIcon(social.platform)}
                                    label={social.platform}
                                />
                            ))
                        ) : (
                            <>
                                <SocialLink href="#" icon={<Github strokeWidth={1.5} className="h-4 w-4" />} label="GitHub" />
                                <SocialLink href="#" icon={<Linkedin strokeWidth={1.5} className="h-4 w-4" />} label="LinkedIn" />
                            </>
                        )}
                    </div>

                    <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-[0.3em] pt-12 border-t border-white/[0.03]">
                        © {new Date().getFullYear()} Zihad Hasan / ALL RIGHTS RESERVED
                    </p>
                </div>

                {/* Newsletter */}
                <div className="lg:col-span-5 flex flex-col lg:items-end">
                    <NewsletterForm />
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link
            href={href}
            target="_blank"
            className="text-neutral-500 transition-all duration-300 hover:text-primary hover:scale-110"
            aria-label={label}
        >
            {icon}
        </Link>
    )
}
