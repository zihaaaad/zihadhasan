"use client";

import { useEffect, useRef } from "react";
import * as animejs from "animejs";

// Safe import for both CJS and ESM environments
const anime = (animejs as any).default || animejs;

export function Anime3DScroll({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // We target elements with the 'anime-section' class for the 3D scroll effect
    const sections = container.querySelectorAll('.anime-section');

    const handleScroll = () => {
      const windowHeight = window.innerHeight;

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        
        // Calculate the center of the element relative to the viewport
        const elementCenter = rect.top + rect.height / 2;
        const screenCenter = windowHeight / 2;

        // Calculate distance from center (normalized between roughly -1 and 1)
        // 1 means it's at the bottom of the screen, -1 means it's at the top
        let distance = (elementCenter - screenCenter) / (windowHeight * 0.8);
        
        // Clamp the distance
        distance = Math.max(-1, Math.min(1, distance));

        // Use anime.set for immediate transform updates based on scroll position
        // This gives a premium, elegant parallax effect instead of harsh 3D rotations
        anime.set(section, {
          translateY: distance * 50, // Subtle parallax shift
          translateZ: Math.abs(distance) * -30, // Slight push back
          scale: 1 - Math.abs(distance) * 0.02, // Very subtle scale
          opacity: 1 - Math.abs(distance) * 0.4, // Smooth fade
        });
      });
    };

    // Attach scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Initial call to set styles on mount
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="perspective-1200">
      {children}
    </div>
  );
}
