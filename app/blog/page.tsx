"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { getPosts } from "@/lib/api";
import { Post } from "@/lib/types";
import { motion } from "framer-motion";

export default function BlogPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPosts()
            .then(setPosts)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="container py-12">
            <Reveal>
                <h1 className="text-4xl font-bold mb-4">Blog & Yangiliklar</h1>
                <p className="text-muted-foreground mb-12 max-w-2xl">
                    Ruxshona Tort olamidan eng so'nggi yangiliklar, foydali maslahatlar va shirin retseptlar bilan tanishing.
                </p>
            </Reveal>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse">
                            <div className="aspect-video bg-muted rounded-xl mb-4" />
                            <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                            <div className="h-4 bg-muted rounded w-full" />
                        </div>
                    ))}
                </div>
            ) : posts.length === 0 ? (
                <div className="text-center py-24 bg-muted/30 rounded-3xl border border-dashed">
                    <p className="text-muted-foreground">Hozircha maqolalar mavjud emas.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post, idx) => (
                        <Reveal key={post.id} delayMs={idx * 0.1}>
                            <Link href={`/blog/${post.slug}`}>
                                <motion.article
                                    whileHover={{ y: -5 }}
                                    className="group bg-card rounded-2xl overflow-hidden border hover:shadow-xl transition-all h-full flex flex-col"
                                >
                                    <div className="aspect-video relative overflow-hidden bg-muted">
                                        {post.image ? (
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-accent/20 text-accent text-4xl font-bold">
                                                RT
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6 flex-grow">
                                        <div className="text-sm text-accent font-medium mb-2">
                                            {new Date(post.createdAt).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </div>
                                        <h2 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors">
                                            {post.title}
                                        </h2>
                                        <p className="text-muted-foreground line-clamp-3 text-sm">
                                            {post.content.replace(/<[^>]*>/g, '').slice(0, 150)}...
                                        </p>
                                    </div>
                                    <div className="p-6 pt-0 mt-auto">
                                        <span className="text-accent font-semibold text-sm inline-flex items-center gap-2">
                                            Batafsil o'qish
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
                                        </span>
                                    </div>
                                </motion.article>
                            </Link>
                        </Reveal>
                    ))}
                </div>
            )}
        </div>
    );
}
