"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Copy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
 Dialog,
 DialogContent,
 DialogDescription,
 DialogFooter,
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
import { Product, GlobalSettings } from "@/lib/cms-service";
import { useAuth } from "@/components/auth/auth-provider";
import { CMSService } from "@/lib/cms-service";

const formSchema = z.object({
 name: z.string().min(2, "Name is required"),
 email: z.string().email("Invalid email address"),
 phone: z.string().min(11, "Valid phone number required"),
 trxId: z.string().min(5, "Transaction ID is required"),
});

interface PurchaseModalProps {
 open: boolean;
 onOpenChange: (open: boolean) => void;
 product: Product;
}

export function PurchaseModal({ open, onOpenChange, product }: PurchaseModalProps) {
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
 setSubmitting(true);
 try {
 const result = await CMSService.registerForProduct(product.id!, {
 userId: user?.uid, // Optional (guest checkout valid?) - Schema assumes logged in for now usually
 email: values.email,
 name: values.name,
 phone: values.phone,
 trxId: values.trxId,
 paymentMethod: "Manual/Bkash",
 // screenshotUrl: ... // Todo: Add file upload if needed later
 });

 if (result.success) {
 setSuccess(true);
 toast.success("Order placed successfully!");
 } else {
 toast.error(String(result.error) || "Failed to place order");
 }
 } catch (error) {
 console.error(error);
 toast.error("Something went wrong");
 } finally {
 setSubmitting(false);
 }
 };

 const copyNumber = (num: string) => {
 navigator.clipboard.writeText(num);
 toast.info("Number copied!");
 };

 const handleClose = () => {
 setSuccess(false);
 form.reset();
 onOpenChange(false);
 };

 const bkashNumber = settings?.paymentNumbers?.bkash || "017XXXXXXXX";
 const nagadNumber = settings?.paymentNumbers?.nagad || "018XXXXXXXX";

 return (
 <Dialog open={open} onOpenChange={onOpenChange}>
 <DialogContent className="bg-gray-50 border-gray-200 text-white sm:max-w-[500px] ">
 {!success ? (
 <>
 <DialogHeader>
 <DialogTitle>Buy {product.title}</DialogTitle>
 <DialogDescription className="text-gray-400">
 Send <strong>{product.price} BDT</strong> to one of the numbers below.
 </DialogDescription>
 </DialogHeader>

 {/* Payment Info */}
 <div className="rounded-[1.5rem] border border-white/[0.05] bg-white/[0.02] p-6 space-y-4">
 {settings?.paymentNumbers?.bkash && (
 <div className="flex items-center justify-between">
 <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">bKash (Personal)</span>
 <div className="flex items-center gap-3">
 <span className="font-mono text-white font-bold">{bkashNumber}</span>
 <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-white rounded-lg" onClick={() => copyNumber(bkashNumber)}>
 <Copy strokeWidth={1.5} className="h-3.5 w-3.5" />
 </Button>
 </div>
 </div>
 )}
 {settings?.paymentNumbers?.nagad && (
 <div className="flex items-center justify-between">
 <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Nagad (Personal)</span>
 <div className="flex items-center gap-3">
 <span className="font-mono text-white font-bold">{nagadNumber}</span>
 <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-white rounded-lg" onClick={() => copyNumber(nagadNumber)}>
 <Copy strokeWidth={1.5} className="h-3.5 w-3.5" />
 </Button>
 </div>
 </div>
 )}
 {!settings?.paymentNumbers?.bkash && !settings?.paymentNumbers?.nagad && (
 <div className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-800 py-2">
 No transmission protocols configured.
 </div>
 )}
 </div>

 <Form {...form}>
 <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-4">
 <div className="grid grid-cols-2 gap-4">
 <FormField
 control={form.control}
 name="name"
 render={({ field }) => (
 <FormItem>
 <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Identity</FormLabel>
 <FormControl>
 <Input className="bg-white/[0.03] border-white/[0.05] h-12 rounded-xl text-white font-bold" {...field} />
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
 <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Terminal ID</FormLabel>
 <FormControl>
 <Input className="bg-white/[0.03] border-white/[0.05] h-12 rounded-xl text-white font-bold" {...field} />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />
 </div>

 <FormField
 control={form.control}
 name="email"
 render={({ field }) => (
 <FormItem>
 <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Transmission@Email</FormLabel>
 <FormControl>
 <Input className="bg-white/[0.03] border-white/[0.05] h-12 rounded-xl text-white font-bold" {...field} />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />

 <FormField
 control={form.control}
 name="trxId"
 render={({ field }) => (
 <FormItem>
 <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-white ml-1">Proof of Transaction (TrxID)</FormLabel>
 <FormControl>
 <Input
 placeholder="E.G. 8X2..."
 className="bg-white/[0.03] border-white/[0.1] focus-visible:ring-gray-200 h-12 rounded-xl text-white font-mono uppercase"
 {...field}
 />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />

 <Button type="submit" className="w-full bg-white text-black hover:bg-neutral-200 h-14 rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] mt-2" disabled={submitting || success}>
 {submitting && <Loader2 strokeWidth={1.5} className="mr-2 h-4 w-4 animate-spin" />}
 {submitting ? "Processing..." : "Acquire Digital Asset"}
 </Button>
 </form>
 </Form>
 </>
 ) : (
 <div className="py-12 flex flex-col items-center text-center">
 <div className="h-20 w-20 rounded-full bg-white/[0.05] border border-gray-200 flex items-center justify-center mb-8 relative">
 <div className="absolute inset-0 bg-white blur-2xl rounded-full" />
 <CheckCircle2 strokeWidth={1.5} className="h-10 w-10 text-white relative z-10" />
 </div>
 <DialogTitle className="text-3xl font-bold tracking-tight mb-4 uppercase">Transmission Received</DialogTitle>
 <DialogDescription className="text-gray-500 text-sm font-medium mb-10 max-w-xs leading-relaxed">
 Verification protocols initiated. You will be notified once access is authorized.
 </DialogDescription>
 <Button onClick={handleClose} className="w-full bg-white border border-gray-200 hover:bg-white text-white h-12 rounded-xl text-[10px] font-bold uppercase tracking-widest">
 Dismiss
 </Button>
 </div>
 )}
 </DialogContent>
 </Dialog>
 );
}
