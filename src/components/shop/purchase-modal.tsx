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
      <DialogContent className="bg-background border-border text-foreground sm:max-w-[500px] shadow-sm">
 {!success ? (
 <>
 <DialogHeader>
 <DialogTitle>Buy {product.title}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Send <strong>{product.price} BDT</strong> to one of the numbers below.
            </DialogDescription>
 </DialogHeader>

 {/* Payment Info */}
          <div className="rounded-[1.5rem] border border-border bg-gray-50 p-6 space-y-4">
            {settings?.paymentNumbers?.bkash && (
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">bKash (Personal)</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-foreground font-bold">{bkashNumber}</span>
                  <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-background rounded-lg text-foreground" onClick={() => copyNumber(bkashNumber)}>
                    <Copy strokeWidth={1.5} className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}
            {settings?.paymentNumbers?.nagad && (
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Nagad (Personal)</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-foreground font-bold">{nagadNumber}</span>
                  <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-background rounded-lg text-foreground" onClick={() => copyNumber(nagadNumber)}>
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
 <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Identity</FormLabel>
 <FormControl>
                        <Input className="bg-gray-50 border-border h-12 rounded-xl text-foreground font-bold" {...field} />
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
 <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Terminal ID</FormLabel>
 <FormControl>
                        <Input className="bg-gray-50 border-border h-12 rounded-xl text-foreground font-bold" {...field} />
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
 <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Transmission@Email</FormLabel>
 <FormControl>
                      <Input className="bg-gray-50 border-border h-12 rounded-xl text-foreground font-bold" {...field} />
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
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-foreground ml-1">Proof of Transaction (TrxID)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="E.G. 8X2..."
                          className="bg-gray-50 border-border focus-visible:ring-gray-300 h-12 rounded-xl text-foreground font-mono uppercase"
 {...field}
 />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />

                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] mt-2" disabled={submitting || success}>
 {submitting && <Loader2 strokeWidth={1.5} className="mr-2 h-4 w-4 animate-spin" />}
 {submitting ? "Processing..." : "Acquire Digital Asset"}
 </Button>
 </form>
 </Form>
 </>
 ) : (
            <div className="py-12 flex flex-col items-center text-center">
              <div className="h-20 w-20 rounded-full bg-gray-50 border border-border flex items-center justify-center mb-8 relative">
                <CheckCircle2 strokeWidth={1.5} className="h-10 w-10 text-foreground relative z-10" />
              </div>
              <DialogTitle className="text-3xl font-bold tracking-tight mb-4 uppercase text-foreground">Transmission Received</DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm font-medium mb-10 max-w-xs leading-relaxed">
                Verification protocols initiated. You will be notified once access is authorized.
              </DialogDescription>
              <Button onClick={handleClose} className="w-full bg-background border border-border hover:bg-gray-50 text-foreground h-12 rounded-xl text-[10px] font-bold uppercase tracking-widest">
                Dismiss
              </Button>
 </div>
 )}
 </DialogContent>
 </Dialog>
 );
}
