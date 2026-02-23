"use client";

import { useState } from "react";
import Image from "next/image";
import { toAbsoluteImage } from "@/lib/image";
import Reveal from "@/components/ui/Reveal";

interface ProductGalleryProps {
    images: string[];
    videos: string[];
}

export default function ProductGallery({ images = [], videos = [] }: ProductGalleryProps) {
    // Combine images and videos for the gallery
    const items = [
        ...images.map(url => ({ type: 'image' as const, url })),
        ...videos.map(url => ({ type: 'video' as const, url }))
    ];

    const [activeIndex, setActiveIndex] = useState(0);
    const activeItem = items[activeIndex] || (items.length > 0 ? items[0] : null);

    if (!activeItem) {
        return (
            <Reveal className="panel" style={{ padding: '0', overflow: 'hidden', aspectRatio: '1/1', background: 'var(--cream-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: 'var(--muted)' }}>Rasm mavjud emas</p>
            </Reveal>
        );
    }

    return (
        <div style={{ display: 'grid', gap: '20px' }}>
            <Reveal className="panel" style={{ padding: '0', overflow: 'hidden', aspectRatio: '1/1', position: 'relative' }}>
                {activeItem.type === 'image' ? (
                    <Image
                        src={toAbsoluteImage(activeItem.url) || "https://dummyimage.com/800x800/f8f3ed/800020&text=Ruxshona"}
                        alt="Product image"
                        width={800}
                        height={800}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                ) : (
                    <video
                        src={activeItem.url.startsWith('http') ? activeItem.url : `/api/video/${activeItem.url}`}
                        controls
                        autoPlay
                        muted
                        loop
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                )}
            </Reveal>

            {items.length > 1 && (
                <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
                    {items.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                border: activeIndex === index ? '2px solid var(--primary)' : '2px solid transparent',
                                opacity: activeIndex === index ? 1 : 0.6,
                                transition: 'all 0.2s',
                                flexShrink: 0,
                                position: 'relative'
                            }}
                        >
                            {item.type === 'image' ? (
                                <Image
                                    src={toAbsoluteImage(item.url) || "https://dummyimage.com/200x200/f8f3ed/800020&text=Ruxshona"}
                                    alt={`Thumbnail ${index}`}
                                    width={800}
                                    height={800}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <div style={{ width: '100%', height: '100%', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '20px' }}>
                                    ▶
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
