"use client";

import { useState } from "react";
import { Lock, PlayCircle, CheckCircle, MonitorPlay, X } from "lucide-react";
import { Course, Lesson, Registration } from "@/lib/cms-service";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LessonItem } from "./lesson-item";

import { Button } from "@/components/ui/button";

interface LessonsListProps {
    course: Course;
    registration: Registration | null;
    className?: string;
    onEnroll?: () => void;
    onToggleLesson?: (lessonId: string, completed: boolean) => void;
    activeLesson?: Lesson | null;
    onSelectLesson?: (lesson: Lesson) => void;
}

export function LessonsList({ course, registration, className, onEnroll, onToggleLesson, activeLesson, onSelectLesson }: LessonsListProps) {
    const [localSelectedLesson, setLocalSelectedLesson] = useState<Lesson | null>(null);
    const [showLockedModal, setShowLockedModal] = useState(false);

    const isApproved = registration?.status === "approved";
    const completedIds = registration?.completedLessonIds || [];

    // Use prop if available, otherwise local state
    const effectiveSelectedLesson = activeLesson !== undefined ? activeLesson : localSelectedLesson;

    const handleLessonClick = (lesson: Lesson) => {
        if (lesson.isFreePreview || isApproved) {
            if (onSelectLesson) {
                onSelectLesson(lesson);
            } else {
                setLocalSelectedLesson(lesson);
            }
        } else {
            setShowLockedModal(true);
        }
    };

    return (
        <div id="lessons-list" className={cn("space-y-4", className)}>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3 uppercase tracking-tight">
                <MonitorPlay strokeWidth={1.5} className="h-5 w-5 text-white" />
                Course Content
            </h2>

            <div className="space-y-1">
                {course.lessons && course.lessons.length > 0 ? (
                    course.lessons.map((lesson, index) => {
                        const isCompleted = completedIds.includes(lesson.id);

                        // Sequential Logic: 
                        // If course.isSequential is true, a lesson is unlocked ONLY if:
                        // 1. It is a free preview OR
                        // 2. Previous lesson is completed OR
                        // 3. It is the first lesson
                        let isUnlocked = lesson.isFreePreview || isApproved;

                        if (course.isSequential && isApproved && index > 0) {
                            const prevLessonId = course.lessons[index - 1].id;
                            if (!completedIds.includes(prevLessonId)) {
                                isUnlocked = false;
                            }
                        }

                        // Determine visual state
                        const isSelected = effectiveSelectedLesson?.id === lesson.id;

                        return (
                            <LessonItem
                                key={lesson.id || index}
                                lesson={lesson}
                                index={index}
                                isSelected={isSelected}
                                isUnlocked={isUnlocked}
                                isCompleted={isCompleted}
                                onClick={() => handleLessonClick(lesson)}
                            />
                        );
                    })
                ) : (
                    <div className="text-center py-12 border border-dashed border-white/5 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-neutral-600">
                        No modules available.
                    </div>
                )}

            </div>

            {/* Video Player Modal - Only render if NOT controlled (no onSelectLesson) */}
            {!onSelectLesson && (
                <Dialog open={!!localSelectedLesson} onOpenChange={(open) => !open && setLocalSelectedLesson(null)}>
                    <DialogContent className="max-w-4xl bg-black border-white/10 text-white backdrop-blur-3xl p-0 overflow-hidden rounded-3xl">
                        <DialogHeader className="p-6 border-b border-white/5 bg-white/[0.02]">
                            <DialogTitle className="text-lg font-bold flex items-center gap-3 tracking-tight">
                                <PlayCircle strokeWidth={1.5} className="h-5 w-5 text-white" />
                                {localSelectedLesson?.title}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="aspect-video w-full bg-black relative">
                            {localSelectedLesson?.videoUrl ? (
                                <iframe
                                    src={getEmbedUrl(localSelectedLesson.videoUrl)}
                                    title={localSelectedLesson.title}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-neutral-600 text-[10px] font-bold uppercase tracking-widest">
                                    Video stream unavailable
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            {/* Locked Lesson Premium Modal */}
            <Dialog open={showLockedModal} onOpenChange={setShowLockedModal}>
                <DialogContent className="max-w-md p-0 overflow-hidden bg-black border-white/10 text-white rounded-3xl">
                    <div className="relative h-40 bg-white/[0.03] flex items-center justify-center overflow-hidden border-b border-white/5">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150"></div>
                        <div className="h-20 w-20 rounded-full bg-black flex items-center justify-center border border-white/10 shadow-2xl relative z-10">
                            <Lock strokeWidth={1.5} className="h-8 w-8 text-white" />
                        </div>
                    </div>

                    <div className="p-10 space-y-6 text-center">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-3 tracking-tight uppercase">Locked Module</h3>
                            <p className="text-neutral-500 text-sm font-medium leading-relaxed">
                                This technical module is restricted to verified students. Authenticate or acquire access to continue.
                            </p>
                        </div>

                        <div className="pt-2 space-y-4">
                            {!registration ? (
                                <Button
                                    onClick={() => {
                                        setShowLockedModal(false);
                                        onEnroll?.();
                                    }}
                                    className="w-full bg-white text-black hover:bg-neutral-200 border-0 h-14 rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-500"
                                >
                                    Authorize Access
                                </Button>
                            ) : (
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-neutral-400 text-[10px] font-bold uppercase tracking-widest">
                                    Status: <span className="text-white">{registration.status}</span> • Awaiting clearance
                                </div>
                            )}
                            <Button
                                variant="ghost"
                                onClick={() => setShowLockedModal(false)}
                                className="w-full text-neutral-600 hover:text-white text-[10px] font-bold uppercase tracking-widest h-10"
                            >
                                Dismiss
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// Helper to convert common video URLs to embed format
function getEmbedUrl(url: string): string {
    if (!url) return "";

    // YouTube
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
        let videoId = "";
        if (url.includes("youtu.be")) {
            videoId = url.split("/").pop() || "";
        } else if (url.includes("v=")) {
            videoId = url.split("v=")[1].split("&")[0];
        } else if (url.includes("embed/")) {
            return url;
        }
        return `https://www.youtube.com/embed/${videoId}`;
    }

    // Vimeo
    if (url.includes("vimeo.com")) {
        const videoId = url.split("/").pop();
        return `https://player.vimeo.com/video/${videoId}`;
    }

    // Default: Assume it's already an embed link or direct video file if supported
    return url;
}
