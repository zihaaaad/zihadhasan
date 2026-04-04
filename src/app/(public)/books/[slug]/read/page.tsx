import { CMSService } from "@/lib/cms-service";
import EbookReaderClient from "./ebook-reader-client";
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

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Secure Reader | Zihad Hasan",
        robots: { index: false, follow: false },
    };
}

export default async function EbookReaderPage({ params }: Props) {
    const { slug } = await params;
    return <EbookReaderClient slug={slug} />;
}
