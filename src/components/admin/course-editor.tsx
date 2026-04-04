"use client";

import { useState, useEffect } from "react";
import { doc, collection, addDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Trash2, Video, GripVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUploader } from "@/components/admin/image-uploader";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export interface Lesson {
    id: string;
    title: string;
    videoUrl: string;
    order: number;
}

export interface Course {
    id?: string;
    title: string;
    description: string;
    pricingType?: 'free' | 'paid';
    price?: number;
    headerImage: string;
    published: boolean;
    lessons: Lesson[];
}

interface CourseEditorProps {
    course?: Course | null;
    onSave: () => void;
    onCancel: () => void;
}

export function CourseEditor({ course, onSave, onCancel }: CourseEditorProps) {
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState(course?.title || "");
    const [description, setDescription] = useState(course?.description || "");
    const [pricingType, setPricingType] = useState<'free' | 'paid'>(course?.pricingType || 'free');
    const [price, setPrice] = useState(course?.price || 0);
    const [headerImage, setHeaderImage] = useState(course?.headerImage || "");
    const [published, setPublished] = useState(course?.published || false);
    const [lessons, setLessons] = useState<Lesson[]>(() => {
        const initial = course?.lessons || [];
        // Backfill IDs if missing
        return initial.map(l => ({
            ...l,
            id: l.id || crypto.randomUUID()
        }));
    });

    // Draft State
    const [showDraftDialog, setShowDraftDialog] = useState(false);
    const [draftToRestore, setDraftToRestore] = useState<any>(null);

    // Auto-save Draft
    useEffect(() => {
        if (course) return; // Only for new courses

        const saveDraft = () => {
            if (!title && !description) return;

            const draftData = {
                title,
                description,
                pricingType,
                price,
                headerImage,
                published,
                lessons,
                savedAt: Date.now()
            };
            localStorage.setItem('course_draft_new', JSON.stringify(draftData));
        };

        const interval = setInterval(saveDraft, 15000);
        return () => clearInterval(interval);
    }, [title, description, pricingType, price, headerImage, published, lessons, course]);

    // Check Draft on Mount
    useEffect(() => {
        if (!course) {
            const savedDraft = localStorage.getItem('course_draft_new');
            if (savedDraft) {
                try {
                    const parsed = JSON.parse(savedDraft);
                    setDraftToRestore(parsed);
                    setShowDraftDialog(true);
                } catch (e) {
                    console.error("Failed to parse draft", e);
                }
            }
        }
    }, [course]);

    const handleRestoreDraft = () => {
        if (draftToRestore) {
            setTitle(draftToRestore.title || "");
            setDescription(draftToRestore.description || "");
            setPricingType(draftToRestore.pricingType || 'free');
            setPrice(draftToRestore.price || 0);
            setHeaderImage(draftToRestore.headerImage || "");
            setPublished(draftToRestore.published || false);
            setLessons(draftToRestore.lessons || []);
            toast.success("Draft Restored");
        }
        setShowDraftDialog(false);
    };

    const handleDiscardDraft = () => {
        localStorage.removeItem('course_draft_new');
        setShowDraftDialog(false);
        toast.info("Draft Discarded");
    };

    const handleAddLesson = () => {
        setLessons([
            ...lessons,
            { id: crypto.randomUUID(), title: "", videoUrl: "", order: lessons.length + 1 }
        ]);
    };

    const handleLessonChange = (index: number, field: keyof Lesson, value: string | number) => {
        const newLessons = [...lessons];
        newLessons[index] = { ...newLessons[index], [field]: value };
        setLessons(newLessons);
    };

    const handleRemoveLesson = (index: number) => {
        setLessons(lessons.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const courseData = {
            title,
            description,
            pricingType,
            price: pricingType === 'free' ? 0 : Number(price),
            headerImage,
            published,
            lessons,
            updatedAt: serverTimestamp()
        };

        try {
            if (course?.id) {
                await updateDoc(doc(db, "courses", course.id), courseData);
                toast.success("Course updated successfully!");
            } else {
                await addDoc(collection(db, "courses"), {
                    ...courseData,
                    isDeleted: false,
                    createdAt: serverTimestamp()
                });
                toast.success("Course published successfully!");
            }
            if (!course) localStorage.removeItem('course_draft_new');
            onSave();
        } catch (error) {
            console.error("Failed to save course", error);
            toast.error("Failed to save course. Check console.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white tracking-tight">
                    {course ? "Refine Course" : "New Curriculum"}
                </h2>
                <div className="flex gap-3">
                    <Button variant="ghost" onClick={onCancel} className="text-neutral-500 hover:text-white h-12 rounded-xl text-[10px] font-bold uppercase tracking-widest">Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading} className="bg-white text-black hover:bg-neutral-200 h-12 px-8 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all">
                        {loading && <Loader2 strokeWidth={1.5} className="mr-2 h-4 w-4 animate-spin" />}
                        {course ? "Sync Changes" : "Publish Course"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* Main Meta Data */}
                <div className="md:col-span-2 space-y-10">
                    <Card className="bg-white/[0.02] border-white/[0.05] text-white rounded-[2rem] p-4">
                        <CardHeader>
                            <CardTitle className="text-lg uppercase tracking-tight">Course Intelligence</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-1">Academic Title</Label>
                                <Input
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    className="bg-black/20 border-white/10 text-white h-12 rounded-xl font-bold uppercase tracking-widest text-[11px] px-5"
                                    placeholder="MASTERING GENERATIVE DESIGN"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-1">Educational Narrative</Label>
                                <Textarea
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    className="bg-black/20 border-white/10 text-white min-h-[120px] rounded-2xl p-5 leading-relaxed"
                                    placeholder="Define the strategic value proposition for students..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/[0.02] border-white/[0.05] text-white rounded-[2rem] p-4">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg uppercase tracking-tight">Technical Curriculum</CardTitle>
                            <Button size="sm" variant="outline" onClick={handleAddLesson} className="border-white/10 hover:bg-white/10 rounded-lg h-9 text-[10px] font-bold uppercase tracking-widest px-4">
                                <Plus strokeWidth={1.5} className="h-3.5 w-3.5 mr-2" /> Add Module
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {lessons.length === 0 && (
                                <div className="text-center py-16 text-neutral-600 border border-dashed border-white/10 rounded-2xl uppercase tracking-[0.2em] font-black text-[10px]">
                                    System awaiting curriculum input.
                                </div>
                            )}
                            {lessons.map((lesson, index) => (
                                <div key={index} className="flex gap-4 bg-white/[0.01] p-6 rounded-2xl border border-white/5 group transition-all hover:bg-white/[0.03]">
                                    <div className="mt-3 text-neutral-700 cursor-grab group-hover:text-neutral-400 transition-colors">
                                        <GripVertical strokeWidth={1.5} className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <Label className="text-[9px] font-bold uppercase tracking-widest text-neutral-600 ml-1">Module Title</Label>
                                                <Input
                                                    value={lesson.title}
                                                    onChange={e => handleLessonChange(index, "title", e.target.value)}
                                                    className="h-10 bg-black/20 border-white/10 rounded-xl font-bold text-xs px-4"
                                                />
                                            </div>
                                            <div className="w-24">
                                                <Label className="text-[9px] font-bold uppercase tracking-widest text-neutral-600 ml-1">Sequence</Label>
                                                <Input
                                                    type="number"
                                                    value={lesson.order}
                                                    onChange={e => handleLessonChange(index, "order", Number(e.target.value))}
                                                    className="h-10 bg-black/20 border-white/10 rounded-xl font-bold text-xs px-4"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-[9px] font-bold uppercase tracking-widest text-neutral-600 ml-1">Stream Endpoint (URL)</Label>
                                            <div className="relative">
                                                <Video strokeWidth={1.5} className="absolute left-3 top-3 h-4 w-4 text-neutral-600" />
                                                <Input
                                                    value={lesson.videoUrl}
                                                    onChange={e => handleLessonChange(index, "videoUrl", e.target.value)}
                                                    className="pl-10 h-10 bg-black/20 border-white/10 rounded-xl text-[10px] font-mono"
                                                    placeholder="HTTPS://YOUTUBE.COM/..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-6">
                                        <Button variant="ghost" size="icon" onClick={() => handleRemoveLesson(index)} className="text-red-500/30 hover:text-red-500 hover:bg-red-500/5 h-10 w-10 rounded-xl">
                                            <Trash2 strokeWidth={1.5} className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card className="bg-white/[0.02] border-white/[0.05] text-white rounded-[2rem] p-4">
                        <CardHeader>
                            <CardTitle className="text-lg uppercase tracking-tight">Configurations</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div className="flex items-center justify-between bg-white/[0.03] p-4 rounded-xl border border-white/5">
                                <div className="space-y-0.5">
                                    <Label className="text-xs font-bold uppercase tracking-widest">Public Status</Label>
                                    <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest">LMS Visibility</p>
                                </div>
                                <Switch checked={published} onCheckedChange={setPublished} />
                            </div>

                            <div className="space-y-4">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-1">Monetization Protocol</Label>
                                <RadioGroup
                                    value={pricingType}
                                    onValueChange={(v: 'free' | 'paid') => setPricingType(v)}
                                    className="flex flex-col gap-3"
                                >
                                    <div className="flex items-center space-x-3 bg-white/[0.01] p-3 rounded-xl border border-white/5">
                                        <RadioGroupItem value="free" id="r-free" className="border-white/20 text-white" />
                                        <Label htmlFor="r-free" className="text-xs font-bold uppercase tracking-widest cursor-pointer flex-1">Open Access</Label>
                                    </div>
                                    <div className="flex items-center space-x-3 bg-white/[0.01] p-3 rounded-xl border border-white/5">
                                        <RadioGroupItem value="paid" id="r-paid" className="border-white/20 text-white" />
                                        <Label htmlFor="r-paid" className="text-xs font-bold uppercase tracking-widest cursor-pointer flex-1">Premium Tier</Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            {pricingType === 'paid' && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-1">Value (BDT)</Label>
                                    <Input
                                        type="number"
                                        value={price}
                                        onChange={e => setPrice(Number(e.target.value))}
                                        className="bg-black/20 border-white/10 text-white h-12 rounded-xl font-bold px-5"
                                        placeholder="E.G. 5000"
                                    />
                                </div>
                            )}

                            <div className="space-y-2 pt-4 border-t border-white/10">
                                <ImageUploader
                                    label="Curriculum Artwork"
                                    value={headerImage}
                                    onChange={setHeaderImage}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <AlertDialog open={showDraftDialog} onOpenChange={setShowDraftDialog}>
                <AlertDialogContent className="bg-neutral-950 border-white/10 text-white rounded-3xl p-8">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-bold tracking-tight uppercase">Unsaved Draft Detected</AlertDialogTitle>
                        <AlertDialogDescription className="text-neutral-500 font-medium text-sm leading-relaxed">
                            System recovered an uncommitted curriculum from {draftToRestore?.savedAt ? new Date(draftToRestore.savedAt).toLocaleString() : 'a previous session'}.
                            Restore data to active memory?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-8 gap-3">
                        <AlertDialogCancel onClick={handleDiscardDraft} className="border-white/10 hover:bg-white/5 text-neutral-500 hover:text-white rounded-xl h-12 px-6 text-[10px] font-bold uppercase tracking-widest">
                            Discard
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleRestoreDraft} className="bg-white text-black hover:bg-neutral-200 rounded-xl h-12 px-8 text-[10px] font-bold uppercase tracking-widest">
                            Restore Data
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
