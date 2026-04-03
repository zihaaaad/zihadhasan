"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Copy, CheckCircle2, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Book, Course, Product, GlobalSettings, CMSService } from "@/lib/cms-service";
import { useAuth } from "@/components/auth/auth-provider";

const formSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(11, "Valid phone number required"),
    trxId: z.string().min(5, "Transaction ID is required"),
});

interface AssetPurchaseModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    asset: Book | Course | Product;
    type: 'book' | 'course' | 'product';
}

export function AssetPurchaseModal({ open, onOpenChange, asset, type }: AssetPurchaseModalProps) {
    const { user, profile } = useAuth();
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [settings, setSettings] = useState<GlobalSettings | null>(null);

    useEffect(() => {
        if (open) {
            CMSService.getGlobalSettings().then(setSettings);
        }
    }, [open]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: profile?.name || user?.displayName || "",
            email: user?.email || "",
            phone: profile?.phone || "",
            trxId: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!user) {
            toast.error("Authentication required");
            return;
        }
        setSubmitting(true);
        try {
            let result;
            if (type === 'book') {
                result = await CMSService.registerForBook(asset.id!, {
                    userId: user.uid,
                    email: values.email,
                    name: values.name,
                    phone: values.phone,
                    trxId: values.trxId,
                    paymentMethod: "Manual/Bkash"
                });
            } else if (type === 'course') {
                result = await CMSService.registerForCourse(asset.id!, {
                    userId: user.uid,
                    email: values.email,
                    name: values.name,
                    phone: values.phone,
                    trxId: values.trxId,
                    paymentMethod: "Manual/Bkash"
                });
            } else {
                result = await CMSService.registerForProduct(asset.id!, {
                    userId: user.uid,
                    email: values.email,
                    name: values.name,
                    phone: values.phone,
                    trxId: values.trxId,
                    paymentMethod: "Manual/Bkash"
                });
            }

            if (result.success) {
                setSuccess(true);
                toast.success("Acquisition request sent!");
            } else {
                toast.error(String(result.error) || "Protocol execution failed.");
            }
        } catch (error) {
            console.error(error);
            toast.error("System synchronization error.");
        } finally {
            setSubmitting(false);
        }
    };

    const bkashNumber = settings?.paymentNumbers?.bkash || "017XXXXXXXX";
    const nagadNumber = settings?.paymentNumbers?.nagad || "018XXXXXXXX";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-black border border-white/[0.05] text-white sm:max-w-[500px] rounded-[2.5rem] p-0 overflow-hidden">
                {!success ? (
                    <div className="p-10">
                        <DialogHeader className="mb-8">
                            <div className="flex items-center justify-between">
                                <DialogTitle className="text-2xl font-bold tracking-tight">Acquire <span className="text-primary italic font-serif">Asset</span></DialogTitle>
                                <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="rounded-xl h-8 w-8 hover:bg-white/5">
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            <DialogDescription className="text-neutral-500 font-medium pt-2">
                                You are acquiring: <span className="text-white font-bold">{asset.title}</span>
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-8">
                            {/* Payment Instructions */}
                            <div className="p-6 rounded-2xl border border-white/[0.05] bg-white/[0.02] space-y-4">
                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                                    <span>Payment Portal</span>
                                    <span className="text-white">Amount: ৳{asset.price}</span>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/[0.03]">
                                        <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">bKash</span>
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono text-sm text-white">{bkashNumber}</span>
                                            <Button size="icon" variant="ghost" className="h-7 w-7 hover:bg-white/5" onClick={() => {
                                                navigator.clipboard.writeText(bkashNumber);
                                                toast.info("Number Copied");
                                            }}>
                                                <Copy className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/[0.03]">
                                        <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Nagad</span>
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono text-sm text-white">{nagadNumber}</span>
                                            <Button size="icon" variant="ghost" className="h-7 w-7 hover:bg-white/5" onClick={() => {
                                                navigator.clipboard.writeText(nagadNumber);
                                                toast.info("Number Copied");
                                            }}>
                                                <Copy className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-1">Identity</FormLabel>
                                                    <FormControl>
                                                        <Input className="bg-white/[0.03] border-white/[0.05] h-11 rounded-xl text-white font-bold uppercase tracking-widest text-[10px] px-4" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="phone"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-1">Contact</FormLabel>
                                                    <FormControl>
                                                        <Input className="bg-white/[0.03] border-white/[0.05] h-11 rounded-xl text-white font-bold px-4" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="trxId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-primary ml-1">Transaction ID (TrxID)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="8X2..."
                                                        className="bg-white/[0.03] border-primary/30 h-12 rounded-xl text-white font-mono uppercase px-4 focus:ring-primary/20"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button type="submit" className="w-full h-14 rounded-xl bg-white text-black font-bold uppercase tracking-[0.2em] text-[11px] transition-all duration-500 hover:bg-neutral-200" disabled={submitting}>
                                        {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying</> : "Authorize Acquisition"}
                                    </Button>
                                </form>
                            </Form>
                        </div>
                    </div>
                ) : (
                    <div className="p-20 flex flex-col items-center text-center">
                        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-8">
                            <ShieldCheck className="h-10 w-10 text-primary" />
                        </div>
                        <DialogTitle className="text-2xl font-bold tracking-tight mb-3 italic font-serif text-white">Verification Pending</DialogTitle>
                        <DialogDescription className="text-neutral-500 font-medium mb-10 max-w-xs">
                            Your transaction is being reviewed. Security clearance typically takes 1-6 hours.
                        </DialogDescription>
                        <Button onClick={() => onOpenChange(false)} className="w-full h-12 rounded-xl bg-white/[0.05] border border-white/[0.05] text-white font-bold uppercase tracking-widest text-[10px]">
                            Exit Terminal
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
