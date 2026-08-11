"use client";

import { useEffect, useState } from "react";
import { CMSService } from "@/lib/cms-service";
import { formatDistanceToNow } from "date-fns";
import { InsightsGrid } from "./components/insights-grid";
import { LiveActivityFeed } from "./components/live-activity-feed";
import { StorageGuardian } from "./components/storage-guardian";
import { FolderGit, Hammer, FileText, Settings, Users, BookOpen, Activity, Play } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    stats: any;
    activities: any[];
    storage: any;
    rawCounts?: { projects: number; tools: number; posts: number; users: number };
  } | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [usersData, registrations, projects, tools, posts] = await Promise.all([
          CMSService.getUsers(null, 50),
          CMSService.getAllRegistrations(),
          CMSService.getProjects(),
          CMSService.getTools(),
          CMSService.getPosts(false)
        ]);

        // 1. Calculate Insights
        const approvedRegs = registrations.filter(r => r.status === "approved");
        const totalRevenue = approvedRegs.length * 50; // Mock avg price $50
        const activeUsers = usersData.users.slice(0, 5).map(u => ({
          name: (u as any).displayName || (u as any).email || "User",
          image: (u as any).photoURL
        }));

        // 2. Generate Live Activity Feed
        const activities = registrations.slice(0, 10).map(r => ({
          id: r.id,
          type: 'registration',
          message: `${r.name} registered for an event/course`,
          time: r.registeredAt ? formatDistanceToNow(r.registeredAt.toDate(), { addSuffix: true }) : 'Just now'
        }));

        // 3. Storage Calculation (Mock)
        const totalAssets = projects.length + tools.length + posts.length;
        const storagePercent = Math.min(100, Math.floor((totalAssets * 5) / 10)); // Arbitrary logic

        setData({
          stats: {
            revenue: totalRevenue,
            totalStudents: approvedRegs.length,
            systemHealth: 98,
            activeUsers
          },
          rawCounts: {
            projects: projects.length,
            tools: tools.length,
            posts: posts.length,
            users: usersData.users.length
          },
          activities,
          storage: {
            usagePercent: storagePercent,
            fileCount: totalAssets * 3 // Approx images per item
          }
        });

      } catch (error) {
        console.error("Dashboard load failed", error);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  if (loading || !data) {
    return <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 rounded-2xl bg-background border border-border" />)}
      </div>
      <Skeleton className="h-96 rounded-2xl bg-background border border-border" />
    </div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 1. Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Command Center</h1>
        <p className="text-muted-foreground font-medium">System Overview & Performance Metrics</p>
      </div>

      {/* 2. Insights Grid */}
      <InsightsGrid stats={data.stats} />

      {/* 3. Main Layout: Activity + Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Live Activity (2 cols wide) */}
        <div className="lg:col-span-2 space-y-8">
          <LiveActivityFeed activities={data.activities} />

          {/* Content Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Projects", val: (data as any).rawCounts?.projects || 0, icon: FolderGit },
              { label: "Tools", val: (data as any).rawCounts?.tools || 0, icon: Hammer },
              { label: "Posts", val: (data as any).rawCounts?.posts || 0, icon: FileText },
              { label: "Users", val: (data as any).rawCounts?.users || 0, icon: Users },
            ].map((s, i) => (
              <div key={i} className="p-4 flex items-center gap-3 bg-background border border-border rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-muted-foreground">
                  <s.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-widest">{s.label}</p>
                  <p className="text-xl font-bold text-foreground">{s.val}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Storage & Shortcuts (1 col wide) */}
        <div className="space-y-8">
          <StorageGuardian usagePercent={data.storage.usagePercent} fileCount={data.storage.fileCount} />

          <div className="p-6 bg-background border border-border rounded-2xl shadow-sm">
            <h3 className="font-bold text-foreground mb-4">Quick Shortcuts</h3>
            <div className="grid gap-3">
              <Link href="/dashboard/blog/create" className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-300 transition-colors group">
                <div className="h-8 w-8 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                  <FileText className="h-4 w-4" />
                </div>
                <span className="text-sm font-bold text-foreground">New Blog Post</span>
              </Link>
              <Link href="/dashboard/projects" className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-300 transition-colors group">
                <div className="h-8 w-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                  <FolderGit className="h-4 w-4" />
                </div>
                <span className="text-sm font-bold text-foreground">Manage Projects</span>
              </Link>
              <Link href="/dashboard/system" className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-300 transition-colors group">
                <div className="h-8 w-8 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                  <Settings className="h-4 w-4" />
                </div>
                <span className="text-sm font-bold text-foreground">System Settings</span>
              </Link>
              <Link href="/courses" target="_blank" className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-300 transition-colors group">
                <div className="h-8 w-8 rounded-full bg-pink-100 border border-pink-200 flex items-center justify-center text-pink-600 group-hover:scale-110 transition-transform">
                  <Play className="h-4 w-4 ml-0.5" />
                </div>
                <span className="text-sm font-bold text-foreground">View Live Site</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
