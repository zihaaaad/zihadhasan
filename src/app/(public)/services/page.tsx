"use client";

import { motion } from "framer-motion";
import { Code, Bot, Rocket, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CMSService } from "@/lib/cms-service";

const SERVICES = [
  {
    icon: <Code className="h-6 w-6 text-gray-700" />,
    title: "Full Stack Development",
    description: "Building scalable, high-performance web apps using Next.js, React, and Node.js. Optimized for speed and SEO.",
  },
  {
    icon: <Bot className="h-6 w-6 text-gray-700" />,
    title: "AI Integration",
    description: "Integrating powerful AI models (OpenAI, Gemini) into your applications to automate tasks and enhance user experience.",
  },
  {
    icon: <Rocket className="h-6 w-6 text-gray-700" />,
    title: "MVP Launch",
    description: "Rapidly turning your startup idea into a functional Minimum Viable Product ready for investors and users.",
  },
  {
    icon: <Search className="h-6 w-6 text-gray-700" />,
    title: "Technical SEO & Performance",
    description: "Auditing and optimizing your existing site to rank higher on Google and load in sub-seconds.",
  },
];

export default function ServicesPage() {
  const [title, setTitle] = useState("Services");
  const [subtitle, setSubtitle] = useState("Specialized technical services to elevate your business.");

  useEffect(() => {
    CMSService.getGlobalSettings().then(data => {
      if (data?.pages?.services) {
        if (data.pages.services.title) setTitle(data.pages.services.title);
        if (data.pages.services.subtitle) setSubtitle(data.pages.services.subtitle);
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-24 font-sans">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-20 text-center">
          <div className="text-[10px] font-mono font-bold tracking-widest text-muted-foreground/80 uppercase mb-4 inline-block">
            / index / services
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6"
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed"
          >
            {subtitle}
          </motion.p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
          {SERVICES.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="h-full flex flex-col items-start p-10 bg-background border border-border rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 group">
                <div className="mb-6 p-4 rounded-2xl bg-gray-50 border border-gray-100 group-hover:bg-gray-100 transition-colors">
                  {service.icon}
                </div>
                <h3 className="mb-4 text-2xl font-bold text-foreground tracking-tight">{service.title}</h3>
                <p className="mb-10 text-muted-foreground leading-relaxed font-medium">{service.description}</p>
                
                <div className="mt-auto pt-6 border-t border-gray-100 w-full">
                  <Link href="/contact" className="w-full">
                    <Button variant="outline" className="w-full h-12 bg-background hover:bg-gray-50 text-foreground border-border text-xs font-bold uppercase tracking-widest shadow-sm">
                      Book Consultation
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
