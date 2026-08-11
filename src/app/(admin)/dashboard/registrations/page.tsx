"use client";

import { useEffect, useState } from "react";
import { CMSService, Registration, Event, Course, Product } from "@/lib/cms-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, CheckCircle, XCircle, Download, Pencil, Trash2, Filter, Eye, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { GlassCard } from "@/components/shared/glass-card";
import { downloadCSV, cn } from "@/lib/utils";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
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

export default function RegistrationsPage() {
 const [registrations, setRegistrations] = useState<Registration[]>([]);
 const [events, setEvents] = useState<Event[]>([]);
 const [products, setProducts] = useState<Product[]>([]);

 useEffect(() => {
 loadData();
 }, []);

 async function loadData() {
 setLoading(true);
 try {
 const [regPage, eventData, courseData, productData] = await Promise.all([
 CMSService.getRegistrationsPage(50),
 CMSService.getEvents(),
 CMSService.getCourses(),
 CMSService.getProducts()
 ]);
 setRegistrations(regPage.registrations);
 setCursor(regPage.nextCursor);
 setHasMore(regPage.hasMore);
 setEvents(eventData);
 setCourses(courseData);
 setProducts(productData);
 } catch (error) {
 console.error("Failed to load data", error);
 } finally {
 setLoading(false);
 }
 }

 const loadMore = async () => {
 if (!cursor || loadingMore) return;
 setLoadingMore(true);
 try {
 const regPage = await CMSService.getRegistrationsPage(50, cursor);
 setRegistrations(prev => [...prev, ...regPage.registrations]);
 setCursor(regPage.nextCursor);
 setHasMore(regPage.hasMore);
 } catch (error) {
 console.error("Failed to load more registrations", error);
 toast.error("Failed to load more registrations");
 } finally {
 setLoadingMore(false);
 }
 };

 const [courses, setCourses] = useState<Course[]>([]);
 const [loading, setLoading] = useState(true);
 const [searchTerm, setSearchTerm] = useState("");
 const [selectedEntity, setSelectedEntity] = useState("all");
 const [selectedStatus, setSelectedStatus] = useState("all");
 const [processingId, setProcessingId] = useState<string | null>(null);
 const [editingRegistration, setEditingRegistration] = useState<Registration | null>(null);
 const [viewingProof, setViewingProof] = useState<string | null>(null);
 const [zoom, setZoom] = useState(1);
 const [deletingRegistrationId, setDeletingRegistrationId] = useState<string | null>(null);
 const [selectedIds, setSelectedIds] = useState<string[]>([]);
 const [isBulkProcessing, setIsBulkProcessing] = useState(false);
 const [confirmBulkReject, setConfirmBulkReject] = useState(false);
 const [cursor, setCursor] = useState<any>(null);
 const [hasMore, setHasMore] = useState(false);
 const [loadingMore, setLoadingMore] = useState(false);

 useEffect(() => {
 if (!viewingProof) setZoom(1);
 }, [viewingProof]);

 const handleUpdateRegistration = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!editingRegistration || !editingRegistration.id) return;

 setProcessingId(editingRegistration.id);
 try {
 await CMSService.updateRegistration(editingRegistration.id, {
 name: editingRegistration.name,
 email: editingRegistration.email,
 phone: editingRegistration.phone,
 trxId: editingRegistration.trxId,
 });
 setRegistrations(prev => prev.map(r => r.id === editingRegistration.id ? editingRegistration : r));
 setEditingRegistration(null);
 toast.success("Registration updated");
 } catch (error) {
 console.error(error);
 toast.error("Failed to update registration");
 } finally {
 setProcessingId(null);
 }
 };

 const handleApprove = async (id: string | undefined) => {
 if (!id) return;
 setProcessingId(id);
 try {
 const result = await CMSService.approveRegistration(id);
 if (result.success) {
 setRegistrations(prev => prev.map(r => r.id === id ? { ...r, status: "approved" } : r));
 toast.success("Approved successfully");
 } else {
 toast.error("Failed to approve", { description: String(result.error) });
 }
 } catch (error) {
 console.error(error);
 toast.error("Error approving registration.");
 } finally {
 setProcessingId(null);
 }
 };

 const handleReject = (id: string | undefined) => {
 if (!id) return;
 setDeletingRegistrationId(id);
 };

 const confirmReject = async () => {
 if (!deletingRegistrationId) return;

 setProcessingId(deletingRegistrationId);
 try {
 await CMSService.rejectRegistration(deletingRegistrationId);
 setRegistrations(prev => prev.filter(r => r.id !== deletingRegistrationId));
 toast.success("Registration rejected successfully.");
 } catch (error) {
 console.error(error);
 toast.error("Error rejecting registration.");
 } finally {
 setProcessingId(null);
 setDeletingRegistrationId(null);
 }
 };

 const toggleSelection = (id: string) => {
 setSelectedIds(prev =>
 prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
 );
 };

 const toggleAll = () => {
 // We will define filteredRegistrations later in the component body, but for this handler we need it.
 // Actually, since this is inside the component, we can assume filteredRegistrations is available if we move this definition down or hoist filteredRegistrations.
 // However, standard React component structure usually puts state -> effects -> handlers -> render.
 // filteredRegistrations depends on state. So it should be defined before handlers if handlers use it? No, handlers capture it from closure.
 // But toggleAll usually needs to access the *current* filtered list. 
 // Let's defer toggleAll logic or just use 'registrations' for now if we want to be safe, but typically bulk select is for visible items.
 // To avoid reference errors, I will define `filteredRegistrations` calculation *before* this handler or just inside the handler if possible? 
 // No, `filteredRegistrations` is a derived value used in render.
 // I will implement a safe version here that might need `filteredRegistrations` to be defined. 
 // Since I am replacing a block, I should ensure `filteredRegistrations` is defined or available.
 // Wait, `filteredRegistrations` is defined *after* these handlers in the original file.
 // This means `toggleAll` will close over `filteredRegistrations` which is a const defined *later*? That works in function scope if it's a function declaration, but these are consts/arrows.
 // Actually `filteredRegistrations` is derived *during render*. Handlers are created *during render*. So they can access it.
 // But `filteredRegistrations` is defined at line 66 in the *current* file.
 // So I can use it here.
 if (selectedIds.length === filteredRegistrations.length) {
 setSelectedIds([]);
 } else {
 setSelectedIds(filteredRegistrations.map(r => r.id).filter(Boolean) as string[]);
 }
 };

 const handleBulkApprove = async () => {
 if (selectedIds.length === 0) return;
 setIsBulkProcessing(true);
 try {
 await CMSService.bulkApproveRegistrations(selectedIds);
 setRegistrations(prev => prev.map(r => selectedIds.includes(r.id!) ? { ...r, status: "approved" } : r));
 toast.success(`Approved ${selectedIds.length} registrations`);
 setSelectedIds([]);
 } catch (error) {
 console.error(error);
 toast.error("Bulk approve failed");
 } finally {
 setIsBulkProcessing(false);
 }
 };

 const handleBulkReject = async () => {
 if (selectedIds.length === 0) return;

 setIsBulkProcessing(true);
 try {
 await CMSService.bulkRejectRegistrations(selectedIds);
 setRegistrations(prev => prev.filter(r => !selectedIds.includes(r.id!)));
 toast.success(`Rejected ${selectedIds.length} registrations`);
 setSelectedIds([]);
 setConfirmBulkReject(false);
 } catch (error) {
 console.error(error);
 toast.error("Bulk reject failed");
 } finally {
 setIsBulkProcessing(false);
 }
 };

 const getEntityName = (reg: Registration) => {
 if (reg.eventId) return events.find(e => e.id === reg.eventId)?.title || "Unknown Event";
 if (reg.courseId) return courses.find(c => c.id === reg.courseId)?.title || "Unknown Course";
 if (reg.productId) return products.find(p => p.id === reg.productId)?.title || "Unknown Product";
 return "Unknown";
 };

 const filteredRegistrations = registrations.filter(r => {
 const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
 r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
 r.trxId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
 r.phone?.includes(searchTerm);

 const matchesEntity = selectedEntity === "all" || r.eventId === selectedEntity || r.courseId === selectedEntity || r.productId === selectedEntity;
 const matchesStatus = selectedStatus === "all" || r.status === selectedStatus;

 return matchesSearch && matchesEntity && matchesStatus;
 });

 const handleExport = () => {
 if (filteredRegistrations.length === 0) {
 toast.info("No data to export");
 return;
 }

 const headers = ["Registration ID", "Type", "Title", "Name", "Email", "Phone", "TrxID", "Status", "Date"];
 const rows = filteredRegistrations.map(r => {
 let entityType = "Unknown";
 if (r.eventId) entityType = "Event";
 else if (r.courseId) entityType = "Course";
 else if (r.productId) entityType = "Product";

 const title = getEntityName(r);
 return [
 r.id,
 entityType,
 title,
 r.name,
 r.email,
 r.phone,
 r.trxId,
 r.status,
 r.registeredAt ? new Date(r.registeredAt.seconds * 1000).toISOString() : ""
 ];
 });

 downloadCSV(`registrations_export_${new Date().toISOString().split('T')[0]}.csv`, headers, rows);
 };

 if (loading) {
 // ... existing loader
 return (
 <div className="space-y-6">
 <div className="flex justify-between">
 <Skeleton className="h-10 w-48 bg-white" />
 <Skeleton className="h-10 w-32 bg-white" />
 </div>
 <div className="grid grid-cols-4 gap-4">
 <Skeleton className="h-10 w-full bg-white" />
 <Skeleton className="h-10 w-full bg-white" />
 <Skeleton className="h-10 w-full bg-white" />
 <Skeleton className="h-10 w-full bg-white" />
 </div>
 <div className="rounded-md border border-gray-200 bg-white overflow-hidden">
 {[1, 2, 3, 4, 5].map(i => (
 <div key={i} className="flex items-center p-4 border-b border-gray-200 gap-4">
 <Skeleton className="h-10 w-10 rounded-full bg-white" />
 <div className="space-y-2 flex-1">
 <Skeleton className="h-4 w-1/3 bg-white" />
 <Skeleton className="h-3 w-1/4 bg-white" />
 </div>
 <Skeleton className="h-8 w-20 bg-white" />
 <Skeleton className="h-8 w-20 bg-white" />
 </div>
 ))}
 </div>
 </div>
 );
 }

 return (
 <div className="space-y-6">
 {/* ... Existing UI ... */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div>
 <h2 className="text-3xl font-bold tracking-tight text-white">Registrations</h2>
 <p className="text-muted-foreground">Manage enrollments for events, courses, and product sales.</p>
 </div>
 {/* ... Buttons ... */}
 <div className="flex items-center gap-2">
 {selectedIds.length > 0 && (
 <>
 <Button
 variant="outline"
 className="border-green-500/20 text-green-400 hover:bg-green-500/10"
 onClick={handleBulkApprove}
 disabled={isBulkProcessing}
 >
 {isBulkProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
 Approve ({selectedIds.length})
 </Button>
 <Button
 variant="destructive"
 onClick={() => setConfirmBulkReject(true)}
 disabled={isBulkProcessing}
 >
 {isBulkProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
 Reject ({selectedIds.length})
 </Button>
 </>
 )}
 <Button onClick={handleExport} variant="outline" className="border-gray-200 text-white hover:bg-white">
 <Download className="mr-2 h-4 w-4" /> Export CSV
 </Button>
 </div>
 </div>

 {/* Filters */}
 <div className="flex flex-col md:flex-row gap-6">
 <div className="flex-1 bg-white p-1 rounded-lg border border-gray-200 flex">
 {["all", "pending", "approved"].map((status) => (
 <button
 key={status}
 onClick={() => setSelectedStatus(status)}
 className={`flex-1 text-sm font-medium py-2.5 rounded-md transition-all capitalize ${selectedStatus === status
 ? 'bg-primary/20 text-primary shadow-sm border border-primary/20'
 : 'text-gray-400 hover:text-white hover:bg-white'
 }`}
 >
 {status}
 </button>
 ))}
 </div>

 <div className="flex gap-4 flex-1">
 <div className="relative flex-1">
 <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
 <Input
 placeholder="Search TrxID, Name..."
 className="pl-9 bg-white border-gray-200 text-white"
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 />
 </div>
 </div>
 </div>

 <div className="flex items-center justify-between text-sm text-gray-400 px-1">
 <span>Showing {filteredRegistrations.length} records</span>
 <Select value={selectedEntity} onValueChange={setSelectedEntity}>
 <SelectTrigger className="w-[200px] bg-white border-gray-200 text-white h-8 text-xs">
 <SelectValue placeholder="Filter by Item" />
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="all">All Items</SelectItem>
 {events.length > 0 && (
 <>
 <SelectItem value="disabled-events" disabled className="font-bold opacity-100 mt-2">Events:</SelectItem>
 {events.map(e => (
 <SelectItem key={e.id} value={e.id || "unknown"}>{e.title}</SelectItem>
 ))}
 </>
 )}
 {courses.length > 0 && (
 <>
 <SelectItem value="disabled-courses" disabled className="font-bold opacity-100 mt-2">Courses:</SelectItem>
 {courses.map(c => (
 <SelectItem key={c.id} value={c.id || "unknown"}>{c.title}</SelectItem>
 ))}
 </>
 )}
 {products.length > 0 && (
 <>
 <SelectItem value="disabled-products" disabled className="font-bold opacity-100 mt-2">Products:</SelectItem>
 {products.map(p => (
 <SelectItem key={p.id} value={p.id || "unknown"}>{p.title}</SelectItem>
 ))}
 </>
 )}
 </SelectContent>
 </Select>
 </div>

 <GlassCard className="overflow-hidden">
 <Table>
 <TableHeader className="bg-white">
 <TableRow className="border-gray-200 hover:bg-white">
 <TableHead className="w-[50px]">
 <input
 type="checkbox"
 aria-label="Select all registrations"
 checked={selectedIds.length === filteredRegistrations.length && filteredRegistrations.length > 0}
 onChange={toggleAll}
 className="rounded border-gray-500 bg-gray-50 text-primary focus:ring-primary cursor-pointer accent-primary"
 />
 </TableHead>
 <TableHead className="text-gray-300">User</TableHead>
 <TableHead className="text-gray-300">Event / Course / Product</TableHead>
 <TableHead className="text-gray-300">Verification Info</TableHead>
 <TableHead className="text-gray-300">Status</TableHead>
 <TableHead className="text-right text-gray-300">Actions</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 {filteredRegistrations.length === 0 ? (
 <TableRow>
 <TableCell colSpan={6} className="text-center h-24 text-gray-400">
 No registrations found.
 </TableCell>
 </TableRow>
 ) : (
 filteredRegistrations.map((reg) => {
 const title = getEntityName(reg);
 const isCourse = !!reg.courseId;
 const isEvent = !!reg.eventId;
 const isProduct = !!reg.productId;

 return (
 <TableRow key={reg.id} className="border-gray-200 hover:bg-white">
 <TableCell>
 <input
 type="checkbox"
 aria-label={`Select registration for ${reg.name}`}
 checked={selectedIds.includes(reg.id!)}
 onChange={() => toggleSelection(reg.id!)}
 className="rounded border-gray-500 bg-gray-50 text-primary focus:ring-primary cursor-pointer accent-primary"
 />
 </TableCell>
 <TableCell className="font-medium text-white">
 <div>{reg.name}</div>
 <div className="text-xs text-gray-500">{reg.email}</div>
 </TableCell>
 <TableCell className="text-white/80 font-medium">
 <div className="flex items-center gap-2">
 {isCourse && <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest border-gray-200 bg-white text-white/70">Course</Badge>}
 {isEvent && <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest border-gray-200 bg-white text-white/70">Event</Badge>}
 {isProduct && <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest border-gray-200 bg-white text-white/70">Product</Badge>}
 {reg.bookId && <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest border-gray-200 bg-white text-white/70">Book</Badge>}

 <span className="truncate max-w-[150px] text-sm font-bold tracking-tight" title={title}>{title}</span>
 </div>
 <div className="text-[10px] text-gray-800 font-mono mt-1">{reg.id}</div>
 </TableCell>
 <TableCell>
 <div className="flex items-start gap-4">
 {/* Text Details */}
 <div className="flex flex-col gap-1.5 min-w-[120px]">
 {reg.trxId ? (
 <Badge variant="outline" className="font-mono border-gray-200 text-white bg-white w-fit text-[10px] tracking-tighter">
 {reg.trxId}
 </Badge>
 ) : (
 <Badge variant="outline" className="border-gray-200 text-gray-500 bg-white/[0.02] w-fit text-[9px] font-bold uppercase tracking-widest">
 FREE
 </Badge>
 )}
 {reg.paymentMethod && <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{reg.paymentMethod}</span>}
 {reg.phone && <span className="text-[10px] font-mono text-gray-800">{reg.phone}</span>}
 </div>

 {/* Image Preview */}
 {reg.screenshotUrl && (
 <div className="flex flex-col gap-2">
 <div
 className="relative group cursor-pointer h-16 w-24 shrink-0 rounded-xl overflow-hidden border border-gray-200 bg-gray-50"
 onClick={() => setViewingProof(reg.screenshotUrl || null)}
 >
 <img src={reg.screenshotUrl} alt="Proof" className="w-full h-full object-cover opacity-50 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105" />
 <div className="absolute inset-0 bg-gray-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
 <Eye strokeWidth={1.5} className="h-5 w-5 text-white drop-shadow-md" />
 </div>
 </div>
 <Button
 variant="outline"
 size="sm"
 className="h-7 text-[9px] font-bold uppercase tracking-widest w-24 border-gray-200 hover:bg-white rounded-lg"
 onClick={() => setViewingProof(reg.screenshotUrl || null)}
 >
 <Eye strokeWidth={1.5} className="mr-1 h-3 w-3" /> Proof
 </Button>
 </div>
 )}
 </div>
 </TableCell>
 <TableCell>
 <Badge className={cn(
 "text-[9px] font-bold uppercase tracking-widest px-2.5 h-6 border-none",
 reg.status === 'approved' ? 'bg-white text-black' : 'bg-white text-white/70 animate-pulse'
 )}>
 {reg.status}
 </Badge>
 </TableCell>
 <TableCell className="text-right">
 <div className="flex justify-end gap-2">
 <Button
 size="icon"
 variant="ghost"
 className="h-8 w-8 text-gray-500 hover:text-white hover:bg-white rounded-lg"
 onClick={() => setEditingRegistration(reg)}
 >
 <Pencil strokeWidth={1.5} className="h-4 w-4" />
 </Button>

 {reg.status === 'pending' && (
 <>
 <Button
 size="icon"
 variant="ghost"
 className="h-8 w-8 text-white hover:bg-white hover:text-black rounded-lg transition-all"
 onClick={() => handleApprove(reg.id)}
 disabled={processingId === reg.id}
 >
 {processingId === reg.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle strokeWidth={1.5} className="h-4 w-4" />}
 </Button>
 <Button
 size="icon"
 variant="ghost"
 className="h-8 w-8 text-gray-800 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
 onClick={() => handleReject(reg.id)}
 disabled={processingId === reg.id}
 >
 <XCircle strokeWidth={1.5} className="h-4 w-4" />
 </Button>
 </>
 )}
 {reg.status === 'approved' && (
 <Button
 size="icon"
 variant="ghost"
 className="h-8 w-8 text-gray-800 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
 onClick={() => handleReject(reg.id)}
 disabled={processingId === reg.id}
 title="Revoke & Delete"
 >
 <Trash2 strokeWidth={1.5} className="h-4 w-4" />
 </Button>
 )}
 </div>
 </TableCell>
 </TableRow>
 );
 })
 )}
 </TableBody>
 </Table>
 </GlassCard>

 {hasMore && (
 <div className="flex justify-center">
 <Button
 onClick={loadMore}
 variant="outline"
 disabled={loadingMore}
 className="border-gray-200 text-white hover:bg-white"
 >
 {loadingMore ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
 Load More
 </Button>
 </div>
 )}

 <Dialog open={!!editingRegistration} onOpenChange={(open) => !open && setEditingRegistration(null)}>
 <DialogContent>
 <DialogHeader>
 <DialogTitle>Edit Registration</DialogTitle>
 </DialogHeader>
 {editingRegistration && (
 <form onSubmit={handleUpdateRegistration} className="space-y-4 mt-4">
 <div className="space-y-2">
 <label className="text-sm font-medium">Name</label>
 <Input
 value={editingRegistration.name}
 onChange={e => setEditingRegistration({ ...editingRegistration, name: e.target.value })}
 required
 />
 </div>
 <div className="space-y-2">
 <label className="text-sm font-medium">Email</label>
 <Input
 type="email"
 value={editingRegistration.email}
 onChange={e => setEditingRegistration({ ...editingRegistration, email: e.target.value })}
 required
 />
 </div>
 <div className="space-y-2">
 <label className="text-sm font-medium">Phone</label>
 <Input
 value={editingRegistration.phone || ''}
 onChange={e => setEditingRegistration({ ...editingRegistration, phone: e.target.value })}
 />
 </div>
 <div className="space-y-2">
 <label className="text-sm font-medium">TrxID</label>
 <Input
 value={editingRegistration.trxId || ''}
 onChange={e => setEditingRegistration({ ...editingRegistration, trxId: e.target.value })}
 />
 </div>

 <div className="flex justify-end gap-2 pt-4">
 <Button type="button" variant="ghost" onClick={() => setEditingRegistration(null)}>Cancel</Button>
 <Button type="submit" disabled={!!processingId}>
 {processingId ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
 Save Changes
 </Button>
 </div>
 </form>
 )}
 </DialogContent>
 </Dialog>

 <Dialog open={!!viewingProof} onOpenChange={(open) => !open && setViewingProof(null)}>
 <DialogContent className="max-w-5xl w-full bg-zinc-950 border-gray-200 p-0 overflow-hidden flex flex-col h-[90vh]">
 {/* Toolbar */}
 <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-zinc-900/50">
 <div className="flex items-center gap-2">
 <h3 className="font-medium text-white">Payment Proof</h3>
 <span className="text-xs text-white/40 px-2 py-0.5 bg-white rounded-full">
 {Math.round(zoom * 100)}%
 </span>
 </div>
 <div className="flex items-center gap-2">
 <Button
 variant="outline" size="icon"
 className="h-8 w-8 bg-zinc-900 border-gray-200 hover:bg-white"
 onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
 >
 <ZoomOut className="h-4 w-4" />
 </Button>
 <Button
 variant="outline" size="icon"
 className="h-8 w-8 bg-zinc-900 border-gray-200 hover:bg-white"
 onClick={() => setZoom(1)}
 >
 <RotateCcw className="h-4 w-4" />
 </Button>
 <Button
 variant="outline" size="icon"
 className="h-8 w-8 bg-zinc-900 border-gray-200 hover:bg-white"
 onClick={() => setZoom(Math.min(3, zoom + 0.25))}
 >
 <ZoomIn className="h-4 w-4" />
 </Button>
 <div className="w-px h-4 bg-white mx-2" />
 {viewingProof && (
 <Button
 variant="default" size="sm"
 className="h-8 gap-2"
 asChild
 >
 <a href={viewingProof} target="_blank" download="proof.jpg" rel="noopener noreferrer">
 <Download className="h-4 w-4" /> Download
 </a>
 </Button>
 )}
 </div>
 </div>

 {/* Viewer */}
 <div className="flex-1 bg-gray-50 overflow-auto flex items-center justify-center p-8 relative">
 {/* Checkerboard pattern for transparency */}
 <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(45deg,#222_25%,transparent_25%,transparent_75%,#222_75%,#222),linear-gradient(45deg,#222_25%,transparent_25%,transparent_75%,#222_75%,#222)] bg-[length:20px_20px] bg-[position:0_0,10px_10px]"></div>

 {viewingProof && (
 <div
 style={{ transform: `scale(${zoom})`, transition: 'transform 0.2s ease-out' }}
 className="relative z-10 shadow-2xl"
 >
 <img
 src={viewingProof}
 alt="Payment Proof"
 className="max-w-full max-h-[70vh] object-contain rounded-md border border-gray-200"
 />
 </div>
 )}
 </div>
 </DialogContent>
 </Dialog>

 <AlertDialog open={!!deletingRegistrationId} onOpenChange={(open) => !open && setDeletingRegistrationId(null)}>
 <AlertDialogContent>
 <AlertDialogHeader>
 <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
 <AlertDialogDescription>
 This action cannot be undone. This will permanently delete the registration request.
 </AlertDialogDescription>
 </AlertDialogHeader>
 <AlertDialogFooter>
 <AlertDialogCancel>Cancel</AlertDialogCancel>
 <AlertDialogAction onClick={confirmReject} className="bg-red-600 hover:bg-red-700">
 {processingId === deletingRegistrationId ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
 Reject & Delete
 </AlertDialogAction>
 </AlertDialogFooter>
 </AlertDialogContent>
 </AlertDialog>

 <AlertDialog open={confirmBulkReject} onOpenChange={setConfirmBulkReject}>
 <AlertDialogContent>
 <AlertDialogHeader>
 <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
 <AlertDialogDescription>
 This will permanently reject and delete {selectedIds.length} registration{selectedIds.length === 1 ? "" : "s"}. This action cannot be undone.
 </AlertDialogDescription>
 </AlertDialogHeader>
 <AlertDialogFooter>
 <AlertDialogCancel>Cancel</AlertDialogCancel>
 <AlertDialogAction
 onClick={handleBulkReject}
 className="bg-red-600 hover:bg-red-700 text-white"
 >
 {isBulkProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
 Reject {selectedIds.length} Registration{selectedIds.length === 1 ? "" : "s"}
 </AlertDialogAction>
 </AlertDialogFooter>
 </AlertDialogContent>
 </AlertDialog>
 </div>
 );
}
