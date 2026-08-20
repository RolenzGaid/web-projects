"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { prefersReducedMotion, supportsScrollTimeline } from "@/lib/motion";
import { registerScrollFx } from "@/lib/scroll-fx";

type ParallaxProps = {
  children: ReactNode;
  /** Travel distance, in vh. Larger reads as "further away". */
  depth?: number;
  className?: string;
  style?: CSSProperties;
  /** Decorative layers should stay out of the accessibility tree. */
  decorative?: boolean;
};

/**
 * A scroll-linked parallax layer.
 *
 * Where the browser supports scroll-driven animations, the whole effect is CSS
 * and runs off the main thread — this component mounts, checks, and does
 * nothing else. Older browsers get the shared rAF loop in lib/scroll-fx, which
 * is imported lazily so the bulk of the fallback never reaches modern clients.
 */
export function Parallax({
  children,
  depth = 4,
  className,
  style,
  decorative = false,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // CSS already handles it, or the user asked for stillness.
    if (supportsScrollTimeline() || prefersReducedMotion()) return;
    return registerScrollFx(el, "parallax");
  }, []);

  return (
    <div
      ref={ref}
      data-parallax=""
      aria-hidden={decorative || undefined}
      className={className}
      style={{ ...style, "--depth": `${depth}vh` } as CSSProperties}
    >
      {children}
    </div>
  );
}
