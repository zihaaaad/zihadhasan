"use client";

import { ReactLenis } from "@studio-freight/react-lenis";
import { useEffect, useState } from "react";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
    }, []);

    // Skip Lenis on mobile — native scroll is faster and more battery-efficient
    if (isMobile) {
        return <>{children}</>;
    }

    return (
        <ReactLenis root options={{ lerp: 0.1, duration: 1.5 }}>
            {/* @ts-expect-error Lenis types mismatch with React 19 */}
            {children}
        </ReactLenis>
    );
}
