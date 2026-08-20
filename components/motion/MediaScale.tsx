"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { prefersReducedMotion, supportsScrollTimeline } from "@/lib/motion";
import { registerScrollFx } from "@/lib/scroll-fx";

type MediaScaleProps = {
  children: ReactNode;
  /** Starting scale. 1.14 means "settles down by 14%". */
  from?: number;
  className?: string;
  style?: CSSProperties;
};

/**
 * Media that enters slightly over-scaled and settles to 1:1 as it crosses the
 * viewport. The outer element clips; the inner one is what scales, so the
 * frame stays put and only a composited layer moves.
 */
export function MediaScale({
  children,
  from = 1.14,
  className,
  style,
}: MediaScaleProps) {
  const inner = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = inner.current;
    if (!el) return;
    if (supportsScrollTimeline() || prefersReducedMotion()) return;
    return registerScrollFx(el, "media");
  }, []);

  return (
    <div
      className={`media-scale ${className ?? ""}`}
      style={{ ...style, overflow: "clip" } as CSSProperties}
    >
      <div ref={inner} style={{ "--media-from": from } as CSSProperties}>
        {children}
      </div>
    </div>
  );
}
