"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * A soft light that trails the pointer.
 *
 * Mouse-only (`pointer: fine`) — on touch there is no cursor to follow, so it
 * never mounts its listeners there. Position is written as a `translate3d` on
 * a single fixed layer inside one rAF, and the loop stops itself once the
 * light has caught up with the pointer, so an idle page costs nothing.
 */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let x = targetX;
    let y = targetY;
    let frame = 0;
    let running = false;

    const loop = () => {
      // Exponential smoothing — the light lags the pointer slightly, which is
      // what makes it feel like a physical object rather than a hard-attached
      // div.
      x += (targetX - x) * 0.12;
      y += (targetY - y) * 0.12;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%)`;

      if (Math.abs(targetX - x) < 0.4 && Math.abs(targetY - y) < 0.4) {
        running = false;
        return;
      }
      frame = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(loop);
    };

    const onMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      start();
    };

    el.style.opacity = "1";
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "38vw",
        height: "38vw",
        maxWidth: "620px",
        maxHeight: "620px",
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0,
        transition: "opacity 900ms var(--ease-out)",
        background:
          "radial-gradient(circle, color-mix(in oklab, var(--accent) 12%, transparent) 0%, transparent 62%)",
        filter: "blur(30px)",
        willChange: "transform",
      }}
    />
  );
}
