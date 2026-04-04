import { CMSService } from "@/lib/cms-service";
import BookPreviewClient from "./book-preview-client";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const books = await CMSService.getBooks(true);

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
        title: `Preview: ${book.title} | Zihad Hasan`,
        description: `Read a free sample of ${book.title} by ${book.author}.`,
    };
}

export default async function BookPreviewPage({ params }: Props) {
    const { slug } = await params;
    const book = await CMSService.getBookBySlug(slug);

    if (!book) {
        notFound();
    }

    return <BookPreviewClient book={book} />;
}
