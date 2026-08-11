"use client";

import { GlassCard } from "@/components/shared/glass-card";
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
 <div className="min-h-screen pt-24 pb-20 container mx-auto px-4 flex items-center justify-center">
 <div className="grid md:grid-cols-2 gap-12 w-full max-w-5xl items-center">

 {/* Text & Socials */}
 <motion.div
 initial={{ opacity: 0, x: -20 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ duration: 0.8 }}
 className="space-y-12"
 >
 <div className="space-y-6">
 <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.1]">
 Let&apos;s <span className="text-primary italic font-serif">Collaborate</span>
 </h1>
 <p className="text-lg md:text-xl text-gray-500 font-medium leading-relaxed max-w-md">
 {subtitle}
 </p>
 </div>

 <div className="flex gap-4">
 {socials.length > 0 ? socials.map((item, i) => (
 <Link key={i} href={item.url} target="_blank">
 <Button size="icon" variant="outline" className="h-11 w-11 rounded-full border-white/[0.05] bg-white/[0.02] hover:bg-white hover:text-black transition-all duration-500">
 <SocialIcon platform={item.platform} />
 </Button>
 </Link>
 )) : (
 <Link href="#" target="_blank"><Button size="icon" variant="outline" className="rounded-full"><Mail className="h-4 w-4" /></Button></Link>
 )}
 </div>

 <div className="p-8 rounded-3xl border border-white/[0.05] bg-white/[0.02] max-w-sm">
 <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Location</h3>
 <div className="flex items-center gap-3 text-white font-bold tracking-tight mb-2">
 <MapPin className="h-4 w-4 text-primary" />
 <p className="text-lg">{location}</p>
 </div>
 <p className="text-[11px] font-bold text-primary/80 uppercase tracking-widest mt-4 pt-4 border-t border-white/[0.03]">Available for Global Contracts</p>
 </div>
 </motion.div>

 {/* Form */}
 <motion.div
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ duration: 0.8, delay: 0.2 }}
 >
 <GlassCard className="p-10 border-white/[0.05] shadow-none bg-white/[0.01] rounded-[2.5rem]">
 <form onSubmit={handleSubmit} className="space-y-8">
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
 <div className="space-y-3">
 <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Name</Label>
 <Input name="name" placeholder="JOHN DOE" className="bg-white/[0.03] border-white/[0.05] h-12 rounded-xl focus:ring-primary/20 text-xs font-bold uppercase tracking-widest px-5" required />
 </div>
 <div className="space-y-3">
 <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Email</Label>
 <Input name="email" type="email" placeholder="HELLO@EXAMPLE.COM" className="bg-white/[0.03] border-white/[0.05] h-12 rounded-xl focus:ring-primary/20 text-xs font-bold uppercase tracking-widest px-5" required />
 </div>
 </div>

 <div className="space-y-3">
 <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Subject</Label>
 <Input name="subject" placeholder="PROJECT INQUIRY" className="bg-white/[0.03] border-white/[0.05] h-12 rounded-xl focus:ring-primary/20 text-xs font-bold uppercase tracking-widest px-5" required />
 </div>

 <div className="space-y-3">
 <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Message</Label>
 <Textarea name="message" placeholder="TELL ME ABOUT YOUR PROJECT..." className="bg-white/[0.03] border-white/[0.05] min-h-[160px] rounded-2xl focus:ring-primary/20 text-xs font-bold uppercase tracking-widest px-5 py-4 leading-loose" required />
 </div>

 <Button type="submit" disabled={isSubmitting} className="w-full h-14 rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] bg-white text-black hover:bg-neutral-200 transition-all duration-500">
 {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing</> : <><Send className="mr-2 h-3.5 w-3.5" /> Send Discovery</>}
 </Button>
 </form>
 </GlassCard>
 </motion.div>
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
