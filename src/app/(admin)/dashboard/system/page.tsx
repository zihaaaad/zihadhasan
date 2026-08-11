"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Database, Trash2, RefreshCw, HardDrive, Activity, Users, Box, FileText, ShoppingBag, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { getSystemStats, cleanupSoftDeletedItems } from "@/actions/system";
import { GlassCard } from "@/components/shared/glass-card";
import { Switch } from "@/components/ui/switch";
import { CMSService } from "@/lib/cms-service";
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

export default function SystemHealthPage() {
 const [stats, setStats] = useState<{
 storage: { used: number; limit: number };
 firebase: {
 reads: string;
 writes: string;
 status: string;
 details?: Record<string, number>;
 };
 trash: number;
 } | null>(null);
 const [loading, setLoading] = useState(true);
 const [cleaning, setCleaning] = useState(false);
 const [confirmCleanup, setConfirmCleanup] = useState(false);

 useEffect(() => {
 loadStats();
 }, []);

 const loadStats = async () => {
 setLoading(true);
 try {
 const [data, settings] = await Promise.all([
 getSystemStats(),
 CMSService.getGlobalSettings()
 ]);
 setStats({ ...data, features: settings?.features } as any);
 } catch (error) {
 console.error(error);
 toast.error("Failed to load system stats.");
 } finally {
 setLoading(false);
 }
 };

 const handleCleanup = async () => {
 if (!stats?.trash) {
 toast.info("No items to clean up.");
 return;
 }
 setConfirmCleanup(true);
 };

 const confirmedCleanup = async () => {
 setCleaning(true);
 try {
 const result = await cleanupSoftDeletedItems();
 if (result.success) {
 toast.success(`Cleanup complete. Removed ${result.count} items.`);
 loadStats(); // Refresh
 } else {
 toast.error("Cleanup failed.");
 }
 } catch (error) {
 console.error(error);
 toast.error("An error occurred during cleanup.");
 } finally {
 setCleaning(false);
 setConfirmCleanup(false);
 }
 };

 return (
 <div className="space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground transition-colors">System Health</h2>
          <p className="text-muted-foreground font-medium">Monitor storage, database usage, and perform maintenance.</p>
        </div>
        <Button onClick={loadStats} variant="outline" className="gap-2 border-border text-foreground hover:bg-gray-50 bg-background font-bold uppercase text-[10px] tracking-widest">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>



 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
 {/* Feature Control - NEW */}
      <div className="p-6 md:col-span-3 bg-background border border-border rounded-xl shadow-sm">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2 mb-6">
          <div className="flex items-center gap-2">
            <Box strokeWidth={1.5} className="h-5 w-5 text-foreground" />
            <span className="font-bold text-lg text-foreground">Visibility Control</span>
          </div>
          <Badge variant="outline" className="border-border text-muted-foreground bg-gray-50 uppercase tracking-widest text-[9px]">Settings</Badge>
        </div>

        {stats ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { key: "showProjects", label: "Projects Section", desc: "Show portfolio projects." },
              { key: "showTools", label: "AI Tools", desc: "Show SaaS tools directory." },
              { key: "showBlog", label: "Thinking (Blog)", desc: "Show articles and insights." },
              { key: "showEvents", label: "Events & Workshops", desc: "Show upcoming events." },
              { key: "showCourses", label: "Courses (LMS)", desc: "Show course catalog." },
              { key: "showShop", label: "Store", desc: "Show digital products." },
            ].map((feature) => (
              <div key={feature.key} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-border">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-foreground uppercase tracking-tight">{feature.label}</h4>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{feature.desc}</p>
                </div>
 <Switch
 checked={(stats as any).features?.[feature.key] ?? true}
 onCheckedChange={async (checked) => {
 // Optimistic Update
 const newStats = { ...stats };
 if (!(newStats as any).features) (newStats as any).features = {};
 (newStats as any).features[feature.key] = checked;
 setStats(newStats);

 // API Call
 try {
 await CMSService.updateGlobalSettings({
 features: {
 ...(stats as any).features,
 [feature.key]: checked
 }
 });
 toast.success(`${feature.label} ${checked ? "Enabled" : "Disabled"}`);
 } catch (e) {
 toast.error("Failed to update setting");
 loadStats(); // Revert
 }
 }}
 />
 </div>
 ))}
 </div>
 ) : (
 <div className="h-20 animate-pulse bg-background rounded" />
 )}
        </div>

 {/* Firebase Health */}
      <div className="p-6 md:col-span-2 bg-background border border-border rounded-xl shadow-sm">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2 mb-4">
          <div className="flex items-center gap-2">
            <Activity strokeWidth={1.5} className="h-5 w-5 text-foreground" />
            <span className="font-bold text-lg text-foreground">Database Metrics</span>
          </div>
          <Badge variant="outline" className="border-border text-muted-foreground bg-gray-50 uppercase tracking-widest text-[9px]">Live</Badge>
        </div>
 {stats ? (
 <div className="space-y-6">
 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-border flex flex-col items-center justify-center">
                <Users strokeWidth={1.5} className="h-5 w-5 text-muted-foreground/80 mb-2" />
                <div className="text-2xl font-bold text-foreground">{stats.firebase.details?.users || 0}</div>
                <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Users</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-border flex flex-col items-center justify-center">
                <GraduationCap strokeWidth={1.5} className="h-5 w-5 text-muted-foreground/80 mb-2" />
                <div className="text-2xl font-bold text-foreground">{stats.firebase.details?.registrations || 0}</div>
                <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Registrations</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-border flex flex-col items-center justify-center">
                <Box strokeWidth={1.5} className="h-5 w-5 text-muted-foreground/80 mb-2" />
                <div className="text-2xl font-bold text-foreground">{stats.firebase.details?.products || 0}</div>
                <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Products</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-border flex flex-col items-center justify-center">
                <FileText strokeWidth={1.5} className="h-5 w-5 text-muted-foreground/80 mb-2" />
                <div className="text-2xl font-bold text-foreground">{stats.firebase.details?.posts || 0}</div>
                <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Posts</div>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm bg-gray-50 p-4 rounded-xl border border-border">
              <div className="flex items-center gap-2 text-foreground">
                <Activity strokeWidth={1.5} className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">System Status: Healthy</span>
              </div>
              <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Total Documents: ~{stats.firebase.writes}</span>
            </div>
 </div>
 ) : (
 <div className="h-32 animate-pulse bg-background rounded-xl" />
 )}
        </div>

 {/* Maintenance Actions */}
      <div className="p-6 bg-background border border-border rounded-xl shadow-sm">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2 mb-4">
          <div className="flex items-center gap-2">
            <Trash2 strokeWidth={1.5} className="h-5 w-5 text-foreground" />
            <span className="font-bold text-lg text-foreground">Trash Bin</span>
          </div>
          <Badge variant="outline" className="border-border text-muted-foreground bg-gray-50 uppercase tracking-widest text-[9px]">Action Required</Badge>
        </div>

        <div className="space-y-6">
          {stats ? (
            <div className="text-center py-4">
              <span className="text-4xl font-black text-foreground">{stats.trash}</span>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Items marked for deletion</p>
            </div>
          ) : (
            <div className="h-20 animate-pulse bg-gray-50 rounded" />
          )}

          <div className="p-4 border border-border bg-gray-50 rounded-xl space-y-3">
            <h4 className="text-[10px] font-bold text-foreground flex items-center gap-2 uppercase tracking-widest">
              <AlertTriangle strokeWidth={1.5} className="h-4 w-4 text-foreground" />
              The Purge
            </h4>
            <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-[0.1em] leading-relaxed">
              Permanently remove all soft-deleted items from the database.
            </p>
            <Button
              variant="destructive"
              size="sm"
              className="w-full bg-red-600 text-primary-foreground hover:bg-red-700 font-bold uppercase tracking-widest text-[9px] h-10 rounded-lg"
 onClick={handleCleanup}
 disabled={cleaning || !stats?.trash}
 >
 {cleaning ? <RefreshCw className="mr-2 h-3 w-3 animate-spin" /> : <Trash2 strokeWidth={1.5} className="mr-2 h-3 w-3" />}
 {cleaning ? "Purging..." : "Empty Trash"}
 </Button>
 </div>
 </div>
        </div>

 {/* Cloudinary Storage (Visual Only) */}
      <div className="p-6 bg-background border border-border rounded-xl shadow-sm">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2 mb-4">
          <div className="flex items-center gap-2">
            <HardDrive strokeWidth={1.5} className="h-5 w-5 text-foreground" />
            <span className="font-bold text-lg text-foreground">Storage</span>
          </div>
          <Badge variant="outline" className="border-border text-muted-foreground bg-gray-50 uppercase tracking-widest text-[9px]">Media</Badge>
        </div>
        {stats ? (
          <div className="space-y-4">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <span>{stats.storage.used}GB Used</span>
              <span>{stats.storage.limit}GB Limit</span>
            </div>
            <Progress
              value={(stats.storage.used / stats.storage.limit) * 100}
              className="h-1.5 bg-gray-100"
            />
            <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest">
              Media assets stored in Cloudinary. (Estimate)
            </p>
            <Button variant="ghost" size="sm" className="w-full text-[9px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-gray-100 h-10 rounded-lg mt-2" asChild>
 <a href="https://console.cloudinary.com" target="_blank" rel="noopener noreferrer">
 View Cloudinary Console
 </a>
 </Button>
 </div>
 ) : (
 <div className="h-20 animate-pulse bg-background rounded" />
 )}
        </div>
 </div>

      <AlertDialog open={confirmCleanup} onOpenChange={setConfirmCleanup}>
        <AlertDialogContent className="bg-background border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground font-medium">
              This will permanently delete {stats?.trash ?? 0} soft-deleted item{stats?.trash === 1 ? "" : "s"} from the database. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
 <AlertDialogFooter>
 <AlertDialogCancel>Cancel</AlertDialogCancel>
 <AlertDialogAction
 onClick={confirmedCleanup}
 className="bg-red-600 hover:bg-red-700 text-primary-foreground"
 >
 Empty Trash
 </AlertDialogAction>
 </AlertDialogFooter>
 </AlertDialogContent>
 </AlertDialog>
 </div>
 );
}
