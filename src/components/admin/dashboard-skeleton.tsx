import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
 return (
 <div className="flex min-h-screen bg-black text-white selection:bg-primary/30">
 {/* Sidebar Skeleton - Hidden on mobile, visible on md+ */}
 <aside className="hidden h-screen w-64 flex-col border-r border-gray-200 bg-gray-50 md:flex">
 <div className="flex h-16 items-center border-b border-gray-200 px-6">
 <Skeleton className="h-6 w-32 bg-white" />
 </div>

 <div className="flex-1 space-y-3 p-4">
 {Array.from({ length: 8 }).map((_, i) => (
 <Skeleton key={i} className="h-10 w-full rounded-lg bg-white" />
 ))}
 </div>

 <div className="border-t border-gray-200 p-4">
 <Skeleton className="h-10 w-full bg-white" />
 </div>
 </aside>

 {/* Main Content Skeleton */}
 <div className="flex-1 flex flex-col min-h-screen">
 {/* Mobile Header Skeleton */}
 <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-gray-50 px-4 md:hidden">
 <Skeleton className="h-8 w-8 rounded-md bg-white" />
 <Skeleton className="h-6 w-24 bg-white" />
 </header>

 <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 space-y-8">
 {/* Page Header */}
 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
 <div className="space-y-2">
 <Skeleton className="h-8 w-48 bg-white" />
 <Skeleton className="h-4 w-64 bg-white" />
 </div>
 <Skeleton className="h-10 w-32 bg-white" />
 </div>

 {/* Content Grid */}
 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
 {Array.from({ length: 6 }).map((_, i) => (
 <Skeleton key={i} className="h-64 rounded-xl bg-white" />
 ))}
 </div>
 </main>
 </div>
 </div>
 );
}
