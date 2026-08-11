"use client";

import { BlogPost } from "@/lib/cms-service";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { generateBlogPostSchema } from "@/lib/schema-generator";
import sanitizeHtml from "sanitize-html";
import { NewsletterForm } from "@/components/shared/newsletter-form";
import "@/styles/syntax-highlight.css";
import { formatDate } from "@/lib/format";

interface BlogPostRendererProps {
  post: BlogPost;
}

export function BlogPostRenderer({ post }: BlogPostRendererProps) {
  const formattedDate = post.publishedAt
    ? formatDate(post.publishedAt, { month: "long", day: "numeric", year: "numeric" })
    : "";

  return (
    <article className="min-h-screen pt-32 pb-20 bg-background text-foreground">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link href="/blog" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Archive
        </Link>

        <header className="mb-12 text-center">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            {post.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="bg-gray-100 text-foreground border border-border uppercase tracking-widest text-[10px] font-bold py-1 px-3">
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-8 leading-[1.1]">
            {post.title}
          </h1>

          <div className="flex items-center justify-center gap-4 text-muted-foreground text-sm font-medium">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden border border-border">
                <img src="https://github.com/zihaaaad.png" alt="Zihad Hasan" className="h-full w-full object-cover" />
              </div>
              <span className="text-foreground font-semibold">Zihad Hasan</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5 uppercase tracking-widest text-[11px] font-bold">
              <Calendar className="h-3.5 w-3.5" />
              {formattedDate}
            </div>
          </div>
        </header>

        {post.coverImage && (
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-16 border border-border shadow-sm">
            <img src={post.coverImage} alt={post.title} className="object-cover w-full h-full" />
          </div>
        )}

        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateBlogPostSchema(post)),
          }}
        />

        <div className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-foreground prose-a:font-semibold prose-a:underline prose-a:decoration-gray-300 hover:prose-a:decoration-black prose-img:rounded-2xl prose-img:border prose-img:border-border prose-img:shadow-sm prose-pre:bg-gray-50 prose-pre:border prose-pre:border-border prose-pre:text-foreground">
          <div dangerouslySetInnerHTML={{
            __html: sanitizeHtml(post.content, {
              allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'pre', 'code', 'span']),
              allowedAttributes: {
                ...sanitizeHtml.defaults.allowedAttributes,
                'img': ['src', 'alt', 'class'],
                'code': ['class'],
                'span': ['class', 'style'],
                '*': ['style']
              }
            })
          }} />
        </div>

        <hr className="my-16 border-border" />

        <NewsletterForm variant="card" />
      </div>
    </article>
  );
}

function ButtonAsLink({ href, children, variant }: { href: string, children: React.ReactNode, variant?: "default" | "outline" }) {
  return (
    <Button asChild variant={variant} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg">
      <Link href={href}>{children}</Link>
    </Button>
  )
}
