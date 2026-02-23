"use client";

import Image from "next/image";
import Reveal from "@/components/ui/Reveal";

const INSTA_POSTS = [
    { id: 1, url: "https://images.unsplash.com/photo-1578985543813-28c3a127b712?w=600&h=600&fit=crop", likes: "1.2k" },
    { id: 2, url: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&h=600&fit=crop", likes: "850" },
    { id: 3, url: "https://images.unsplash.com/photo-1535141192574-5d4897c826a0?w=600&h=600&fit=crop", likes: "2.1k" },
    { id: 4, url: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&h=600&fit=crop", likes: "940" },
    { id: 5, url: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&h=600&fit=crop", likes: "1.5k" },
    { id: 6, url: "https://images.unsplash.com/photo-1519340333755-5662a3144578?w=600&h=600&fit=crop", likes: "3.2k" },
];

export default function InstagramFeed() {
    return (
        <section className="section" style={{ background: 'var(--cream-light)', padding: '100px 0' }}>
            <div className="container">
                <Reveal className="section-head stacked" style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h2 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary)', fontWeight: '700', marginBottom: '16px' }}>Bizni kuzatib boring</h2>
                    <h1 style={{ fontSize: '42px', marginBottom: '20px' }}>Instagram @ruxshona_tort</h1>
                    <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--muted)' }}>
                        Eng yangi tortlarimiz, jarayonlar va shirin hayot lag'zalarini biz bilan bo'lishing.
                    </p>
                </Reveal>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {INSTA_POSTS.map((post, index) => (
                        <Reveal key={post.id} style={{ animationDelay: `${index * 100}ms` }}>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="insta-card"
                                style={{
                                    display: 'block',
                                    position: 'relative',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    aspectRatio: '1/1',
                                    boxShadow: 'var(--shadow-premium)',
                                    cursor: 'pointer'
                                }}
                            >
                                <Image
                                    src={post.url}
                                    alt="Instagram post"
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                                <div className="insta-overlay" style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'rgba(0,0,0,0.4)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    opacity: 0,
                                    transition: 'opacity 0.3s',
                                    color: '#fff',
                                    fontSize: '18px',
                                    fontWeight: '700'
                                }}>
                                    <span>❤ {post.likes}</span>
                                </div>
                            </a>
                        </Reveal>
                    ))}
                </div>

                <div style={{ textAlign: 'center', marginTop: '60px' }}>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '16px 40px' }}>
                        Barchasini ko'rish
                    </a>
                </div>
            </div>

            <style jsx>{`
        .insta-card:hover .insta-overlay {
          opacity: 1 !important;
        }
        .insta-card:hover img {
          transform: scale(1.05);
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
        </section>
    );
}
