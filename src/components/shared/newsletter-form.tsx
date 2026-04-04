"use client";

import { useState } from "react";
import { CMSService } from "@/lib/cms-service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface NewsletterFormProps {
    variant?: "minimal" | "card";
    className?: string;
    title?: string;
    subtitle?: string;
}

export function NewsletterForm({ 
    variant = "minimal", 
    className,
    title,
    subtitle 
}: NewsletterFormProps) {
    const [email, setEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setSubmitting(true);
        try {
            await CMSService.addSubscriber({ email });
            toast.success("Joined Successfully", {
                description: "You're now on the priority transmission list."
            });
            setEmail("");
        } catch (error) {
            console.error("Newsletter error", error);
            toast.error("Protocol Error", {
                description: "Failed to sync your email. Please retry."
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (variant === "card") {
        return (
            <div className={cn("bg-white/[0.02] border border-white/[0.05] rounded-[2rem] p-10 text-center relative overflow-hidden", className)}>
                {/* Subtle Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-white/5 blur-[100px] -z-10" />

                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
                    {title || "Strategic Insights"}
                </h3>
                <p className="text-neutral-500 text-sm font-medium mb-8 max-w-sm mx-auto leading-relaxed">
                    {subtitle || "Subscribe to the newsletter for deep dives into engineering, AI, and digital philosophy."}
                </p>

                <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1 group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500 group-focus-within:text-white transition-colors" />
                        <Input
                            type="email"
                            placeholder="TRANSMISSION@EMAIL.COM"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-11 h-12 bg-white/[0.03] border-white/[0.05] text-white focus:ring-white/20 text-[10px] font-bold uppercase tracking-widest rounded-xl"
                            required
                        />
                    </div>
                    <Button type="submit" disabled={submitting} className="bg-white text-black hover:bg-neutral-200 rounded-xl h-12 px-8 text-[10px] font-bold uppercase tracking-widest transition-all duration-500 shrink-0">
                        {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Authorize"}
                    </Button>
                </form>
            </div>
        );
    }

    return (
        <div className={cn("w-full max-w-sm", className)}>
            <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] mb-4">
                {title || "Newsletter"}
            </h3>
            <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500 group-focus-within:text-white transition-colors" />
                    <Input
                        type="email"
                        placeholder="ENTER YOUR EMAIL"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-11 h-12 bg-white/[0.03] border-white/[0.05] text-white focus:ring-white/20 text-[10px] font-bold uppercase tracking-widest rounded-xl"
                        required
                    />
                    <Button
                        type="submit"
                        disabled={submitting}
                        className="absolute right-1.5 top-1.5 h-9 w-9 p-0 bg-white text-black hover:bg-neutral-200 rounded-lg transition-all duration-500"
                    >
                        {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ArrowRight className="h-3.5 w-3.5" />}
                    </Button>
                </div>
            </form>
        </div>
    );
}
