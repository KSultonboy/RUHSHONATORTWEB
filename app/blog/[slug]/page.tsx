"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Reveal from "@/components/ui/Reveal";
import { getPostBySlug } from "@/lib/api";
import { Post } from "@/lib/types";
import { motion } from "framer-motion";

export default function BlogPostPage() {
    const { slug } = useParams();
    const router = useRouter();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (slug) {
            getPostBySlug(slug as string)
                .then(setPost)
                .catch(() => router.push("/blog"))
                .finally(() => setLoading(false));
        }
    }, [slug]);

    if (loading) {
        return (
            <div className="container py-24 max-w-3xl">
                <div className="animate-pulse">
                    <div className="h-10 bg-muted rounded w-3/4 mb-6" />
                    <div className="h-4 bg-muted rounded w-1/4 mb-12" />
                    <div className="aspect-video bg-muted rounded-2xl mb-12" />
                    <div className="space-y-4">
                        <div className="h-4 bg-muted rounded w-full" />
                        <div className="h-4 bg-muted rounded w-full" />
                        <div className="h-4 bg-muted rounded w-2/3" />
                    </div>
                </div>
            </div>
        );
    }

    if (!post) return null;

    return (
        <article className="container py-12 max-w-4xl">
            <Reveal>
                <Link href="/blog" className="text-accent font-medium inline-flex items-center gap-2 mb-8 hover:underline">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5m7-7-7 7 7 7" /></svg>
                    Blogga qaytish
                </Link>
            </Reveal>

            <Reveal>
                <header className="mb-12">
                    <div className="text-accent font-semibold mb-4 text-lg">
                        {new Date(post.createdAt).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-0 leading-tight">
                        {post.title}
                    </h1>
                </header>
            </Reveal>

            {post.image && (
                <Reveal delayMs={0.2}>
                    <div className="aspect-video rounded-3xl overflow-hidden mb-12 shadow-2xl">
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                </Reveal>
            )}

            <Reveal delayMs={0.3}>
                <div
                    className="prose prose-lg dark:prose-invert max-w-none 
            prose-headings:font-black prose-accent
            prose-p:text-muted-foreground prose-p:leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </Reveal>

            <Reveal delayMs={0.4}>
                <footer className="mt-16 pt-12 border-t">
                    <div className="bg-accent/5 rounded-3xl p-8 md:p-12 text-center">
                        <h3 className="text-2xl font-bold mb-4">Sizga yoqdimi?</h3>
                        <p className="text-muted-foreground mb-8">Bizning boshqa shirinliklarimiz bilan tanishib chiqing!</p>
                        <Link href="/catalog" className="btn btn-primary px-8">Katalogni ko'rish</Link>
                    </div>
                </footer>
            </Reveal>
        </article>
    );
}

// Link is missing from imports, I should add it
import Link from "next/link";
