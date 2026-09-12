import { Suspense } from "react";
import { CMSService } from "@/lib/cms-service";
import { CourseViewer } from "@/components/courses/course-viewer";
import { Metadata } from "next";

/**
 * Prerendered course pages at the canonical `/courses/{id}` URL.
 *
 * Previously the only real route was `/courses/view?id=...`, with a Firebase
 * Hosting rewrite mapping `/courses/**` onto it. That worked for humans but
 * meant crawlers got an empty client-rendered shell, and the site advertised
 * two different URLs for the same course: sitemap.ts emitted `/courses/{id}`
 * while the JSON-LD offer pointed at `/courses/view?id={id}`, with no canonical
 * tag to break the tie.
 *
 * Courses published after the last build still fall through to the rewrite,
 * exactly like blog posts do - this just means the ones that existed at build
 * time get real HTML.
 */

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  try {
    const courses = await CMSService.getPublishedCourses(100);
    if (courses.length > 0) {
      return courses.map((course) => ({ id: course.id! }));
    }
  } catch (error) {
    console.error("[courses/[id]] generateStaticParams failed:", error);
  }
  // Keeps the build green when there are no published courses yet.
  return [{ id: "placeholder" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const course = await CMSService.getCourse(id).catch(() => null);

  if (!course) {
    return { title: "Course Not Found" };
  }

  return {
    title: course.title,
    description: course.description,
    alternates: { canonical: `/courses/${id}` },
    openGraph: {
      title: course.title,
      description: course.description,
      url: `/courses/${id}`,
      images: course.headerImage ? [course.headerImage] : [],
    },
  };
}

export default async function CoursePage({ params }: Props) {
  const { id } = await params;

  // CourseViewer reads useSearchParams (for the ?lessonId deep link), which
  // needs a Suspense boundary to prerender.
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 text-center text-muted-foreground">Loading course...</div>}>
      <CourseViewer initialId={id} />
    </Suspense>
  );
}
