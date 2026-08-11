"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { GlassCard } from "@/components/shared/glass-card";
import { Badge } from "@/components/ui/badge";
import { Message, CMSService } from "@/lib/cms-service";
import { Loader2, Mail, Clock, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
 AlertDialog,
 AlertDialogAction,
 AlertDialogCancel,
 AlertDialogContent,
 AlertDialogDescription,
 AlertDialogFooter,
 AlertDialogHeader,
 AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function MessagesPage() {
 const [messages, setMessages] = useState<Message[]>([]);
 const [loading, setLoading] = useState(true);
 const [deletingId, setDeletingId] = useState<string | null>(null);

 const fetchMessages = async () => {
 setLoading(true);
 try {
 const q = query(
 collection(db, "messages"),
 orderBy("createdAt", "desc"),
 limit(50)
 );
 const snapshot = await getDocs(q);
 const data = snapshot.docs.map(doc => ({
 id: doc.id,
 ...doc.data()
 })) as Message[];
 setMessages(data);
 } catch (error) {
 console.error("Failed to fetch messages", error);
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 fetchMessages();
 }, []);

 const handleDelete = async (id: string) => {
 try {
 await CMSService.deleteMessage(id);
 toast.success("Message deleted");
 setMessages(prev => prev.filter(msg => msg.id !== id));
 setDeletingId(null);
 } catch (error) {
 console.error("Failed to delete message", error);
 toast.error("Failed to delete message");
 }
 };

 if (loading) {
 return (
 <div className="flex items-center justify-center min-h-[400px]">
 <Loader2 className="h-8 w-8 animate-spin text-primary" />
 </div>
 );
 }

 return (
 <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Inbox</h1>
        <p className="text-muted-foreground font-medium">View messages from your contact form.</p>
      </div>

 <div className="grid gap-4">
        {messages.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground font-medium bg-background border border-dashed border-gray-300 rounded-xl">
            <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground/80" />
            <p>No messages yet.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="p-6 transition-all bg-background border border-border shadow-sm rounded-xl hover:border-gray-300 group">
              <div className="flex flex-col md:flex-row gap-4 justify-between md:items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-foreground text-lg">{msg.subject}</h3>
                    {!msg.read && (
                      <Badge className="bg-primary text-primary-foreground hover:bg-primary/90 text-[10px] font-bold uppercase tracking-widest">New</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                    <span className="text-foreground font-bold">{msg.name}</span>
                    <span>•</span>
                    <span className="text-foreground">{msg.email}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">
                    <Clock className="h-3 w-3" />
                    {msg.createdAt ? formatDistanceToNow(msg.createdAt.toDate(), { addSuffix: true }) : 'Just now'}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground/80 hover:text-red-600 hover:bg-red-50"
                    onClick={() => msg.id && setDeletingId(msg.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-4 p-4 rounded-lg bg-gray-50 border border-border text-foreground font-medium whitespace-pre-wrap">
                {msg.message}
              </div>
            </div>
          ))
        )}
 </div>

 <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
 <AlertDialogContent>
 <AlertDialogHeader>
 <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
 <AlertDialogDescription>
 This will permanently delete this message. This action cannot be undone.
 </AlertDialogDescription>
 </AlertDialogHeader>
 <AlertDialogFooter>
 <AlertDialogCancel>Cancel</AlertDialogCancel>
 <AlertDialogAction
 onClick={() => deletingId && handleDelete(deletingId)}
 className="bg-red-600 hover:bg-red-700 text-primary-foreground"
 >
 Delete Message
 </AlertDialogAction>
 </AlertDialogFooter>
 </AlertDialogContent>
 </AlertDialog>
 </div>
 );
}
