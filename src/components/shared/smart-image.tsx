"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Hammer } from "lucide-react"; // Fallback icon

interface SmartImageProps extends Omit<React.ComponentProps<typeof Image>, "src" | "alt"> {
 src?: string;
 alt: string;
 aspectRatio?: "16/9" | "4/3" | "1/1" | "auto";
 className?: string;
 fill?: boolean;
 blurDataURL?: string;
}

export function SmartImage({
 src,
 alt,
 aspectRatio = "16/9",
 className,
 fill = false,
 priority = false,
 ...props
}: SmartImageProps) {
 const [error, setError] = useState(false);
 const [isLoading, setIsLoading] = useState(!priority); // Skip loading state for priority images

 // If no src or error, show "Smart Error Placeholder"
 if (!src || error) {
 return (
 <div
 className={cn(
 "flex flex-col items-center justify-center bg-background border border-border text-muted-foreground overflow-hidden relative",
 aspectRatio === "16/9" && "aspect-video",
 aspectRatio === "4/3" && "aspect-[4/3]",
 aspectRatio === "1/1" && "aspect-square",
 fill && "h-full w-full",
 className
 )}
 >
 {/* Glitch Effect background */}
 <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />

 <div className="z-10 flex flex-col items-center gap-2">
 <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center animate-pulse">
 <Hammer strokeWidth={1.5} className="h-5 w-5 text-primary-foreground/50" />
 </div>
 <span className="text-[10px] uppercase tracking-widest text-primary-foreground/30 font-bold">ZH No Signal</span>
 </div>
 </div>
 );
 }

 const imageClasses = cn(
 "object-cover transition-all duration-700 ease-in-out",
 !priority && (isLoading ? "scale-110 blur-xl" : "scale-100 blur-0"),
 "hover:scale-105"
 );

 // Standard Next/Image wrapper
 if (fill) {
 return (
 <div className={cn("relative overflow-hidden bg-background", className)}>
 <Image
 src={src}
 alt={alt}
 fill
 priority={priority}
 className={imageClasses}
 onLoad={() => setIsLoading(false)}
 onError={() => setError(true)}
 unoptimized // Allow external URLs easily without config
 placeholder={props.blurDataURL && !priority ? "blur" : undefined}
 blurDataURL={props.blurDataURL}
 {...props}
 />
 </div>
 );
 }

 return (
 <div
 className={cn(
 "relative overflow-hidden bg-background",
 aspectRatio === "16/9" && "aspect-video",
 aspectRatio === "4/3" && "aspect-[4/3]",
 aspectRatio === "1/1" && "aspect-square",
 className
 )}
 >
 <Image
 src={src}
 alt={alt}
 fill
 priority={priority}
 className={imageClasses}
 onLoad={() => setIsLoading(false)}
 onError={() => setError(true)}
 unoptimized
 placeholder={props.blurDataURL && !priority ? "blur" : undefined}
 blurDataURL={props.blurDataURL}
 {...props}
 />
 </div>
 );
}
