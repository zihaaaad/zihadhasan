"use client";

import { motion } from "framer-motion";
import { CheckCircle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Lesson } from "@/lib/cms-service";

interface LessonItemProps {
 lesson: Lesson;
 index: number;
 isSelected: boolean;
 isUnlocked: boolean;
 isCompleted: boolean;
 onClick: () => void;
 /** Enrolled and unlocked - the status dot becomes a completion toggle. */
 canToggleComplete?: boolean;
 onToggleComplete?: () => void;
}

export function LessonItem({ lesson, index, isSelected, isUnlocked, isCompleted, onClick, canToggleComplete, onToggleComplete }: LessonItemProps) {
 // The status dot used to be decoration only, with no way to mark a lesson
 // done - so completedLessonIds never filled, course progress was stuck at 0%,
 // and on a sequential course every lesson after the first stayed locked
 // forever. It is now the toggle.
 const StatusIcon = (
 <>
 {isCompleted ? (
 <motion.div
 initial={{ scale: 0 }}
 animate={{ scale: 1 }}
 transition={{ type: "spring", stiffness: 500, damping: 30 }}
 >
 <CheckCircle strokeWidth={1.5} className="h-4 w-4" />
 </motion.div>
 ) : !isUnlocked ? (
 <Lock strokeWidth={1.5} className="h-3.5 w-3.5" />
 ) : (
 <div className="h-1.5 w-1.5 rounded-full bg-current" />
 )}
 </>
 );

 return (
 <div
 onClick={onClick}
 className={cn(
 "group flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 cursor-pointer relative overflow-hidden",
 isSelected
 ? "bg-background border-border shadow-[0_0_20px_rgba(255,255,255,0.05)]"
 : (isUnlocked
 ? "bg-transparent border-transparent hover:bg-background hover:border-border"
 : "bg-transparent border-transparent opacity-40 cursor-not-allowed")
 )}
 >
 {/* Status Icon with Motion Pop */}
 {canToggleComplete ? (
 <button
 type="button"
 aria-pressed={isCompleted}
 aria-label={isCompleted ? `Mark "${lesson.title}" as not complete` : `Mark "${lesson.title}" as complete`}
 title={isCompleted ? "Mark as not complete" : "Mark as complete"}
 onClick={(event) => {
 // The row itself opens the lesson; the toggle must not do both.
 event.stopPropagation();
 onToggleComplete?.();
 }}
 className={cn(
 "shrink-0 h-7 w-7 rounded-full flex items-center justify-center border transition-all duration-500 cursor-pointer hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
 isCompleted
 ? "bg-background text-foreground border-white"
 : "border-border text-muted-foreground group-hover:border-white group-hover:text-primary-foreground"
 )}
 >
 {StatusIcon}
 </button>
 ) : (
 <div className={cn(
 "shrink-0 h-7 w-7 rounded-full flex items-center justify-center border transition-all duration-500",
 isCompleted
 ? "bg-background text-foreground border-white"
 : (isUnlocked
 ? "border-border text-muted-foreground group-hover:border-white group-hover:text-primary-foreground"
 : "border-border text-neutral-700 bg-gray-50/50")
 )}>
 {StatusIcon}
 </div>
 )}

 <div className="flex-1 min-w-0">
 <h3 className={cn(
 "text-[13px] font-bold tracking-tight truncate transition-colors uppercase",
 isSelected ? "text-primary-foreground" : (isUnlocked ? "text-gray-600 group-hover:text-primary-foreground" : "text-gray-800")
 )}>
 {index + 1}. {lesson.title}
 </h3>
 <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">
 {lesson.duration && <span>{lesson.duration}</span>}
 {lesson.isFreePreview && (
 <span className="text-primary-foreground bg-background px-2 py-0.5 rounded border border-border">
 Preview
 </span>
 )}
 </div>
 </div>

 {/* Subtle active indicator */}
 {isSelected && (
 <motion.div
 layoutId="activeLessonIndicator"
 className="absolute left-0 top-0 bottom-0 w-1 bg-background"
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 />
 )}
 </div>
 );
}
