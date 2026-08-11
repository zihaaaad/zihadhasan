"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Course, CourseEditor } from "@/components/admin/course-editor";
import { CourseStudentsDialog } from "@/components/admin/course-students-dialog";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Edit, Trash2, BookOpen, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/format";
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

export default function CoursesPage() {
 const [courses, setCourses] = useState<Course[]>([]);
 const [loading, setLoading] = useState(true);
 const [isEditing, setIsEditing] = useState(false);
 const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
 const [deletingId, setDeletingId] = useState<string | null>(null);
 const [viewingStudentsCourse, setViewingStudentsCourse] = useState<Course | null>(null);

 useEffect(() => {
 fetchCourses();
 }, []);

 const fetchCourses = async () => {
 setLoading(true);
 try {
 // Courses might not have timestamps yet, so orderBy might fail if index missing.
 // Using simple fetch for now.
 const q = query(collection(db, "courses"));
 const snapshot = await getDocs(q);
 const data = snapshot.docs.map(doc => ({
 id: doc.id,
 ...doc.data()
 } as Course));
 setCourses(data);
 } catch (error) {
 console.error("Failed to fetch courses", error);
 } finally {
 setLoading(false);
 }
 };

 const handleEdit = (course: Course) => {
 setSelectedCourse(course);
 setIsEditing(true);
 };

 const handleCreate = () => {
 setSelectedCourse(null);
 setIsEditing(true);
 };

 const handleDelete = async (id: string) => {
 // Confirmation handled by AlertDialog
 try {
 await deleteDoc(doc(db, "courses", id));
 setCourses(courses.filter(c => c.id !== id));
 setDeletingId(null);
 } catch (error) {
 console.error("Failed to delete", error);
 }
 };

 const handleSave = () => {
 setIsEditing(false);
 fetchCourses();
 };

 if (isEditing) {
 return (
 <CourseEditor
 course={selectedCourse}
 onSave={handleSave}
 onCancel={() => setIsEditing(false)}
 />
 );
 }

 return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Course Management</h1>
          <p className="text-muted-foreground font-medium">Create and manage your educational content.</p>
        </div>
        <Button onClick={handleCreate} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" /> New Course
        </Button>
      </div>

 {loading ? (
 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
 {/* Skeleton Grid */}
 {Array(3).fill(0).map((_, i) => (
 <div key={i} className="rounded-xl border border-border bg-background overflow-hidden">
 <Skeleton className="aspect-video w-full bg-background" />
 <div className="p-5 space-y-3">
 <Skeleton className="h-6 w-3/4 bg-background" />
 <Skeleton className="h-4 w-full bg-background" />
 <Skeleton className="h-4 w-2/3 bg-background" />
 <div className="pt-4 mt-4 border-t border-border flex items-center justify-between">
 <Skeleton className="h-5 w-16 bg-background" />
 <div className="flex gap-2">
 <Skeleton className="h-8 w-8 bg-background" />
 <Skeleton className="h-8 w-8 bg-background" />
 <Skeleton className="h-8 w-8 bg-background" />
 </div>
 </div>
 </div>
 </div>
 ))}
 </div>
 ) : courses.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-xl border border-dashed border-gray-300 bg-gray-50">
          <BookOpen className="mx-auto h-12 w-12 text-foreground mb-4" />
          <h3 className="text-lg font-bold text-foreground">No courses yet</h3>
          <p className="text-muted-foreground font-medium mb-6">Get started by creating your first course.</p>
          <Button onClick={handleCreate} className="bg-primary text-primary-foreground hover:bg-primary/90">Create Course</Button>
        </div>
 ) : (
 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
 {courses.map(course => (
            <div key={course.id} className="p-0 overflow-hidden group flex flex-col h-full border border-border rounded-xl bg-background shadow-sm hover:border-gray-300 transition-colors">
              <div className="relative aspect-video bg-gray-100 overflow-hidden border-b border-border">
                {course.headerImage ? (
                  <img
                    src={course.headerImage}
                    alt={course.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-300">
                    <BookOpen className="h-10 w-10" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border ${course.published ? "bg-background text-foreground border-border" : "bg-gray-50 text-muted-foreground border-border"
                    }`}>
                    {course.published ? "Published" : "Draft"}
                  </span>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-1">{course.title}</h3>
                <p className="text-muted-foreground font-medium text-sm line-clamp-2 mb-4 flex-1">{course.description}</p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <span className="font-bold text-foreground">{formatCurrency(course.price)}</span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setViewingStudentsCourse(course)} className="h-8 w-8 p-0 text-muted-foreground hover:bg-gray-100 hover:text-foreground" title="View Students">
                      <Users className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(course)} className="h-8 w-8 p-0 text-muted-foreground hover:bg-gray-100 hover:text-foreground">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => course.id && setDeletingId(course.id)} className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
 ))}
 </div>
 )}

 <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
 <AlertDialogContent>
 <AlertDialogHeader>
 <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
 <AlertDialogDescription>
 This action cannot be undone. This will permanently delete the course and all its lessons.
 </AlertDialogDescription>
 </AlertDialogHeader>
 <AlertDialogFooter>
 <AlertDialogCancel>Cancel</AlertDialogCancel>
 <AlertDialogAction
 onClick={() => deletingId && handleDelete(deletingId)}
 className="bg-red-600 hover:bg-red-700 text-primary-foreground"
 >
 Delete Course
 </AlertDialogAction>
 </AlertDialogFooter>
 </AlertDialogContent>
 </AlertDialog>

 <CourseStudentsDialog
 open={!!viewingStudentsCourse}
 onOpenChange={(open) => !open && setViewingStudentsCourse(null)}
 courseId={viewingStudentsCourse?.id || null}
 courseTitle={viewingStudentsCourse?.title}
 />
 </div>
 );
}
