"use client";

import { useEffect, useState } from "react";
import { CMSService, Course } from "@/lib/cms-service";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, PlayCircle } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import Link from "next/link";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/format";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, openAuthModal } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await CMSService.getPublishedCourses();
        setCourses(data);
      } catch (error) {
        console.error("Failed to load courses", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-24 font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="mb-16 border-b border-border pb-10">
          <div className="text-[10px] font-mono font-bold tracking-widest text-muted-foreground/80 uppercase mb-4">
            / index / courses
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-4">
            Premium <span className="text-foreground italic font-serif opacity-80">Learning</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl font-medium leading-relaxed">
            Master advanced topics with our in-depth, project-based video courses designed for the modern engineer.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-full rounded-[1.5rem] border border-border overflow-hidden bg-gray-50 shadow-sm">
                <Skeleton className="aspect-video w-full bg-gray-200" />
                <div className="p-6 space-y-4">
                  <Skeleton className="h-6 w-3/4 bg-gray-200" />
                  <Skeleton className="h-4 w-full bg-gray-200" />
                  <Skeleton className="h-4 w-5/6 bg-gray-200" />
                  <div className="pt-4 flex justify-between">
                    <Skeleton className="h-4 w-20 bg-gray-200" />
                    <Skeleton className="h-4 w-20 bg-gray-200" />
                  </div>
                  <Skeleton className="h-12 w-full rounded-xl bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/courses/view?id=${course.id}`} className="block h-full cursor-pointer group">
                  <div className="h-full flex flex-col overflow-hidden bg-background border border-border rounded-[1.5rem] hover:shadow-xl transition-all duration-300">
                    <div className="relative aspect-video bg-gray-50 overflow-hidden border-b border-gray-100">
                      {course.headerImage ? (
                        <img
                          src={course.headerImage}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-300">
                          <BookOpen className="h-12 w-12" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 via-transparent to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1.5 bg-background text-[9px] font-bold text-foreground rounded-lg border border-border uppercase tracking-widest shadow-sm">
                          Mastery
                        </span>
                      </div>
                    </div>

                    <div className="p-8 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-foreground tracking-tight line-clamp-2 leading-snug">
                          {course.title}
                        </h3>
                      </div>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-8 leading-relaxed">
                        {course.description}
                      </p>

                      <div className="mt-auto">
                        <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground mb-6 pt-5 border-t border-gray-100 uppercase tracking-widest">
                          <div className="flex items-center gap-2">
                            <PlayCircle className="h-4 w-4 text-muted-foreground/80" />
                            <span>{course.lessons?.length || 0} Lessons</span>
                          </div>
                          <div className="text-foreground text-sm">
                            {formatCurrency(course.price)}
                          </div>
                        </div>

                        <Button
                          variant="secondary"
                          className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground transition-all shadow-sm rounded-xl text-[10px] font-bold uppercase tracking-widest"
                        >
                          Access Course
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border border-dashed border-border rounded-[2rem] bg-gray-50/50">
            <BookOpen className="h-10 w-10 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Courses Available</h3>
            <p className="text-muted-foreground text-sm">We are currently preparing new content. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
