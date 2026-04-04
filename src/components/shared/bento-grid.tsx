"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const BentoGrid = ({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) => {
    return (
        <div
            className={cn(
                "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto ",
                className
            )}
        >
            {children}
        </div>
    );
};

export const BentoGridItem = ({
    className,
    title,
    description,
    header,
    icon,
}: {
    className?: string;
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
    header?: React.ReactNode;
    icon?: React.ReactNode;
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className={cn(
                "row-span-1 rounded-3xl group/bento hover:shadow-2xl transition duration-500 p-8 glass-card justify-between flex flex-col space-y-4",
                className
            )}
        >
            {header}
            <div className="group-hover/bento:translate-x-2 transition duration-500">
                {icon}
                <div className="font-sans font-bold text-white mb-2 mt-6 tracking-tight text-xl leading-tight">
                    {title}
                </div>
                <div className="font-sans font-medium text-neutral-400 text-sm leading-relaxed line-clamp-2 max-w-[90%]">
                    {description}
                </div>
            </div>
        </motion.div>
    );
};
