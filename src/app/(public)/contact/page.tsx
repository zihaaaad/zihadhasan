"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Github, Linkedin, Mail, Twitter, Send, MapPin, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { CMSService, GlobalSettings } from "@/lib/cms-service";
import { toast } from "sonner";
import { sendNotificationEmail, isEmailConfigured } from "@/lib/email";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [config, setConfig] = useState<GlobalSettings['pages']>({});
  const [socials, setSocials] = useState<any[]>([]);

  useEffect(() => {
    CMSService.getGlobalSettings().then(data => {
      if (data) {
        if (data.pages) setConfig(data.pages);
        if (data.socials) setSocials(data.socials);
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    // Simulate network delay for UX
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // Save to Firestore
      await CMSService.addMessage({
        name,
        email,
        subject,
        message
      });
    } catch (error) {
      console.error("Failed to save message", error);
      // Continue - still try to notify by email below
    }

    const targetEmail = config?.contact?.email || "contact@zihadhasan.dev";

    if (isEmailConfigured()) {
      // Send the notification directly - no need to make the visitor open
      // their own mail client for this to reach the inbox.
      const result = await sendNotificationEmail({
        toEmail: targetEmail,
        toName: "Zihad Hasan",
        subject: `New contact message: ${subject}`,
        message: `From: ${name} (${email})\n\n${message}`,
      });

      setIsSubmitting(false);

      if (result.success) {
        toast.success("Message sent! I'll get back to you soon.");
        form.reset();
        return;
      }
      // Fall through to the mailto fallback if the email send failed.
    }

    // Fallback for when EmailJS isn't configured, or its send failed: open the
    // visitor's own mail client with the message pre-filled.
    const mailtoLink = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
    window.location.href = mailtoLink;

    setIsSubmitting(false);
    toast.success("Message sent! I'll get back to you soon.", { description: "Your email client has been opened to finish sending." });
    form.reset();
  };

  const title = config?.contact?.title || "Let's Collaborate";
  const subtitle = config?.contact?.subtitle || "Have a project in mind or just want to discuss the future of tech? Drop me a line.";
  const location = config?.contact?.location || "Dhaka, Bangladesh";

  return (
    <div className="min-h-screen pt-32 pb-20 bg-background text-foreground font-sans">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="grid md:grid-cols-2 gap-16 w-full items-start">
          {/* Text & Socials */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-12 md:sticky md:top-32"
          >
            <div className="space-y-6">
              <div className="text-[10px] font-mono font-bold tracking-widest text-muted-foreground/80 uppercase">
                / index / contact
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-foreground tracking-tight leading-[1.1]">
                Let&apos;s <span className="text-foreground italic font-serif opacity-80">Collaborate</span>
              </h1>
              <p className="text-lg text-muted-foreground font-medium leading-relaxed max-w-md">
                {subtitle}
              </p>
            </div>

            <div className="flex gap-3">
              {socials.length > 0 ? socials.map((item, i) => (
                <Link key={i} href={item.url} target="_blank">
                  <Button size="icon" variant="outline" className="h-12 w-12 rounded-xl border border-border bg-background hover:bg-gray-50 text-gray-600 hover:text-foreground transition-all shadow-sm">
                    <SocialIcon platform={item.platform} />
                  </Button>
                </Link>
              )) : (
                <Link href="#" target="_blank"><Button size="icon" variant="outline" className="h-12 w-12 rounded-xl border-border shadow-sm hover:bg-gray-50 hover:text-foreground"><Mail className="h-5 w-5" /></Button></Link>
              )}
            </div>

            <div className="p-6 rounded-2xl border border-border bg-gray-50/50 max-w-sm shadow-sm">
              <h3 className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-widest mb-3">Location</h3>
              <div className="flex items-center gap-2.5 text-foreground font-bold tracking-tight mb-2">
                <MapPin className="h-4 w-4 text-muted-foreground/80" />
                <p className="text-base">{location}</p>
              </div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-4 pt-4 border-t border-border">Available for Global Contracts</p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="p-8 md:p-10 border border-border shadow-xl shadow-gray-100/50 bg-background rounded-3xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Name</Label>
                    <Input name="name" placeholder="JOHN DOE" className="bg-gray-50 border border-border h-12 rounded-xl focus:bg-background focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-sm font-medium text-foreground placeholder:text-muted-foreground/80 px-4 transition-all" required />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Email</Label>
                    <Input name="email" type="email" placeholder="HELLO@EXAMPLE.COM" className="bg-gray-50 border border-border h-12 rounded-xl focus:bg-background focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-sm font-medium text-foreground placeholder:text-muted-foreground/80 px-4 transition-all" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Subject</Label>
                  <Input name="subject" placeholder="PROJECT INQUIRY" className="bg-gray-50 border border-border h-12 rounded-xl focus:bg-background focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-sm font-medium text-foreground placeholder:text-muted-foreground/80 px-4 transition-all" required />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Message</Label>
                  <Textarea name="message" placeholder="Tell me about your project..." className="bg-gray-50 border border-border min-h-[160px] rounded-xl focus:bg-background focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-sm font-medium text-foreground placeholder:text-muted-foreground/80 px-4 py-3 leading-relaxed transition-all resize-none" required />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full h-12 rounded-xl text-xs font-bold uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md mt-4">
                  {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing</> : <><Send className="mr-2 h-4 w-4" /> Send Message</>}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function SocialIcon({ platform }: { platform: string }) {
  switch (platform) {
    case "github": return <Github className="h-5 w-5" />;
    case "twitter": return <Twitter className="h-5 w-5" />;
    case "linkedin": return <Linkedin className="h-5 w-5" />;
    case "email": return <Mail className="h-5 w-5" />;
    default: return <Mail className="h-5 w-5" />;
  }
}
