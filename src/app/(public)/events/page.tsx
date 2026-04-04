"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Users, Globe, ArrowRight, Loader2, X, Printer } from "lucide-react";
import { CMSService, Event } from "@/lib/cms-service";
import { generateEventSchema } from "@/lib/schema-generator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const registrationSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number required"),
    trxId: z.string().optional(),
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

import { useAuth } from "@/components/auth/auth-provider";
import { toast } from "sonner";

export default function PublicEventsPage() {
    const { user, openAuthModal } = useAuth();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [registeringEvent, setRegisteringEvent] = useState<Event | null>(null);

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            const data = await CMSService.getEvents();
            // Filter out past events if desired, or show them in a separate "Past" section
            // For now, simple list.
            setEvents(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-20 container mx-auto px-4">
            {events.length > 0 && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(events.map(event => generateEventSchema(event))),
                    }}
                />
            )}
            {/* Header */}
            <div className="mb-16 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-4"
                >
                    Upcoming <span className="text-primary italic font-serif">Events</span>
                </motion.h1>
                <p className="text-neutral-500 font-medium max-w-2xl mx-auto uppercase tracking-widest text-[10px]">
                    Join me for workshops, speaking engagements, and community meetups.
                </p>
            </div>

            {loading ? (
                <div className="text-center text-white">Loading events...</div>
            ) : events.length === 0 ? (
                <div className="text-center py-20 border border-white/5 rounded-2xl bg-white/5">
                    <p className="text-gray-400">No upcoming events scheduled at the moment.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {events.map((event, index) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            onRegister={() => {
                                if (!user) {
                                    toast.error("Please log in to register for events.");
                                    openAuthModal();
                                    return;
                                }
                                setRegisteringEvent(event);
                            }}
                            index={index}
                        />
                    ))}
                </div>
            )}

            <RegistrationModal
                event={registeringEvent}
                open={!!registeringEvent}
                onOpenChange={(open) => !open && setRegisteringEvent(null)}
                onSuccess={() => {
                    setRegisteringEvent(null);
                    loadEvents(); // Refresh seat counts
                }}
            />
        </div>
    );
}

