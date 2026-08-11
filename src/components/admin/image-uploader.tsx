"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Loader2, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import imageCompression from 'browser-image-compression';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ImageUploaderProps {
 value: string;
 onChange: (url: string) => void;
 className?: string;
 label?: string;
}

export function ImageUploader({ value, onChange, className, label = "Upload Image" }: ImageUploaderProps) {
 const [uploading, setUploading] = useState(false);
 const [inputType, setInputType] = useState<"drop" | "url">("drop");
 const [urlInput, setUrlInput] = useState("");

 const onDrop = useCallback(async (acceptedFiles: File[]) => {
 const file = acceptedFiles[0];
 if (!file) return;

 const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
 const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

 if (!cloudName || !uploadPreset) {
 toast.error("Cloudinary upload is not configured. Please use the URL option or check environment variables.");
 setInputType("url");
 return;
 }

 setUploading(true);

 // Compress Image
 let fileToUpload = file;
 try {
 const options = {
 maxSizeMB: 0.8,
 maxWidthOrHeight: 1920,
 // usage: true // optional, for detailed logging
 useWebWorker: true
 };
 const compressedFile = await imageCompression(file, options);
 fileToUpload = compressedFile;
 // console.log(`Compressed from ${file.size / 1024 / 1024}MB to ${compressedFile.size / 1024 / 1024}MB`);
 } catch (error) {
 console.warn("Image compression failed, uploading original.", error);
 }

 const formData = new FormData();
 formData.append("file", fileToUpload);
 formData.append("upload_preset", uploadPreset);

 try {
 const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
 method: "POST",
 body: formData,
 });

 const data = await res.json();

 if (data.secure_url) {
 // Add optimization flags
 const optimizedUrl = data.secure_url.replace("/upload/", "/upload/f_auto,q_auto/");
 onChange(optimizedUrl);
 toast.success("Image uploaded successfully!");
 } else {
 throw new Error("Upload failed");
 }
 } catch (error) {
 console.error(error);
 toast.error("Failed to upload image.");
 } finally {
 setUploading(false);
 }
 }, [onChange]);

 const { getRootProps, getInputProps, isDragActive } = useDropzone({
 onDrop,
 accept: {
 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif']
 },
 maxFiles: 1,
 disabled: uploading
 });

 const handleUrlSubmit = () => {
 if (!urlInput) return;
 onChange(urlInput);
 setUrlInput("");
 setInputType("drop");
 toast.success("Image URL set!");
 };

 return (
 <div className={cn("space-y-3", className)}>
 <div className="flex items-center justify-between">
 <span className="text-sm font-medium text-primary-foreground/80">{label}</span>
 <div className="flex items-center gap-2">
 <Button
 type="button"
 variant="ghost"
 size="sm"
 onClick={() => setInputType("drop")}
 className={cn("h-7 text-xs", inputType === "drop" ? "bg-background text-primary-foreground" : "text-primary-foreground/50")}
 >
 Upload
 </Button>
 <Button
 type="button"
 variant="ghost"
 size="sm"
 onClick={() => setInputType("url")}
 className={cn("h-7 text-xs", inputType === "url" ? "bg-background text-primary-foreground" : "text-primary-foreground/50")}
 >
 URL
 </Button>
 </div>
 </div>

 {value ? (
 <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-gray-50 group">
 <img src={value} alt="Preview" className="h-full w-full object-cover" />
 <div className="absolute inset-0 bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
 <Button
 type="button"
 variant="destructive"
 size="sm"
 onClick={() => onChange("")}
 className="h-8"
 >
 <X className="mr-2 h-4 w-4" /> Remove
 </Button>
 </div>
 </div>
 ) : (
 <>
 {inputType === "drop" ? (
 <div
 {...getRootProps()}
 className={cn(
 "flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-background p-6 transition-colors hover:bg-background cursor-pointer min-h-[160px]",
 isDragActive && "border-primary bg-primary/5",
 uploading && "opacity-50 pointer-events-none"
 )}
 >
 <input {...getInputProps()} />
 {uploading ? (
 <div className="flex flex-col items-center gap-2">
 <Loader2 className="h-8 w-8 animate-spin text-primary" />
 <span className="text-xs text-primary-foreground/50">Uploading to Cloud...</span>
 </div>
 ) : (
 <div className="flex flex-col items-center gap-2 text-center">
 <div className="p-3 rounded-full bg-background">
 <Upload className="h-5 w-5 text-primary-foreground/50" />
 </div>
 <div className="space-y-1">
 <p className="text-sm font-medium text-primary-foreground/80">
 Click or drag to upload
 </p>
 <p className="text-xs text-primary-foreground/40">
 Supports JPG, PNG, WEBP
 </p>
 </div>
 </div>
 )}
 </div>
 ) : (
 <div className="flex gap-2">
 <Input
 value={urlInput}
 onChange={(e) => setUrlInput(e.target.value)}
 placeholder="https://images.unsplash.com/..."
 className="bg-gray-50 border-border text-primary-foreground"
 />
 <Button type="button" onClick={handleUrlSubmit} className="bg-background hover:bg-background">
 Set
 </Button>
 </div>
 )}
 </>
 )}
 </div>
 );
}
