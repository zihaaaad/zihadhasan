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
import { formatCurrency, formatDate } from "@/lib/format";

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
      setEvents(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-24 font-sans">
      <div className="container mx-auto px-4 max-w-7xl">
        {events.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(events.map(event => generateEventSchema(event))),
            }}
          />
        )}
        
        {/* Header */}
        <div className="mb-20 text-center border-b border-border pb-10">
          <div className="text-[10px] font-mono font-bold tracking-widest text-muted-foreground/80 uppercase mb-4 inline-block">
            / index / events
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6"
          >
            Upcoming <span className="text-foreground italic font-serif opacity-80">Events</span>
          </motion.h1>
          <p className="text-muted-foreground font-medium max-w-2xl mx-auto text-lg leading-relaxed">
            Join me for workshops, speaking engagements, and community meetups.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground uppercase tracking-widest text-xs font-bold animate-pulse">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-border rounded-[2rem] bg-gray-50/50">
            <Calendar className="h-10 w-10 text-gray-300 mx-auto mb-4" />
            <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">No upcoming events scheduled at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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
      className="group relative flex flex-col rounded-[1.5rem] border border-border bg-background overflow-hidden hover:shadow-xl transition-all duration-300 h-full"
    >
      <div className="relative h-56 bg-gray-50 overflow-hidden border-b border-gray-100">
        {event.imageUrl ? (
          <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out" />
        ) : (
          <div className="flex flex-col items-center justify-center h-full bg-gray-50 text-gray-300">
            <Calendar className="h-10 w-10" />
          </div>
        )}
        <div className="absolute top-4 right-4">
          {isSoldOut ? (
            <Badge variant="destructive" className="bg-red-50 text-red-600 border border-red-200 text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 h-auto shadow-sm">Capacity Reached</Badge>
          ) : (
            <Badge variant="secondary" className="bg-background text-foreground border border-border text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 h-auto shadow-sm">
              {event.totalSeats - (event.registeredCount || 0)} Slots Available
            </Badge>
          )}
        </div>
      </div>

      <div className="flex-1 p-8 flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">
            {formatDate(date, { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          {event.isVirtual && (
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          )}
        </div>

        <h3 className="text-2xl font-bold text-foreground mb-3 tracking-tight leading-tight">{event.title}</h3>
        <p className="text-sm text-muted-foreground font-medium line-clamp-2 mb-8 leading-relaxed">{event.description}</p>

        <div className="mt-auto space-y-6">
          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-600">
            {event.isVirtual ? <Globe strokeWidth={2} className="h-4 w-4 text-muted-foreground/80" /> : <MapPin strokeWidth={2} className="h-4 w-4 text-muted-foreground/80" />}
            <span className="truncate">{event.location}</span>
          </div>

          <Button
            onClick={onRegister}
            disabled={isSoldOut}
            className={`w-full h-12 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-sm ${isSoldOut ? 'bg-gray-100 text-muted-foreground/80 border border-border' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<{ bkash?: string, nagad?: string, bankAccounts?: any[] }>({});
  const [registrationId, setRegistrationId] = useState<string | null>(null);

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

      if (user) {
        setValue("name", user.displayName || profile?.name || "");
        setValue("email", user.email || "");
        if (profile?.phone) setValue("phone", profile.phone);
      }

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
        userId: user.uid,
        name: data.name,
        email: data.email,
        phone: data.phone,
        trxId: data.trxId
      });

      if (result.success && result.id) {
        setRegistrationId(result.id);
        setShowSuccess(true);
        setTimeout(() => {
          onSuccess();
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
      <DialogContent className="bg-background border-border text-foreground sm:max-w-[500px] p-0 overflow-hidden shadow-2xl rounded-2xl">
        {!showSuccess ? (
          <div className="p-6 sm:p-8">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">Register for {event.title}</DialogTitle>
              <DialogDescription className="text-muted-foreground font-medium">
                {isFree ? "Complete the form below to secure your spot." : "Send payment and enter TrxID to verify your seat."}
              </DialogDescription>
            </DialogHeader>

            {!isFree && (
              <div className="bg-gray-50 border border-border p-5 rounded-xl space-y-4 mb-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm border-b border-border pb-2">
                    <span className="text-pink-600 font-bold tracking-tight">bKash (Send Money)</span>
                    <span className="font-mono bg-background border border-border px-2 py-1 rounded shadow-sm select-all font-bold">{paymentInfo.bkash || "Not Set"}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-border pb-2">
                    <span className="text-orange-600 font-bold tracking-tight">Nagad (Send Money)</span>
                    <span className="font-mono bg-background border border-border px-2 py-1 rounded shadow-sm select-all font-bold">{paymentInfo.nagad || "Not Set"}</span>
                  </div>
                </div>

                {paymentInfo.bankAccounts && paymentInfo.bankAccounts.length > 0 && (
                  <div className="pt-2 space-y-3">
                    <p className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-widest">Bank Transfer</p>
                    {paymentInfo.bankAccounts.map((bank, idx) => (
                      <div key={idx} className="text-xs bg-background p-3 rounded-lg border border-border shadow-sm space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground font-medium">Bank</span>
                          <span className="text-foreground font-bold">{bank.bankName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground font-medium">Account</span>
                          <span className="text-foreground font-mono select-all text-right font-bold">{bank.accountNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground font-medium">Name</span>
                          <span className="text-foreground text-right font-medium">{bank.accountName}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm text-muted-foreground font-medium">Ticket Price</span>
                  <span className="text-xl font-bold text-foreground">{formatCurrency(event.price)}</span>
                </div>
                <p className="text-[10px] text-muted-foreground/80 mt-2 text-center font-bold uppercase tracking-widest">* Verification may take 1-2 hours.</p>
              </div>
            )}

            {isFree && (
              <div className="bg-green-50 border border-green-200 p-5 rounded-xl mb-6 text-center shadow-sm">
                <p className="text-green-700 font-bold text-lg mb-1">This is a Free Event!</p>
                <p className="text-green-600 text-sm font-medium">No payment required. Just fill the form to register.</p>
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Full Name</Label>
                <Input id="name" {...register("name")} className="bg-gray-50 border-border text-foreground h-12 focus:bg-background focus:ring-gray-200" />
                {errors.name && <p className="text-[10px] font-bold text-red-500 uppercase">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Phone Number</Label>
                <Input id="phone" {...register("phone")} className="bg-gray-50 border-border text-foreground h-12 focus:bg-background focus:ring-gray-200" placeholder="017..." />
                {errors.phone && <p className="text-[10px] font-bold text-red-500 uppercase">{errors.phone.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email Address</Label>
                <Input id="email" {...register("email")} className="bg-gray-50 border-border text-foreground h-12 focus:bg-background focus:ring-gray-200" />
                {errors.email && <p className="text-[10px] font-bold text-red-500 uppercase">{errors.email.message}</p>}
              </div>
              {!isFree && (
                <div className="space-y-2">
                  <Label htmlFor="trxId" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Transaction ID</Label>
                  <Input id="trxId" {...register("trxId")} className="bg-gray-50 border-border text-foreground h-12 focus:bg-background focus:ring-gray-200 uppercase font-mono tracking-widest font-bold" placeholder="9G7..." />
                  {errors.trxId && <p className="text-[10px] font-bold text-red-500 uppercase">{errors.trxId.message}</p>}
                </div>
              )}
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-bold text-center">
                  {error}
                </div>
              )}
            </div>

            <DialogFooter className="gap-3 sm:gap-0">
              <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-xs h-12">Cancel</Button>
              <Button onClick={handleSubmit(onSubmit)} disabled={isLoading} className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold uppercase tracking-widest text-xs h-12 shadow-sm">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="p-10 flex flex-col items-center justify-center text-center bg-gray-50">
            <div className="h-20 w-20 bg-background border border-border shadow-sm rounded-full flex items-center justify-center text-foreground mb-6">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">Verification Pending</h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-8 font-medium leading-relaxed">
              We have received your request. Your seat will be confirmed after checking the details.
            </p>
            {registrationId && (
              <div className="space-y-4 w-full max-w-sm">
                <div className="bg-background border border-border shadow-sm rounded-xl p-5 w-full cursor-pointer hover:border-gray-300 transition-colors"
                  onClick={() => navigator.clipboard.writeText(registrationId)}>
                  <p className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-widest mb-2">Registration ID</p>
                  <p className="font-mono text-3xl text-foreground font-bold tracking-tight">{registrationId}</p>
                  <p className="text-[10px] font-bold text-muted-foreground/80 mt-2 uppercase tracking-widest">Click to copy</p>
                </div>

                <Button
                  variant="outline"
                  className="w-full border-border text-foreground hover:bg-gray-100 font-bold uppercase tracking-widest text-xs h-12 shadow-sm"
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
                              .status { display: inline-block; padding: 5px 15px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 50px; font-size: 14px; font-weight: bold; }
                              .footer { margin-top: 40px; font-size: 12px; color: #666; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
                            </style>
                          </head>
                          <body>
                            <div class="container">
                              <h1>Event Registration</h1>
                              <p>Status: <span class="status">VERIFICATION PENDING</span></p>
                              <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
                              <p style="font-size: 12px; font-weight: bold; color: #6b7280; text-transform: uppercase; letter-spacing: 2px;">Registration ID</p>
                              <div class="id">${registrationId}</div>
                              <p style="color: #4b5563;">Please save this ID. We are verifying your details.</p>
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
