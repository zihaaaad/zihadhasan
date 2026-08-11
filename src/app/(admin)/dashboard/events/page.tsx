"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Calendar, MapPin, Users, Globe, Loader2, ListTodo } from "lucide-react";
import { CMSService, Event } from "@/lib/cms-service";
import { Button } from "@/components/ui/button";
import { EventForm } from "@/components/admin/event-form";
import { Badge } from "@/components/ui/badge";
import { Timestamp } from "firebase/firestore";

import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { formatDate as formatDateUtil, formatMonthShort } from "@/lib/format";

export default function EventsPage() {
 const [events, setEvents] = useState<Event[]>([]);
 const [loading, setLoading] = useState(true);
 const [isFormOpen, setIsFormOpen] = useState(false);
 const [editingEvent, setEditingEvent] = useState<Event | null>(null);
 const [deletingEventId, setDeletingEventId] = useState<string | null>(null);
 const [isDeleting, setIsDeleting] = useState(false);

 useEffect(() => {
 loadEvents();
 }, []);

 const loadEvents = async () => {
 setLoading(true);
 try {
 const data = await CMSService.getEvents();
 setEvents(data);
 } catch (error) {
 console.error("Failed to load events", error);
 } finally {
 setLoading(false);
 }
 };

 const handleCreate = () => {
 setEditingEvent(null);
 setIsFormOpen(true);
 };

 const handleEdit = (event: Event) => {
 setEditingEvent(event);
 setIsFormOpen(true);
 };

 const handleSubmit = async (data: any) => {
 if (editingEvent && editingEvent.id) {
 await CMSService.updateEvent(editingEvent.id, data);
 } else {
 await CMSService.addEvent(data);
 }
 await loadEvents();
 };

 const handleDelete = (id: string) => {
 setDeletingEventId(id);
 };

 const executeDelete = async (deleteRegistrations: boolean) => {
 if (!deletingEventId) return;
 setIsDeleting(true);
 try {
 await CMSService.deleteEvent(deletingEventId, deleteRegistrations);
 setEvents(prev => prev.filter(e => e.id !== deletingEventId));
 setDeletingEventId(null);
 } catch (error) {
 console.error(error);
 toast.error("Failed to delete event.");
 } finally {
 setIsDeleting(false);
 }
 };

 const formatDate = (timestamp: Timestamp) => {
 return formatDateUtil(timestamp, {
 month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
 });
 };

 return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Events</h2>
          <p className="text-muted-foreground font-medium">Manage upcoming workshops and sessions.</p>
        </div>
        <Button onClick={handleCreate} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" /> Schedule Event
        </Button>
      </div>

 {loading ? (
 <div className="flex justify-center p-12">
 <Loader2 className="animate-spin text-primary h-8 w-8" />
 </div>
 ) : (
 <div className="space-y-4">
 {events.map((event) => (
              <div
                key={event.id}
                className="flex flex-col md:flex-row gap-4 p-4 rounded-xl border border-border bg-background hover:border-gray-300 transition-colors shadow-sm"
              >
                {/* Date Badge */}
                <div className="flex-shrink-0 flex flex-col items-center justify-center p-3 rounded-lg bg-gray-50 border border-gray-100 w-full md:w-20 text-center">
                  <span className="text-[10px] tracking-widest uppercase text-muted-foreground font-bold">
                    {event.date && formatMonthShort(event.date)}
                  </span>
                  <span className="text-xl font-bold text-foreground">
                    {event.date && new Date(event.date.seconds * 1000).getDate()}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-foreground truncate">{event.title}</h3>
                    {event.isVirtual && (
                      <Badge variant="secondary" className="bg-gray-100 text-foreground border-border text-[10px] tracking-widest uppercase font-bold h-5">
                        Virtual
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(event.date)}
                    </div>
                    <div className="flex items-center gap-1">
                      {event.isVirtual ? <Globe className="h-3.5 w-3.5" /> : <MapPin className="h-3.5 w-3.5" />}
                      <span className="truncate max-w-[200px]">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      <span>{event.registeredCount || 0} / {event.totalSeats} Registered</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 md:self-center">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-gray-100" onClick={() => handleEdit(event)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => event.id && handleDelete(event.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
 ))}

            {events.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-gray-300 rounded-xl bg-gray-50">
                <ListTodo className="h-10 w-10 text-foreground mb-4" />
                <h3 className="text-xl font-bold text-foreground">No Events Scheduled</h3>
                <p className="text-muted-foreground font-medium mt-2">Create your first event to start accepting registrations.</p>
              </div>
            )}
 </div>
 )}

 <EventForm
 open={isFormOpen}
 onOpenChange={setIsFormOpen}
 onSubmit={handleSubmit}
 initialData={editingEvent}
 />

 <AlertDialog open={!!deletingEventId} onOpenChange={(open) => !open && setDeletingEventId(null)}>
 <AlertDialogContent>
 <AlertDialogHeader>
 <AlertDialogTitle>Delete Event?</AlertDialogTitle>
 <AlertDialogDescription>
 This action cannot be undone. How should we handle the registrations associated with this event?
 </AlertDialogDescription>
 </AlertDialogHeader>
 <div className="flex flex-col gap-2 mt-4">
 <Button
 variant="destructive"
 onClick={() => executeDelete(true)}
 disabled={isDeleting}
 >
 {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
 Delete Event & All Registrations
 </Button>
 <Button
 variant="outline"
 className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
 onClick={() => executeDelete(false)}
 disabled={isDeleting}
 >
 Delete Event Only (Keep Data)
 </Button>
 <Button
 variant="ghost"
 onClick={() => setDeletingEventId(null)}
 disabled={isDeleting}
 >
 Cancel
 </Button>
 </div>
 </AlertDialogContent>
 </AlertDialog>
 </div>
 );
}
