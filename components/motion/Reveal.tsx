"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { observeReveal, prefersReducedMotion } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  /** Element to render. Defaults to a div. */
  as?: React.ElementType;
  className?: string;
  style?: CSSProperties;
  /** Stagger in ms, applied as a CSS transition-delay. */
  delay?: number;
  /** Distance travelled, any CSS length. Defaults to 2.2vh. */
  y?: string;
  /** Optional starting scale, for media that should settle rather than rise. */
  scale?: number;
  id?: string;
};

/**
 * Fades and lifts its children into place the first time they enter view.
 *
 * The transition itself lives in CSS (`[data-reveal]`) and only touches
 * `opacity` and `transform`; this component's only job is toggling one class
 * at the right moment. It unobserves immediately after firing, so the reveal
 * is one-shot and the observer set shrinks as the user scrolls.
 */
export function Reveal({
  children,
  as: Tag = "div",
  className,
  style,
  delay = 0,
  y,
  scale,
  id,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect the OS setting: show the content, skip the choreography.
    if (prefersReducedMotion()) {
      el.classList.add("is-inview", "is-settled");
      return;
    }

    const stop = observeReveal(el, (entry) => {
      if (!entry.isIntersecting) return;
      el.classList.add("is-inview");
      stop();
      // Release the compositor layer once the motion is over.
      const settle = () => el.classList.add("is-settled");
      el.addEventListener("transitionend", settle, { once: true });
    });

    return stop;
  }, []);

  return (
    <Tag
      ref={ref}
      id={id}
      data-reveal=""
      className={className}
      style={
        {
          ...style,
          ...(delay ? { "--reveal-delay": `${delay}ms` } : null),
          ...(y ? { "--reveal-y": y } : null),
          ...(scale ? { "--reveal-scale": scale } : null),
        } as CSSProperties
      }
    >
      {children}
    </Tag>
  );
}