function EventCard({ event, onRegister, index }: { event: Event, onRegister: () => void, index: number }) {
    const isSoldOut = (event.registeredCount || 0) >= event.totalSeats;
    const date = event.date ? new Date(event.date.seconds * 1000) : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group relative flex flex-col rounded-[2rem] border border-white/[0.05] bg-white/[0.02] overflow-hidden hover:border-white/20 transition-all duration-700 h-full"
        >
            <div className="relative h-56 bg-neutral-900 overflow-hidden">
                {event.imageUrl ? (
                    <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 ease-out group-hover:scale-110" />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full bg-neutral-900">
                        <Calendar className="h-10 w-10 text-white/5" />
                    </div>
                )}
                <div className="absolute top-6 right-6">
                    {isSoldOut ? (
                        <Badge variant="destructive" className="bg-red-500/80 text-white border-none text-[9px] font-bold uppercase tracking-widest px-3 h-6">Capacity Reached</Badge>
                    ) : (
                        <Badge variant="secondary" className="bg-white/10 text-white/70 border-white/5 backdrop-blur-xl text-[9px] font-bold uppercase tracking-widest px-3 h-6">
                            {event.totalSeats - (event.registeredCount || 0)} Slots Available
                        </Badge>
                    )}
                </div>
            </div>

            <div className="flex-1 p-8 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
                        {date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    {event.isVirtual && (
                        <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                    )}
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight leading-tight">{event.title}</h3>
                <p className="text-sm text-neutral-500 font-medium line-clamp-2 mb-8 leading-relaxed">{event.description}</p>

                <div className="mt-auto space-y-6">
                    <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                        {event.isVirtual ? <Globe className="h-3.5 w-3.5" /> : <MapPin className="h-3.5 w-3.5" />}
                        <span className="truncate">{event.location}</span>
                    </div>

                    <Button
                        onClick={onRegister}
                        disabled={isSoldOut}
                        className={`w-full h-12 rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-500 ${isSoldOut ? 'bg-white/5 text-neutral-600 border-white/5' : 'bg-white text-black hover:bg-neutral-200'}`}
                    >
                        {isSoldOut ? "Waitlist" : "Register Slot"}
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}




function RegistrationModal({ event, open, onOpenChange, onSuccess }: { event: Event | null, open: boolean, onOpenChange: (open: boolean) => void, onSuccess: () => void }) {
    const { user, profile } = useAuth();
    const isFree = event?.pricingType === 'free';
    // ... rest of state ...
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [paymentInfo, setPaymentInfo] = useState<{ bkash?: string, nagad?: string, bankAccounts?: any[] }>({});
    const [registrationId, setRegistrationId] = useState<string | null>(null);

    // Dynamic schema validation
    const formSchema = z.object({
        name: z.string().min(2, "Name is required"),
        email: z.string().email("Invalid email address"),
        phone: z.string().min(10, "Phone number required"),
        trxId: isFree ? z.string().optional() : z.string().min(5, "Transaction ID required"),
    });

    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<RegistrationFormValues>({
        // @ts-ignore
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            trxId: ""
        }
    });

    useEffect(() => {
        if (open) {
            reset();
            setError(null);
            setShowSuccess(false);
            setRegistrationId(null);

            // Pre-fill user data if logged in
            if (user) {
                setValue("name", user.displayName || profile?.name || "");
                setValue("email", user.email || "");
                if (profile?.phone) setValue("phone", profile.phone);
            }

            // Load payment info
            if (!isFree) {
                CMSService.getGlobalSettings().then(settings => {
                    if (settings) {
                        setPaymentInfo({
                            bkash: settings.paymentNumbers?.bkash,
                            nagad: settings.paymentNumbers?.nagad,
                            bankAccounts: settings.bankAccounts
                        });
                    }
                });
            }
        }
    }, [open, reset, isFree, user, profile, setValue]);

    const onSubmit = async (data: any) => {
        if (!event || !event.id) return;
        setIsLoading(true);
        setError(null);

        try {
            if (!user) {
                toast.error("You must be logged in.");
                return;
            }

            const result = await CMSService.registerForEvent(event.id, {
                userId: user.uid, // Guaranteed by check above
                name: data.name,
                email: data.email,
                phone: data.phone,
                trxId: data.trxId
            });

            if (result.success && result.id) {
                setRegistrationId(result.id);
                setShowSuccess(true);
                setTimeout(() => {
                    onSuccess(); // Close and refresh after delay
                }, 10000);
            } else {
                setError(result.error?.toString() || "Registration failed. Please try again.");
            }
        } catch (e) {
            setError("An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!event) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-black/90 border-white/10 text-white sm:max-w-[500px]">
                {!showSuccess ? (
                    <>
                        <DialogHeader>
                            <DialogTitle>Register for {event.title}</DialogTitle>
                            <DialogDescription className="text-gray-400">
                                Send payment and enter TrxID to verify your seat.
                            </DialogDescription>
                        </DialogHeader>


                        {/* Payment Instructions - Only for PAID events */}
                        {!isFree && (
                            <div className="bg-white/5 border border-white/10 p-4 rounded-lg space-y-3 mb-2">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-pink-400 font-bold">bKash (Send Money):</span>
                                        <span className="font-mono bg-black/30 px-2 py-1 rounded select-all">{paymentInfo.bkash || "Not Set"}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-orange-400 font-bold">Nagad (Send Money):</span>
                                        <span className="font-mono bg-black/30 px-2 py-1 rounded select-all">{paymentInfo.nagad || "Not Set"}</span>
                                    </div>
                                </div>

                                {/* Bank Accounts Section */}
                                {paymentInfo.bankAccounts && paymentInfo.bankAccounts.length > 0 && (
                                    <div className="pt-2 border-t border-white/5 space-y-2">
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Bank Transfer</p>
                                        {paymentInfo.bankAccounts.map((bank, idx) => (
                                            <div key={idx} className="text-xs bg-black/20 p-2 rounded border border-white/5 space-y-1">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Bank:</span>
                                                    <span className="text-white font-medium">{bank.bankName}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Account:</span>
                                                    <span className="text-white font-mono select-all text-right">{bank.accountNumber}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Name:</span>
                                                    <span className="text-gray-500 text-right">{bank.accountName}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                                    <span className="text-sm text-gray-400">Ticket Price:</span>
                                    <span className="text-lg font-bold text-primary">৳{event.price || 0}</span>
                                </div>
                                <p className="text-[10px] text-gray-500 mt-2 text-center">* Verification may take 1-2 hours.</p>
                            </div>
                        )}

                        {isFree && (
                            <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg mb-4 text-center">
                                <p className="text-green-400 font-bold">This is a Free Event!</p>
                                <p className="text-gray-400 text-sm">No payment required. Just fill the form to register.</p>
                            </div>
                        )}

                        <div className="grid gap-4 py-2">
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="text-white">Full Name</Label>
                                <Input id="name" {...register("name")} className="bg-white/5 border-white/10 text-white" />
                                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone" className="text-white">Phone Number</Label>
                                <Input id="phone" {...register("phone")} className="bg-white/5 border-white/10 text-white" placeholder="017..." />
                                {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-white">Email Address</Label>
                                <Input id="email" {...register("email")} className="bg-white/5 border-white/10 text-white" />
                                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                            </div>
                            {!isFree && (
                                <div className="grid gap-2">
                                    <Label htmlFor="trxId" className="text-white">Transaction ID (TrxID)</Label>
                                    <Input id="trxId" {...register("trxId")} className="bg-white/5 border-white/10 text-white uppercase font-mono tracking-widest" placeholder="9G7..." />
                                    {errors.trxId && <p className="text-xs text-red-500">{errors.trxId.message}</p>}
                                </div>
                            )}
                            {error && (
                                <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                    {error}
                                </div>
                            )}
                        </div>

                        <DialogFooter>
                            <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-gray-400 hover:text-white">Cancel</Button>
                            <Button onClick={handleSubmit(onSubmit)} disabled={isLoading} className="bg-primary text-black hover:bg-primary/90">
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Submit for Verification
                            </Button>
                        </DialogFooter>
                    </>
                ) : (
                    <div className="py-10 flex flex-col items-center justify-center text-center">
                        <div className="h-16 w-16 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 mb-4 animate-pulse">
                            <Loader2 className="w-8 h-8 animate-spin" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Verification Pending</h3>
                        <p className="text-gray-400 text-sm max-w-xs mx-auto mb-4">
                            We have received your request. Your seat will be confirmed after checking the TrxID.
                        </p>
                        {registrationId && (
                            <div className="space-y-4 w-full">
                                <div className="bg-white/5 border border-white/10 rounded-lg p-4 w-full cursor-pointer hover:bg-white/10 transition-colors"
                                    onClick={() => navigator.clipboard.writeText(registrationId)}>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Registration ID</p>
                                    <p className="font-mono text-2xl text-primary font-bold tracking-tight">{registrationId}</p>
                                    <p className="text-[10px] text-gray-600 mt-1">Click to copy</p>
                                </div>

                                <Button
                                    variant="outline"
                                    className="w-full border-white/10 hover:bg-white/5 hover:text-white"
                                    onClick={() => {
                                        const printWindow = window.open('', '', 'width=600,height=600');
                                        if (printWindow) {
                                            printWindow.document.write(`
                                                <html>
                                                    <head>
                                                        <title>Registration Receipt - ${registrationId}</title>
                                                        <style>
                                                            body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; text-align: center; color: #000; }
                                                            .container { border: 2px dashed #ccc; padding: 40px; border-radius: 20px; }
                                                            h1 { color: #000; margin-bottom: 10px; }
                                                            .id { font-size: 32px; font-weight: bold; font-family: monospace; letter-spacing: 2px; margin: 20px 0; }
                                                            .status { display: inline-block; padding: 5px 15px; background: #eee; border-radius: 50px; font-size: 14px; font-weight: bold; }
                                                            .footer { margin-top: 40px; font-size: 12px; color: #666; }
                                                        </style>
                                                    </head>
                                                    <body>
                                                        <div class="container">
                                                            <h1>Event Registration</h1>
                                                            <p>Status: <span class="status">VERIFICATION PENDING</span></p>
                                                            <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
                                                            <p>Registration ID</p>
                                                            <div class="id">${registrationId}</div>
                                                            <p>Please save this ID. We are verifying your TrxID.</p>
                                                            <div class="footer">
                                                                <p>Track your status at zihadhasan.web.app</p>
                                                            </div>
                                                        </div>
                                                        <script>window.print();</script>
                                                    </body>
                                                </html>
                                            `);
                                            printWindow.document.close();
                                        }
                                    }}
                                >
                                    <Printer className="mr-2 h-4 w-4" /> Print Receipt
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
