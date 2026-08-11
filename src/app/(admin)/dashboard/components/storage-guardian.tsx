"use client";

import { Button } from "@/components/ui/button";
import { HardDrive, Trash2 } from "lucide-react";
import Link from "next/link";

interface StorageGuardianProps {
  usagePercent: number; // 0-100
  fileCount: number;
}

export function StorageGuardian({ usagePercent, fileCount }: StorageGuardianProps) {
  const isCritical = usagePercent > 80;

  return (
    <div className="bg-background border border-border rounded-2xl p-6 relative overflow-hidden shadow-sm">
      {/* Background Glow if Critical */}
      {isCritical && (
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-red-100 rounded-full blur-[50px] pointer-events-none" />
      )}

      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`h-12 w-12 rounded-xl flex items-center justify-center border ${isCritical ? 'bg-red-50 border-red-200 text-red-600' : 'bg-gray-50 border-border text-muted-foreground'}`}>
            <HardDrive className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">Storage Guardian</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 mt-1">{fileCount} assets managed</p>
          </div>
        </div>

        <Button variant="outline" size="sm" className="h-9 border-border text-xs font-bold uppercase tracking-widest text-gray-600 hover:text-foreground hover:bg-gray-50" asChild>
          <Link href="/dashboard/system">
            <Trash2 className="h-3 w-3 mr-2" />
            Clean
          </Link>
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
          <span className="text-muted-foreground">Cloudinary Usage</span>
          <span className={isCritical ? "text-red-600" : "text-foreground"}>{usagePercent}%</span>
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${isCritical ? 'bg-red-500' : 'bg-primary'}`}
            style={{ width: `${usagePercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
