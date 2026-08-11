"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import { CMSService, Tool } from "@/lib/cms-service";
import { Button } from "@/components/ui/button";
import { ToolForm } from "@/components/admin/tool-form";
import { Loader2 } from "lucide-react";
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

export default function ToolsPage() {
 const [tools, setTools] = useState<Tool[]>([]);
 const [loading, setLoading] = useState(true);
 const [isFormOpen, setIsFormOpen] = useState(false);
 const [deletingId, setDeletingId] = useState<string | null>(null);
 const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);

 const [editingTool, setEditingTool] = useState<Tool | null>(null);

 const [selectedIds, setSelectedIds] = useState<string[]>([]);

 useEffect(() => {
 loadTools();
 }, []);

 const loadTools = async () => {
 setLoading(true);
 try {
 const data = await CMSService.getTools();
 setTools(data);
 } catch (error) {
 console.error("Failed to load tools", error);
 } finally {
 setLoading(false);
 }
 };

 const handleCreate = () => {
 setEditingTool(null);
 setIsFormOpen(true);
 };

 const handleEdit = (tool: Tool) => {
 setEditingTool(tool);
 setIsFormOpen(true);
 };

 const handleSubmit = async (data: Tool) => {
 if (editingTool && editingTool.id) {
 await CMSService.updateTool(editingTool.id, data);
 } else {
 await CMSService.addTool(data);
 }
 await loadTools();
 };

 const handleDelete = async (id: string) => {
 // Confirmation handled by AlertDialog
 try {
 await CMSService.deleteTool(id);
 setTools(prev => prev.filter(t => t.id !== id));
 setDeletingId(null);
 setSelectedIds(prev => prev.filter(selId => selId !== id)); // Remove from selection
 } catch (error) {
 console.error(error);
 }
 };

 const toggleSelection = (id: string) => {
 setSelectedIds(prev =>
 prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
 );
 };

 const toggleAll = () => {
 if (selectedIds.length === tools.length) {
 setSelectedIds([]);
 } else {
 setSelectedIds(tools.map(t => t.id).filter(Boolean) as string[]);
 }
 };

 const handleBulkDelete = async () => {
 try {
 await CMSService.bulkDeleteTools(selectedIds);
 setTools(prev => prev.filter(t => !selectedIds.includes(t.id!)));
 setSelectedIds([]);
 setConfirmBulkDelete(false);
 } catch (error) {
 console.error("Bulk delete failed", error);
 }
 };

 return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">AI Tools</h2>
          <p className="text-muted-foreground font-medium">Manage your curated list of AI resources.</p>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <Button variant="destructive" onClick={() => setConfirmBulkDelete(true)}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete ({selectedIds.length})
            </Button>
          )}
          <Button onClick={toggleAll} variant="outline" className="border-border text-foreground hover:bg-gray-50">
            {selectedIds.length === tools.length ? "Deselect All" : "Select All"}
          </Button>
          <Button onClick={handleCreate} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" /> Add Tool
          </Button>
        </div>
      </div>

 {loading ? (
 <div className="flex justify-center p-12">
 <Loader2 className="animate-spin text-primary h-8 w-8" />
 </div>
 ) : (
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
 {tools.map((tool) => (
              <div
                key={tool.id}
                className={`group relative flex flex-col rounded-lg border p-4 transition-all hover:bg-gray-50 shadow-sm ${selectedIds.includes(tool.id!)
                  ? "border-primary bg-gray-50"
                  : "border-border bg-background hover:border-gray-300"
                  }`}
              >
                <div className="absolute top-3 right-3 z-10">
                  <input
                    type="checkbox"
                    aria-label={`Select tool ${tool.name}`}
                    checked={selectedIds.includes(tool.id!)}
                    onChange={() => toggleSelection(tool.id!)}
                    className="w-4 h-4 rounded border-gray-300 text-foreground focus:ring-black cursor-pointer accent-black"
                  />
                </div>

                <div className="flex items-start justify-between mb-3 pr-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gray-100 overflow-hidden border border-border flex items-center justify-center">
                      {tool.imageUrl ? (
                        <img src={tool.imageUrl} alt={tool.name} className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-xs font-bold text-muted-foreground">{tool.name.substring(0, 2)}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-sm">{tool.name}</h3>
                      <span className="text-[10px] uppercase tracking-widest font-bold text-foreground bg-gray-100 border border-border px-1.5 py-0.5 rounded-sm">
                        {tool.category}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs font-medium text-muted-foreground line-clamp-2 mb-3 flex-1">
                  {tool.description}
                </p>

                <div className="mt-auto flex gap-2">
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 rounded bg-gray-50 border border-border py-2 text-[10px] font-bold uppercase tracking-widest text-gray-600 hover:bg-gray-100 hover:text-foreground transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" /> Visit
                  </a>
                  <button onClick={() => handleEdit(tool)} className="p-2 hover:bg-gray-100 rounded text-muted-foreground hover:text-foreground border border-border">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => tool.id && setDeletingId(tool.id)} className="p-2 hover:bg-red-50 rounded text-muted-foreground hover:text-red-600 border border-border">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
 ))}


          {tools.length === 0 && (
            <div className="col-span-full py-16 text-center border border-dashed border-gray-300 rounded-xl bg-gray-50">
              <p className="text-muted-foreground font-medium mb-4">No tools added yet.</p>
              <Button variant="outline" className="border-border text-foreground hover:bg-gray-100" onClick={handleCreate}>Create First Tool</Button>
            </div>
          )}
 </div>
 )}

 <ToolForm
 open={isFormOpen}
 onOpenChange={setIsFormOpen}
 onSubmit={handleSubmit}
 initialData={editingTool}
 />

 <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
 <AlertDialogContent>
 <AlertDialogHeader>
 <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
 <AlertDialogDescription>
 This action cannot be undone. This will permanently delete the tool from your list.
 </AlertDialogDescription>
 </AlertDialogHeader>
 <AlertDialogFooter>
 <AlertDialogCancel>Cancel</AlertDialogCancel>
 <AlertDialogAction
 onClick={() => deletingId && handleDelete(deletingId)}
 className="bg-red-600 hover:bg-red-700 text-primary-foreground"
 >
 Delete Tool
 </AlertDialogAction>
 </AlertDialogFooter>
 </AlertDialogContent>
 </AlertDialog>

 <AlertDialog open={confirmBulkDelete} onOpenChange={setConfirmBulkDelete}>
 <AlertDialogContent>
 <AlertDialogHeader>
 <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
 <AlertDialogDescription>
 This will permanently delete {selectedIds.length} tool{selectedIds.length === 1 ? "" : "s"} from your list. This action cannot be undone.
 </AlertDialogDescription>
 </AlertDialogHeader>
 <AlertDialogFooter>
 <AlertDialogCancel>Cancel</AlertDialogCancel>
 <AlertDialogAction
 onClick={handleBulkDelete}
 className="bg-red-600 hover:bg-red-700 text-primary-foreground"
 >
 Delete {selectedIds.length} Tool{selectedIds.length === 1 ? "" : "s"}
 </AlertDialogAction>
 </AlertDialogFooter>
 </AlertDialogContent>
 </AlertDialog>
 </div>
 );
}
