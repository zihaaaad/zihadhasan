"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save, ArrowLeft, Image as ImageIcon, Bold, Italic, List, ListOrdered, Quote, Code, Link as LinkIcon, Undo, Redo, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Book, CMSService } from '@/lib/cms-service';
import slugify from 'slugify';
import { ImageUploader } from '@/components/admin/image-uploader';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface BookEditorProps {
 initialData?: Book;
 initialSecureContent?: string;
}

export function BookEditor({ initialData, initialSecureContent }: BookEditorProps) {
 const router = useRouter();
 const [title, setTitle] = useState(initialData?.title || "");
 const [slug, setSlug] = useState(initialData?.slug || "");
 const [description, setDescription] = useState(initialData?.description || "");
 const [author, setAuthor] = useState(initialData?.author || "Zihad Hasan");
 const [price, setPrice] = useState(initialData?.price || 0);
 const [hardcopyPrice, setHardcopyPrice] = useState(initialData?.hardcopyPrice || 0);
 const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
 const [isPublished, setIsPublished] = useState(initialData?.published || false);
 const [type, setType] = useState<'ebook' | 'hardcopy' | 'both'>(initialData?.type || 'both');
 const [previewContent, setPreviewContent] = useState(initialData?.previewContent || "");
 const [submitting, setSubmitting] = useState(false);

 // Full Content Editor (Secure)
 const editor = useEditor({
 extensions: [StarterKit, Image, Link],
 content: initialSecureContent || '<p>Enter the full book content here...</p>',
 editorProps: {
 attributes: {
 class: 'prose prose-invert max-w-none focus:outline-none min-h-[500px]',
 },
 },
 });

 useEffect(() => {
 if (!initialData && title) {
 setSlug(slugify(title, { lower: true, strict: true }));
 }
 }, [title, initialData]);

 const handleSave = async () => {
 if (!editor) return;

 // Validation
 if (!title.trim()) {
 toast.error("Title is required");
 return;
 }
 if (!slug.trim()) {
 toast.error("Slug is required");
 return;
 }
 if (!description.trim()) {
 toast.error("Description is required");
 return;
 }

 setSubmitting(true);

 const bookData = {
 title: title.trim(),
 slug: slug.trim(),
 description: description.trim(),
 author: author.trim(),
 price: Number(price),
 hardcopyPrice: hardcopyPrice ? Number(hardcopyPrice) : undefined,
 imageUrl,
 published: isPublished,
 type,
 previewContent,
 fullContent: editor.getHTML(),
 };

 try {
 console.log("Saving book data:", bookData);
 if (initialData && initialData.id) {
 await CMSService.updateBook(initialData.id, bookData);
 toast.success("Book updated successfully");
 } else {
 await CMSService.addBook(bookData);
 toast.success("Book created successfully");
 }
 router.push('/dashboard/books');
 // router.refresh();
 } catch (error: any) {
 console.error("Failed to save book", error);
 toast.error(`Failed to save book: ${error.message || "Unknown error"}`);
 } finally {
 setSubmitting(false);
 }
 };

 return (
 <div className="space-y-8 max-w-5xl mx-auto pb-20">
 {/* Header */}
 <div className="flex items-center justify-between sticky top-0 bg-gray-50 z-50 py-4 border-b border-gray-200 px-4 -mx-4">
 <Button variant="ghost" onClick={() => router.back()} className="text-gray-500 hover:text-white">
 <ArrowLeft className="mr-2 h-4 w-4" /> Back
 </Button>
 <div className="flex items-center gap-6">
 <div className="flex items-center gap-2">
 <Switch checked={isPublished} onCheckedChange={setIsPublished} />
 <span className={`text-[10px] font-bold uppercase tracking-widest ${isPublished ? 'text-emerald-500' : 'text-gray-500'}`}>
 {isPublished ? 'Live' : 'Draft'}
 </span>
 </div>
 <Button onClick={handleSave} disabled={submitting} className="bg-white text-black hover:bg-neutral-200 rounded-xl h-11 px-8 font-bold uppercase tracking-widest text-[10px]">
 {submitting && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
 {initialData ? "Update Release" : "Publish Work"}
 </Button>
 </div>
 </div>

 <div className="grid lg:grid-cols-3 gap-8">
 {/* Left: Metadata */}
 <div className="lg:col-span-2 space-y-6">
 <div className="p-8 rounded-[2rem] border border-white/[0.05] bg-white/[0.02] space-y-6">
 <div className="space-y-2">
 <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Title</Label>
 <Input value={title} onChange={e => setTitle(e.target.value)} className="bg-white/[0.03] border-white/[0.05] h-12 rounded-xl text-white font-bold" />
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div className="space-y-2">
 <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Slug</Label>
 <Input value={slug} onChange={e => setSlug(e.target.value)} className="bg-white/[0.03] border-white/[0.05] h-12 rounded-xl text-gray-600 font-mono text-xs" />
 </div>
 <div className="space-y-2">
 <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Author</Label>
 <Input value={author} onChange={e => setAuthor(e.target.value)} className="bg-white/[0.03] border-white/[0.05] h-12 rounded-xl text-white" />
 </div>
 </div>

 <div className="space-y-2">
 <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Short Description</Label>
 <Textarea value={description} onChange={e => setDescription(e.target.value)} className="bg-white/[0.03] border-white/[0.05] rounded-2xl min-h-[100px] text-white leading-relaxed" />
 </div>

 <div className="space-y-2 pt-4 border-t border-white/[0.03]">
 <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Free Preview Content (HTML)</Label>
 <Textarea 
 value={previewContent} 
 onChange={e => setPreviewContent(e.target.value)} 
 placeholder="Paste some sample chapters here..."
 className="bg-white/[0.03] border-white/[0.05] rounded-2xl min-h-[200px] text-white font-mono text-xs leading-relaxed" 
 />
 </div>
 </div>

 {/* Secure Content Editor */}
 <div className="space-y-4">
 <div className="flex items-center gap-2 px-1">
 <ShieldCheck className="h-4 w-4 text-primary" />
 <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Secure E-Book Environment (Full Content)</h3>
 </div>
 <div className="rounded-[2rem] border border-white/[0.05] bg-white/[0.02] overflow-hidden">
 <div className="p-2 border-b border-white/[0.05] flex gap-1 bg-white/[0.01]">
 <ToolbarBtn onClick={() => editor?.chain().focus().toggleBold().run()} icon={<Bold className="h-3.5 w-3.5" />} />
 <ToolbarBtn onClick={() => editor?.chain().focus().toggleItalic().run()} icon={<Italic className="h-3.5 w-3.5" />} />
 <ToolbarBtn onClick={() => editor?.chain().focus().toggleBulletList().run()} icon={<List className="h-3.5 w-3.5" />} />
 </div>
 <div className="p-8 min-h-[600px]">
 <EditorContent editor={editor} />
 </div>
 </div>
 </div>
 </div>

 {/* Right: Pricing & Visuals */}
 <div className="space-y-6">
 <div className="p-8 rounded-[2rem] border border-white/[0.05] bg-white/[0.02] space-y-8">
 <div className="space-y-4">
 <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Distribution Type</Label>
 <RadioGroup value={type} onValueChange={(v: any) => setType(v)} className="grid gap-3">
 {['ebook', 'hardcopy', 'both'].map((t) => (
 <div key={t} className="flex items-center space-x-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
 <RadioGroupItem value={t} id={t} className="border-gray-200 text-primary" />
 <Label htmlFor={t} className="text-xs font-bold uppercase tracking-widest cursor-pointer text-white">{t}</Label>
 </div>
 ))}
 </RadioGroup>
 </div>

 <div className="space-y-4 pt-6 border-t border-white/[0.03]">
 <div className="space-y-2">
 <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">E-Book Price (৳)</Label>
 <Input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} className="bg-white/[0.03] border-white/[0.05] h-12 rounded-xl text-white font-bold" />
 </div>
 {type !== 'ebook' && (
 <div className="space-y-2">
 <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Hardcopy Price (৳)</Label>
 <Input type="number" value={hardcopyPrice} onChange={e => setHardcopyPrice(Number(e.target.value))} className="bg-white/[0.03] border-white/[0.05] h-12 rounded-xl text-white font-bold" />
 </div>
 )}
 </div>

 <div className="pt-6 border-t border-white/[0.03]">
 <ImageUploader label="Book Cover Artwork" value={imageUrl} onChange={setImageUrl} />
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}

function ToolbarBtn({ onClick, icon }: { onClick: () => void, icon: React.ReactNode }) {
 return (
 <button onClick={onClick} className="p-2 rounded-lg hover:bg-white text-gray-500 hover:text-white transition-colors">
 {icon}
 </button>
 );
}
