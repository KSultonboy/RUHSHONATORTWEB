"use client";

import type { CSSProperties, ElementType, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

type RevealProps = {
  children: ReactNode;
  delayMs?: number;
  className?: string;
  as?: ElementType;
  style?: CSSProperties;
};

export default function Reveal({ children, delayMs = 0, className = "", as: Tag = "div", style }: RevealProps) {
  const Component = Tag as any;
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      {
        threshold: 0.18,
      },
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <Component
      ref={ref as never}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`.trim()}
      style={{ ...style, "--reveal-delay": `${delayMs}ms` } as CSSProperties}
    >
      {children}
    </Component>
  );
}
