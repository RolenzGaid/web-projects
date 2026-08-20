"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { observeReveal, prefersReducedMotion } from "@/lib/motion";

/** useLayoutEffect on the client, useEffect on the server (avoids the warning). */
const useIsoLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

type CountUpProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
};

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Counts up to `value` the first time it scrolls into view.
 *
 * Renders the final number during SSR so the figure is correct with JavaScript
 * disabled, then resets to zero before the first paint on the client — hence
 * the layout effect, which avoids a one-frame flash of the final value.
 */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  durationMs = 1600,
}: CountUpProps) {
  const [display, setDisplay] = useState(value);
  const hostRef = useRef<HTMLSpanElement | null>(null);
  const frameRef = useRef(0);

  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    setDisplay(0);
  }, []);

  useEffect(() => {
    const el = hostRef.current;
    if (!el || prefersReducedMotion()) return;

    const stop = observeReveal(el, (entry) => {
      if (!entry.isIntersecting) return;
      stop();

      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / durationMs);
        setDisplay(Math.round(easeOutExpo(t) * value));
        if (t < 1) frameRef.current = requestAnimationFrame(tick);
      };
      frameRef.current = requestAnimationFrame(tick);
    });

    return () => {
      stop();
      cancelAnimationFrame(frameRef.current);
    };
  }, [value, durationMs]);

  return (
    <span ref={hostRef} style={{ fontVariantNumeric: "tabular-nums" }}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
