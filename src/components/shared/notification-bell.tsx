"use client";

import { useState, useEffect } from "react";
import { Bell, Check, CheckCheck, Trash2, MailOpen } from "lucide-react";
import { collection, query, where, orderBy, onSnapshot, limit, doc, updateDoc, writeBatch, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/auth/auth-provider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export interface UserNotification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: any;
  link?: string;
}

export function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Subscribe to notifications subcollection
    const q = query(
      collection(db, "users", user.uid, "notifications"),
      orderBy("createdAt", "desc"),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as UserNotification));
      setNotifications(items);
      setUnreadCount(items.filter(n => !n.read).length);
    });

    return () => unsubscribe();
  }, [user]);

  const markAsRead = async (notificationId: string) => {
    if (!user) return;
    try {
      const ref = doc(db, "users", user.uid, "notifications", notificationId);
      await updateDoc(ref, { read: true });
    } catch (error) {
      console.error("Error marking read", error);
    }
  };

  const markAllAsRead = async () => {
    if (!user || unreadCount === 0) return;
    try {
      const batch = writeBatch(db);
      const q = query(
        collection(db, "users", user.uid, "notifications"),
        orderBy("createdAt", "desc"),
        limit(50) 
      );

      const snapshot = await getDocs(q);
      let updateCount = 0;

      snapshot.docs.forEach((doc) => {
        if (doc.data().read === false) {
          batch.update(doc.ref, { read: true });
          updateCount++;
        }
      });

      if (updateCount > 0) {
        await batch.commit();
      }
    } catch (error) {
      console.error("Error marking all read", error);
    }
  };

  const clearAllNotifications = async () => {
    if (!user || notifications.length === 0) return;
    try {
      const batch = writeBatch(db);
      const q = query(
        collection(db, "users", user.uid, "notifications"),
        limit(20)
      );
      const snapshot = await getDocs(q);
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    } catch (error) {
      console.error("Error clearing notifications", error);
    }
  };

  const handleNotificationClick = (notification: UserNotification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    setIsOpen(false);
  };

  if (!user) return null;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={unreadCount > 0 ? `Notifications (${unreadCount} unread)` : "Notifications"}
          className="relative text-muted-foreground hover:text-foreground hover:bg-gray-100 rounded-full h-9 w-9 transition-colors"
        >
          <Bell strokeWidth={1.5} className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-primary border border-white animate-pulse" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-background border border-gray-100 shadow-xl rounded-2xl text-foreground overflow-hidden" align="end">
        <div className="flex items-center justify-between p-4 border-b border-gray-50 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-sm">Notifications</h4>
            {unreadCount > 0 && (
              <span className="text-[10px] font-bold bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          {notifications.length > 0 && (
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-[10px] px-2 text-muted-foreground hover:text-foreground hover:bg-gray-100 rounded-md"
                  onClick={markAllAsRead}
                >
                  <CheckCheck strokeWidth={1.5} className="mr-1 h-3 w-3" /> Mark read
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-[10px] px-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-md"
                onClick={clearAllNotifications}
              >
                <Trash2 strokeWidth={1.5} className="mr-1 h-3 w-3" /> Clear
              </Button>
            </div>
          )}
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center flex flex-col items-center gap-2 text-muted-foreground/80">
              <div className="p-3 bg-gray-50 rounded-full">
                <MailOpen strokeWidth={1.5} className="h-6 w-6 opacity-50" />
              </div>
              <p className="text-sm font-medium">No notifications yet</p>
              <p className="text-xs text-muted-foreground/80">We'll notify you when something arrives</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-4 transition-colors hover:bg-gray-50 relative group block text-left w-full",
                    !notification.read && "bg-gray-50/80"
                  )}
                >
                  <div className="flex gap-3">
                    <div className="flex-1 space-y-1">
                      <p className={cn("text-sm", !notification.read ? "text-foreground font-bold" : "text-gray-600 font-medium")}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-[10px] text-muted-foreground/80 font-medium">
                        {notification.createdAt?.seconds ? formatDistanceToNow(new Date(notification.createdAt.seconds * 1000), { addSuffix: true }) : 'Just now'}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="flex flex-col justify-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground/80 hover:text-foreground hover:bg-gray-200 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                          title="Mark as read"
                          aria-label="Mark as read"
                        >
                          <Check strokeWidth={1.5} className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                  {notification.link && (
                    <Link
                      href={notification.link}
                      className="absolute inset-0 z-10"
                      onClick={() => handleNotificationClick(notification)}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-2 border-t border-gray-50 bg-gray-50/50">
          <Link href="/notifications" onClick={() => setIsOpen(false)}>
            <Button variant="ghost" className="w-full h-8 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-gray-100 rounded-md">
              View all notifications
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
