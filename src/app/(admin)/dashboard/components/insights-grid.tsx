"use client";

import { Activity, Users, DollarSign, ArrowUp, ArrowDown } from "lucide-react";
import { formatCurrency } from "@/lib/format";

interface InsightsProps {
  stats: {
    revenue: number;
    totalStudents: number;
    systemHealth: number; // 0-100
    activeUsers: { image?: string; name: string }[];
  };
}

export function InsightsGrid({ stats }: InsightsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* 1. Revenue Card with Sparkline */}
      <div className="relative group overflow-hidden rounded-2xl border border-border bg-background p-6 shadow-sm hover:shadow-md hover:border-gray-300 transition-all">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Total Revenue</h3>
          <div className="flex items-center text-green-700 font-bold text-xs bg-green-50 px-2 py-1 rounded-full border border-green-200">
            <ArrowUp className="w-3 h-3 mr-1" /> 12%
          </div>
        </div>
        <p className="text-3xl font-bold text-foreground mb-4">{formatCurrency(stats.revenue)}</p>

        {/* Visual Sparkline Placeholder */}
        <div className="h-12 w-full flex items-end gap-1 opacity-80">
          {[40, 65, 50, 80, 55, 90, 70, 85, 60, 95].map((h, i) => (
            <div
              key={i}
              style={{ height: `${h}%` }}
              className="flex-1 bg-primary/10 rounded-t-sm hover:bg-primary/20 transition-colors"
            />
          ))}
        </div>
      </div>

      {/* 2. System Health - Circular Progress */}
      <div className="relative group overflow-hidden rounded-2xl border border-border bg-background p-6 flex items-center justify-between shadow-sm hover:shadow-md hover:border-gray-300 transition-all">
        <div>
          <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-2">System Health</h3>
          <p className="text-2xl font-bold text-foreground mb-2">
            {stats.systemHealth > 80 ? 'Excellent' : 'Stable'}
          </p>
          <p className="text-xs font-medium text-muted-foreground">Firestore Usage: Normal</p>
        </div>

        <div className="relative h-20 w-20 flex items-center justify-center">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-gray-100"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="text-emerald-500"
              strokeDasharray={`${stats.systemHealth}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Activity className="h-5 w-5 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* 3. Active Students - Face Pile */}
      <div className="relative group overflow-hidden rounded-2xl border border-border bg-background p-6 shadow-sm hover:shadow-md hover:border-gray-300 transition-all">
        <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-4">Active Students</h3>
        <div className="flex items-center -space-x-3 mb-6">
          {stats.activeUsers.slice(0, 5).map((user, i) => (
            <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-foreground relative z-10 hover:z-20 hover:scale-110 transition-transform cursor-pointer shadow-sm" title={user.name}>
              {user.name.substring(0, 2).toUpperCase()}
            </div>
          ))}
          {stats.totalStudents > 5 && (
            <div className="h-10 w-10 rounded-full border-2 border-white bg-gray-50 flex items-center justify-center text-xs font-bold text-muted-foreground relative z-0 shadow-sm">
              +{stats.totalStudents - 5}
            </div>
          )}
        </div>
        <div className="flex items-center text-xs font-bold text-muted-foreground uppercase tracking-widest">
          <div className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse" />
          {stats.activeUsers.length} users online now
        </div>
      </div>
    </div>
  );
}
