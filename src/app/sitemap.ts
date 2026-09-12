import { MetadataRoute } from 'next';
import { CMSService } from '@/lib/cms-service';

export const dynamic = 'force-static';



export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
 const baseUrl = 'https://zihadhasan.web.app'; // Updated to current Firebase domain

 // Static Routes
 const routes = [
 '',
 '/projects',
 '/tools',
 '/blog',
 '/events',
 '/contact',
 '/books',
 '/courses',
 '/services',
 '/shop',
 ].map((route) => ({
 url: `${baseUrl}${route}`,
 lastModified: new Date(),
 changeFrequency: 'daily' as const,
 priority: route === '' ? 1 : 0.8,
 }));

 // Dynamic Blog Posts
 const { data: posts } = await CMSService.getPosts(true);
 const blogRoutes = posts.map((post) => ({
 url: `${baseUrl}/blog/${post.slug}`,
 lastModified: post.publishedAt ? new Date(post.publishedAt.seconds * 1000) : new Date(),
 changeFrequency: 'weekly' as const,
 priority: 0.7,
 }));

 // Dynamic Courses
 const courses = await CMSService.getPublishedCourses();
 const courseRoutes = courses.map((course) => ({
 url: `${baseUrl}/courses/${course.id}`,
 lastModified: course.createdAt ? new Date(course.createdAt.seconds * 1000) : new Date(),
 changeFrequency: 'weekly' as const,
 priority: 0.8,
 }));

 // Books have real detail pages at /books/{slug}, so they belong here too.
 const books = await CMSService.getBooks(true).catch(() => []);
 const bookRoutes = books.map((book) => ({
 url: `${baseUrl}/books/${book.slug}`,
 lastModified: book.createdAt ? new Date(book.createdAt.seconds * 1000) : new Date(),
 changeFrequency: 'monthly' as const,
 priority: 0.7,
 }));

 return [...routes, ...blogRoutes, ...courseRoutes, ...bookRoutes];
}
