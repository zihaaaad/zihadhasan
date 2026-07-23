"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { CMSService, Course, GlobalSettings } from "@/lib/cms-service";
import { useAuth } from "@/components/auth/auth-provider";
import { ImageUploader } from "@/components/admin/image-uploader";
import { formatCurrency } from "@/lib/format";


interface EnrollmentModalProps {
    course: Course;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function EnrollmentModal({ course, open, onOpenChange, onSuccess }: EnrollmentModalProps) {
    const { user, profile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState<GlobalSettings | null>(null);
    const [copied, setCopied] = useState<string | null>(null);

    // Form State
    const [phone, setPhone] = useState("");
    const [trxId, setTrxId] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("bkash");
    const [additionalInfo, setAdditionalInfo] = useState("");
    const [screenshotUrl, setScreenshotUrl] = useState("");

    useEffect(() => {
        if (open) {
            CMSService.getGlobalSettings().then(setSettings);
            if (profile?.phone) setPhone(profile.phone);
        }
    }, [open, profile]);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(text);
        setTimeout(() => setCopied(null), 2000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);

        try {
            const result = await CMSService.registerForCourse(course.id!, {
                userId: user.uid,
                email: user.email!,
                name: user.displayName || "Unknown",
                phone,
                trxId,
                screenshotUrl,
                paymentMethod,
                additionalInfo
            });

            if (result.success) {
                toast.success("Enrollment successful! Please wait for admin approval.", { description: "You can check status in My Account." });
                onSuccess();
                onOpenChange(false);
            } else {
                toast.error("Enrollment Failed", { description: String(result.error) });
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred during enrollment.");
        } finally {
            setLoading(false);
        }
    };

    const paymentNumber = paymentMethod === 'bkash'
        ? settings?.paymentNumbers?.bkash
        : settings?.paymentNumbers?.nagad;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md bg-neutral-900 border-white/10 text-white max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Enroll in {course.title}</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        To access this course, please complete the payment securely.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {course.pricingType === "free" ? (
                        <div className="text-center space-y-4">
                            <div className="p-8 bg-white/[0.03] border border-white/10 rounded-3xl">
                                <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">Immediate Access</h3>
                                <p className="text-neutral-500 text-sm font-medium leading-relaxed">
                                    This educational resource is available without cost. Authorize your access below.
                                </p>
                            </div>
                            <Button
                                onClick={(e) => handleSubmit(e)}
                                className="w-full font-bold bg-white text-black hover:bg-neutral-200 h-14 rounded-xl text-[11px] uppercase tracking-[0.2em]"
                                disabled={loading}
                            >
                                {loading && <Loader2 strokeWidth={1.5} className="mr-2 h-4 w-4 animate-spin" />}
                                Authorize Access Now
                            </Button>
                        </div>
                    ) : (
                        <>
                            {/* Payment Instructions */}
                            <div className="bg-white/[0.02] p-6 rounded-3xl border border-white/10 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Course Value</span>
                                    <div className="text-right">
                                        <span className="text-2xl font-bold text-white tracking-tight">{formatCurrency(course.price)}</span>
                                        {course.pricingType === 'paid' && <div className="text-[9px] font-bold uppercase tracking-widest text-neutral-600">Secure Checkout</div>}
                                    </div>
                                </div>
                                <div className="h-px bg-white/5" />
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-1">Transmission Gateway</Label>
                                    <div className="space-y-3">
                                        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                            <SelectTrigger className="w-full bg-black/20 border-white/10 h-12 rounded-xl text-xs font-bold uppercase tracking-widest px-4">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-neutral-950 border-white/10 text-white">
                                                <SelectItem value="bkash">Bkash (Personal)</SelectItem>
                                                <SelectItem value="nagad">Nagad (Personal)</SelectItem>
                                                {settings?.bankAccounts?.map((bank, idx) => (
                                                    <SelectItem key={idx} value={`bank_${idx}`}>
                                                        {bank.bankName} - {bank.accountName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        {/* Dynamic Payment Details Display */}
                                        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 space-y-3">
                                            {paymentMethod.startsWith('bank_') ? (
                                                (() => {
                                                    const bankIndex = parseInt(paymentMethod.split('_')[1]);
                                                    const bank = settings?.bankAccounts?.[bankIndex];
                                                    if (!bank) return null;
                                                    return (
                                                        <div className="space-y-3 text-xs">
                                                            <div className="flex justify-between">
                                                                <span className="text-neutral-500 uppercase font-bold tracking-widest text-[9px]">Institution</span>
                                                                <span className="text-white font-bold">{bank.bankName}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-neutral-500 uppercase font-bold tracking-widest text-[9px]">ID / Number</span>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-mono text-white font-bold">{bank.accountNumber}</span>
                                                                    <button onClick={() => handleCopy(bank.accountNumber)} className="text-neutral-500 hover:text-white transition-colors">
                                                                        {copied === bank.accountNumber ? <Check strokeWidth={1.5} className="h-3 w-3 text-white" /> : <Copy strokeWidth={1.5} className="h-3 w-3" />}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-neutral-500 uppercase font-bold tracking-widest text-[9px]">Recipient</span>
                                                                <span className="text-white font-bold">{bank.accountName}</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })()
                                            ) : (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-neutral-500 uppercase font-bold tracking-widest text-[9px]">{paymentMethod} Number</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono text-white text-lg font-bold">
                                                            {paymentMethod === 'bkash' ? settings?.paymentNumbers?.bkash : settings?.paymentNumbers?.nagad || "N/A"}
                                                        </span>
                                                        <button
                                                            onClick={() => {
                                                                const num = paymentMethod === 'bkash' ? settings?.paymentNumbers?.bkash : settings?.paymentNumbers?.nagad;
                                                                if (num) handleCopy(num);
                                                            }}
                                                            className="text-neutral-500 hover:text-white transition-colors"
                                                        >
                                                            {copied === (paymentMethod === 'bkash' ? settings?.paymentNumbers?.bkash : settings?.paymentNumbers?.nagad) ?
                                                                <Check strokeWidth={1.5} className="h-4 w-4 text-white" /> : <Copy strokeWidth={1.5} className="h-4 w-4" />
                                                            }
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest mt-2 leading-loose">
                                        * Verify payment completion before proceeding with the authorization request.
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-1">Terminal ID (Phone)</Label>
                                    <Input
                                        required
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                        placeholder="E.G. 01712345678"
                                        className="bg-black/20 border-white/10 h-12 rounded-xl text-white font-bold"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-1">Transaction Proof (TrxID)</Label>
                                    <Input
                                        required
                                        value={trxId}
                                        onChange={e => setTrxId(e.target.value)}
                                        placeholder="E.G. 8JKS92KL"
                                        className="bg-black/20 border-white/10 font-mono uppercase h-12 rounded-xl text-white font-bold"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-1">Visual Receipt (Optional)</Label>
                                    <ImageUploader
                                        value={screenshotUrl}
                                        onChange={setScreenshotUrl}
                                        label="Upload Receipt"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-1">Notes (Optional)</Label>
                                    <Textarea
                                        value={additionalInfo}
                                        onChange={e => setAdditionalInfo(e.target.value)}
                                        placeholder="Any technical notes for verification..."
                                        className="bg-black/20 border-white/10 min-h-[100px] rounded-2xl text-white leading-relaxed"
                                    />
                                </div>

                                <Button type="submit" className="w-full bg-white text-black hover:bg-neutral-200 h-14 rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] mt-4" disabled={loading}>
                                    {loading && <Loader2 strokeWidth={1.5} className="mr-2 h-4 w-4 animate-spin" />}
                                    {loading ? "Transmitting..." : "Request Authorization"}
                                </Button>
                            </form>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
