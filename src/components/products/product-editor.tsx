
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Upload, X, Plus } from "lucide-react";
import { toast } from "sonner";
import { Product, CMSService } from "@/lib/cms-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ImageUploader } from "@/components/admin/image-uploader";

const productSchema = z.object({
    title: z.string().min(2, "Title is too short"),
    description: z.string().min(10, "Description is too short"),
    price: z.coerce.number().min(0, "Price must be positive"),
    type: z.enum(["digital", "physical"]),
    imageUrl: z.string().url("Cover image is required"),
    assets: z.array(z.string()).default([]),
    downloadUrl: z.string().default(""),
    published: z.boolean().default(false),
});

interface ProductEditorProps {
    product?: Product | null;
    onSuccess: () => void;
    onCancel: () => void;
}

export function ProductEditor({ product, onSuccess, onCancel }: ProductEditorProps) {
    const [saving, setSaving] = useState(false);

    const form = useForm<z.infer<typeof productSchema>>({
        resolver: zodResolver(productSchema) as any,
        defaultValues: {
            title: product?.title || "",
            description: product?.description || "",
            price: product?.price || 0,
            type: (product?.type as "digital" | "physical") || "digital",
            imageUrl: product?.imageUrl || "",
            downloadUrl: product?.downloadUrl || "",
            published: product?.published || false,
            // @ts-ignore - Assets array strict type workaround
            assets: product?.assets || [],
        },
    });

    const onSubmit = async (values: z.infer<typeof productSchema>) => {
        setSaving(true);
        try {
            const productData = {
                ...values,
                // Ensure optional fields are handled (though defaults cover most)
            };

            if (product?.id) {
                await CMSService.updateProduct(product.id, productData);
                toast.success("Product updated successfully");
            } else {
                await CMSService.addProduct(productData);
                toast.success("Product created successfully");
            }
            onSuccess();
        } catch (error: any) {
            console.error("Product Save Error:", error);
            // Show more detailed error if available from Firebase/Schema
            toast.error(error.message || "Failed to save product");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="rounded-[2rem] border border-white/[0.05] bg-white/[0.02] p-8 md:p-10">
            <div className="mb-10 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                        {product ? "Refine Product" : "New Digital Asset"}
                    </h2>
                    <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mt-1">Shop Management</p>
                </div>
                <Button variant="ghost" size="icon" onClick={onCancel} className="rounded-xl h-10 w-10 text-neutral-500 hover:text-white hover:bg-white/5">
                    <X className="h-5 w-5" />
                </Button>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">

                    <div className="grid gap-10 md:grid-cols-2">
                        {/* Left Column: Basic Info */}
                        <div className="space-y-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-1">Asset Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="E.G. GENERATIVE DESIGN KIT" className="bg-white/[0.03] border-white/[0.05] h-12 rounded-xl text-white font-bold uppercase tracking-widest text-[11px] px-5" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-1">Value (BDT)</FormLabel>
                                        <FormControl>
                                            <Input type="number" className="bg-white/[0.03] border-white/[0.05] h-12 rounded-xl text-white font-bold px-5" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-1">Classification</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-white/[0.03] border-white/[0.05] h-12 rounded-xl text-white text-xs font-bold uppercase tracking-widest px-5">
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-neutral-900 border-white/10 text-white">
                                                <SelectItem value="digital">Digital (Download)</SelectItem>
                                                <SelectItem value="physical">Physical (Shipping)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Conditional for Digital */}
                            {form.watch("type") === "digital" && (
                                <FormField
                                    control={form.control}
                                    name="downloadUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-1">Secure Delivery URL</FormLabel>
                                            <FormControl>
                                                <Input placeholder="HTTPS://DRIVE.GOOGLE.COM/..." className="bg-white/[0.03] border-white/[0.05] h-12 rounded-xl text-neutral-400 font-mono text-[10px] px-5 uppercase" {...field} />
                                            </FormControl>
                                            <p className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest ml-1">Accessible only upon verified purchase.</p>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>

                        {/* Right Column: Media */}
                        <div className="space-y-6">
                            <FormField
                                control={form.control}
                                name="imageUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-1">Visual Preview</FormLabel>
                                        <FormControl>
                                            <ImageUploader
                                                label="Upload Product Artwork"
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="published"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-[1.5rem] border border-white/[0.05] bg-white/[0.01] p-6 transition-all hover:bg-white/[0.02]">
                                        <div className="space-y-1">
                                            <FormLabel className="text-sm font-bold text-white uppercase tracking-widest">Public Status</FormLabel>
                                            <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">
                                                Toggle store visibility
                                            </p>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-1">Asset Narrative</FormLabel>
                                <FormControl>
                                    <Textarea rows={5} placeholder="DESCRIBE THE STRATEGIC VALUE OF THIS PRODUCT..." className="bg-white/[0.03] border-white/[0.05] rounded-2xl text-white text-sm leading-loose px-5 py-4" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end gap-4 pt-8 border-t border-white/[0.03]">
                        <Button type="button" variant="ghost" onClick={onCancel} className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-white">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={saving} className="bg-white text-black hover:bg-neutral-200 rounded-xl h-12 px-10 text-[10px] font-bold uppercase tracking-widest transition-all duration-500">
                            {saving && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
                            Sync Digital Asset
                        </Button>
                    </div>

                </form>
            </Form>
        </div>
    );
    );
}
