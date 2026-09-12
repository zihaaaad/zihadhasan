import { BlogPosting, WithContext, Person, Course, Event } from "schema-dts";
import { Course as CourseType, Event as EventType, BlogPost } from "./cms-service";

export function generatePersonSchema(): WithContext<Person> {
 return {
 "@context": "https://schema.org",
 "@type": "Person",
 name: "Zihad Hasan",
 alternateName: "জিহাদ হাসান",
 url: "https://zihadhasan.web.app",
 image: "https://zihadhasan.web.app/logo.png",
 jobTitle: "Generative AI & Full-Stack Developer",
 email: "zihad.connects@gmail.com",
 address: {
 "@type": "PostalAddress",
 addressLocality: "Bogura",
 addressCountry: "BD"
 },
 worksFor: {
 "@type": "Organization",
 name: "As-Sunnah Foundation & ASSDI"
 },
 knowsAbout: [
 "Generative AI",
 "Prompt Engineering",
 "Next.js",
 "React",
 "Laravel",
 "Python",
 "Electron",
 "Google Apps Script",
 "Firebase",
 "Google Cloud",
 "Kubernetes",
 "Workflow Automation",
 "Penetration Testing",
 "Ethical Hacking",
 "Information Security"
 ],
 knowsLanguage: ["Bengali", "English"],
 sameAs: [
 "https://github.com/zihaaaad",
 "https://www.linkedin.com/in/pkmzihad",
 "https://www.rokomari.com/book/548672/digital-shikar"
 ],
 description: "Generative AI and Full-Stack Developer on a core AI team, specializing in scalable workflow automation, system architecture, and cybersecurity. Author of Digital Shikar, a Bengali book on modern digital security and privacy."
 };
}

export function generateBlogPostSchema(post: BlogPost): WithContext<BlogPosting> {
 return {
 "@context": "https://schema.org",
 "@type": "BlogPosting",
 headline: post.title,
 description: post.excerpt,
 image: post.coverImage ? [post.coverImage] : [],
 datePublished: post.publishedAt ? new Date(post.publishedAt.seconds * 1000).toISOString() : new Date().toISOString(),
 dateModified: post.publishedAt ? new Date(post.publishedAt.seconds * 1000).toISOString() : new Date().toISOString(),
 author: {
 "@type": "Person",
 name: "Zihad Hasan",
 url: "https://zihadhasan.web.app"
 },
 publisher: {
 "@type": "Organization",
 name: "Zihad Hasan",
 logo: {
 "@type": "ImageObject",
 url: "https://zihadhasan.web.app/logo.png"
 }
 },
 url: `https://zihadhasan.web.app/blog/${post.slug}`,
 mainEntityOfPage: {
 "@type": "WebPage",
 "@id": `https://zihadhasan.web.app/blog/${post.slug}`
 }
 };
}

export function generateCourseSchema(course: CourseType): WithContext<Course> {
 return {
 "@context": "https://schema.org",
 "@type": "Course",
 name: course.title,
 description: course.description,
 provider: {
 "@type": "Organization",
 name: "Zihad Hasan",
 sameAs: "https://zihadhasan.web.app"
 },
 image: course.headerImage ? [course.headerImage] : [],
 offers: {
 "@type": "Offer",
 category: "Paid",
 price: Number(course.price),
 priceCurrency: "BDT",
 url: `https://zihadhasan.web.app/courses/${course.id}`
 },
 hasCourseInstance: {
 "@type": "CourseInstance",
 courseMode: "Online",
 inLanguage: "Bengali" // Assuming Bengali based on context
 }
 };
}

export function generateEventSchema(event: EventType): WithContext<Event> {
 const eventDate = event.date ? new Date(event.date.seconds * 1000).toISOString() : undefined;

 return {
 "@context": "https://schema.org",
 "@type": "Event",
 name: event.title,
 description: event.description,
 startDate: eventDate,
 endDate: eventDate, // Assuming single day/time for now, or use duration if available
 eventStatus: "https://schema.org/EventScheduled",
 eventAttendanceMode: event.isVirtual
 ? "https://schema.org/OnlineEventAttendanceMode"
 : "https://schema.org/OfflineEventAttendanceMode",
 location: event.isVirtual
 ? {
 "@type": "VirtualLocation",
 url: "https://zihadhasan.web.app/events"
 }
 : {
 "@type": "Place",
 name: event.location || "TBD",
 address: {
 "@type": "PostalAddress",
 addressLocality: "Dhaka",
 addressCountry: "BD"
 }
 },
 image: event.imageUrl ? [event.imageUrl] : [],
 organizer: {
 "@type": "Person",
 name: "Zihad Hasan",
 url: "https://zihadhasan.web.app"
 },
 offers: {
 "@type": "Offer",
 price: "0", // Assuming free registration or price needs to be added to Event model
 priceCurrency: "BDT",
 url: "https://zihadhasan.web.app/events",
 availability: (event.registeredCount || 0) >= event.totalSeats
 ? "https://schema.org/SoldOut"
 : "https://schema.org/InStock"
 }
 };
}
