
"use client";

import { useEffect, useState } from "react";
import { Plus, Search, ShoppingBag, Download, Package, MoreVertical, Pencil, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Product, CMSService } from "@/lib/cms-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency } from "@/lib/format";
import { GlassCard } from "@/components/shared/glass-card";
import { ProductEditor } from "@/components/products/product-editor";
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

export default function ProductsPage() {
 const [products, setProducts] = useState<Product[]>([]);
 const [loading, setLoading] = useState(true);
 const [search, setSearch] = useState("");
 const [isEditing, setIsEditing] = useState(false);
 const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
 const [deletingId, setDeletingId] = useState<string | null>(null);

 useEffect(() => {
 loadProducts();
 }, []);

 const loadProducts = async () => {
 setLoading(true);
 try {
 // Note: Admin should see ALL products, even unpublished. 
 // Current getProducts() filters for !isDeleted.
 const data = await CMSService.getProducts();
 setProducts(data);
 } catch (error) {
 console.error(error);
 toast.error("Failed to load products");
 } finally {
 setLoading(false);
 }
 };

 const handleCreate = () => {
 setSelectedProduct(null);
 setIsEditing(true);
 };

 const handleEdit = (product: Product) => {
 setSelectedProduct(product);
 setIsEditing(true);
 };

 const handleDelete = async (id: string) => {
 try {
 await CMSService.deleteProduct(id);
 toast.success("Product deleted");
 setDeletingId(null);
 loadProducts();
 } catch (error) {
 console.error(error);
 toast.error("Failed to delete product");
 }
 };

 const handleSuccess = () => {
 setIsEditing(false);
 loadProducts();
 };

 const filtered = products.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

 if (isEditing) {
 return (
 <div className="space-y-6 p-8 pt-6">
 <ProductEditor
 product={selectedProduct}
 onSuccess={handleSuccess}
 onCancel={() => setIsEditing(false)}
 />
 </div>
 );
 }

 return (
    <div className="space-y-8 p-8 pt-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Products</h2>
          <p className="text-muted-foreground font-medium">Manage your digital and physical shop items.</p>
        </div>
        <Button onClick={handleCreate} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

 {/* Search & Filter */}
 <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground/80" />
          <Input
            placeholder="Search products..."
            className="pl-9 bg-background border-border text-foreground font-medium focus-visible:ring-black"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
 </div>

 {/* Products Grid */}
 <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((product) => (
          <div key={product.id} className="group relative overflow-hidden transition-all hover:border-gray-300 bg-background border border-border rounded-xl shadow-sm">
            <div className="aspect-video w-full overflow-hidden bg-gray-50 relative border-b border-gray-100">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground/80">
                  <Package className="h-8 w-8" />
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-2 right-2 flex gap-2">
                <Badge variant="outline" className={`text-[10px] font-bold uppercase tracking-widest border-border ${product.published ? "bg-background text-foreground" : "bg-gray-100 text-muted-foreground"}`}>
                  {product.published ? "Live" : "Draft"}
                </Badge>
              </div>
              <div className="absolute top-2 left-2">
                <Badge variant="outline" className="bg-background border-border text-foreground text-[10px] font-bold uppercase tracking-widest">
                  {product.type === 'digital' ? <Download className="h-3 w-3 mr-1" /> : <Package className="h-3 w-3 mr-1" />}
                  {product.type}
                </Badge>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg text-foreground line-clamp-1">{product.title}</h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-gray-100">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-background border-border text-foreground">
                    <DropdownMenuItem onClick={() => handleEdit(product)} className="cursor-pointer hover:bg-gray-50 font-medium">
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => product.id && setDeletingId(product.id)} className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 font-medium">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <p className="text-sm font-medium text-muted-foreground line-clamp-2 min-h-[40px]">
                {product.description}
              </p>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <div className="text-lg font-bold text-foreground">{formatCurrency(product.price)}</div>
                <div className="text-xs text-muted-foreground">
                  {/* Placeholder for sales stats if available */}
                </div>
              </div>
            </div>
          </div>
        ))}

 {/* Add New Card (Empty State) */}
        {filtered.length === 0 && !loading && (
          <button
            onClick={handleCreate}
            className="flex h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-gray-400 hover:bg-gray-100"
          >
            <ShoppingBag className="h-10 w-10 text-foreground mb-2" />
            <span className="text-lg font-bold text-foreground">Add First Product</span>
          </button>
        )}
 </div>

 <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
 <AlertDialogContent>
 <AlertDialogHeader>
 <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
 <AlertDialogDescription>
 This will permanently delete this product. This action cannot be undone.
 </AlertDialogDescription>
 </AlertDialogHeader>
 <AlertDialogFooter>
 <AlertDialogCancel>Cancel</AlertDialogCancel>
 <AlertDialogAction
 onClick={() => deletingId && handleDelete(deletingId)}
 className="bg-red-600 hover:bg-red-700 text-primary-foreground"
 >
 Delete Product
 </AlertDialogAction>
 </AlertDialogFooter>
 </AlertDialogContent>
 </AlertDialog>
 </div>
 );
}
