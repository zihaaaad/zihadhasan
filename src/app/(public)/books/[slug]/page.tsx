import { CMSService } from "@/lib/cms-service";
import BookDetailsClient from "./book-details-client";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface Props {
 params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
 const books = await CMSService.getBooks(true); // only published for public pages

 if (books.length > 0) {
 return books.map((book) => ({
 slug: book.slug,
 }));
 } else {
 return [{ slug: "placeholder" }];
 }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
 const slug = (await params).slug;
 const book = await CMSService.getBookBySlug(slug);

 if (!book) {
 return { title: "Book Not Found | Zihad Hasan" };
 }

 return {
 title: `${book.title} | Zihad Hasan`,
 description: book.description,
 openGraph: {
 title: book.title,
 description: book.description,
 images: book.imageUrl ? [book.imageUrl] : [],
 },
 };
}

export default async function BookDetailsPage({ params }: Props) {
 const { slug } = await params;
 const book = await CMSService.getBookBySlug(slug);

 if (!book) {
 notFound();
 }

 return <BookDetailsClient book={book} initialPurchaseStatus={false} />;
}
