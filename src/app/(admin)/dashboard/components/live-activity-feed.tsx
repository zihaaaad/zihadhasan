"use client";

import { Clock, UserPlus, ShoppingCart, MessageSquare } from "lucide-react";

interface ActivityItem {
  id: string;
  type: 'registration' | 'message' | 'purchase' | 'system';
  message: string;
  time: string;
}

interface LiveActivityFeedProps {
  activities: ActivityItem[];
}

export function LiveActivityFeed({ activities }: LiveActivityFeedProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'registration': return <UserPlus className="h-4 w-4 text-blue-600" />;
      case 'purchase': return <ShoppingCart className="h-4 w-4 text-emerald-600" />;
      case 'message': return <MessageSquare className="h-4 w-4 text-purple-600" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="bg-background border border-border rounded-2xl overflow-hidden h-full flex flex-col shadow-sm">
      <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
        <h3 className="font-bold text-foreground">Live Activity</h3>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Real-time</span>
        </div>
      </div>

      <div className="p-6 overflow-y-auto max-h-[400px] space-y-0 relative">
        {/* Vertical Line */}
        <div className="absolute left-[35px] top-6 bottom-6 w-px bg-gray-200" />

        {activities.length === 0 ? (
          <div className="text-center text-muted-foreground py-10 font-medium">No recent activity</div>
        ) : (
          activities.map((item, i) => (
            <div key={item.id} className="relative flex items-start gap-4 pb-8 last:pb-0 group">
              <div className={`z-10 mt-1 h-8 w-8 flex items-center justify-center rounded-full border border-border bg-background ring-4 ring-white transform transition-transform group-hover:scale-110 shadow-sm`}>
                {getIcon(item.type)}
              </div>
              <div className="flex-1 -mt-1 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-border">
                <p className="text-sm font-medium text-foreground leading-snug">{item.message}</p>
                <p className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-widest mt-1">{item.time}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
