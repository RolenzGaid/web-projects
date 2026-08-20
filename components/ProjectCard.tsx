"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import type { Project } from "@/lib/projects";

/**
 * Aspect ratio of the visible window, as width / height.
 * Kept in one place because the hover-scroll distance is derived from it.
 */
const FRAME_ASPECT = 4 / 3;

/**
 * How far to travel the tall poster on hover, as a percentage of the poster's
 * own height.
 *
 * The poster is 1:2 and fills the frame's width, so its rendered height is 2w
 * while the frame shows only w / FRAME_ASPECT of it. Travelling the difference
 * scrolls exactly to the bottom edge and no further:
 *
 *   travel = (2w − w/aspect) / 2w
 *
 * Expressing it as a percentage of the element's own height means it stays
 * correct at every viewport size without measuring anything in JS.
 */
const SCROLL_TRAVEL = ((2 - 1 / FRAME_ASPECT) / 2) * 100;

export function ProjectCard({
  project,
  index,
  eager = false,
}: {
  project: Project;
  index: number;
  /** The first slide is above the fold — let it skip lazy loading. */
  eager?: boolean;
}) {
  const [active, setActive] = useState(false);
  // The clip is only requested after the first hover, so a visitor who never
  // interacts never downloads it.
  const [videoRequested, setVideoRequested] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const activate = useCallback(() => {
    setActive(true);
    if (!project.video) return;
    setVideoRequested(true);
    // play() rejects if the browser blocks it (low power mode, data saver).
    // The poster stays visible in that case, so nothing to recover from.
    void videoRef.current?.play().catch(() => {});
  }, [project.video]);

  const deactivate = useCallback(() => {
    setActive(false);
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  }, []);

  return (
    <article
      className="card"
      onPointerEnter={activate}
      onPointerLeave={deactivate}
      onFocus={activate}
      onBlur={deactivate}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        transition:
          "border-color var(--dur-mid) var(--ease-out), transform var(--dur-mid) var(--ease-out)",
        borderColor: active
          ? `color-mix(in oklab, ${project.accent} 40%, transparent)`
          : undefined,
        transform: active ? "translate3d(0, -0.6vh, 0)" : "translate3d(0, 0, 0)",
      }}
    >
      {/* ---------------- preview window ---------------- */}
      <div
        style={{
          position: "relative",
          aspectRatio: `${FRAME_ASPECT}`,
          overflow: "clip",
          borderBottom: "1px solid var(--line)",
          // A wash in the project's accent, so each card reads as its own brand.
          background: `linear-gradient(180deg, color-mix(in oklab, ${project.accent} 10%, var(--ink-raised)), var(--ink-raised))`,
        }}
      >
        {/* The tall poster scrolls up on hover: it reads as a walkthrough of
            the live site rather than a static thumbnail. */}
        <div
          style={{
            position: "absolute",
            inset: "0 0 auto 0",
            transform: active
              ? `translate3d(0, -${SCROLL_TRAVEL}%, 0)`
              : "translate3d(0, 0, 0)",
            // Slow, linear on the way in (a scroll-through), quick ease back.
            transition: active
              ? "transform 5s linear"
              : "transform var(--dur-slow) var(--ease-out)",
            willChange: active ? "transform" : "auto",
          }}
        >
          <Image
            src={project.poster}
            alt={`${project.title} — full page preview`}
            width={project.posterWidth}
            height={project.posterHeight}
            sizes="(max-width: 768px) 92vw, (max-width: 1200px) 56vw, 42vw"
            priority={eager}
            loading={eager ? undefined : "lazy"}
            style={{ width: "100%", height: "auto" }}
          />
        </div>

        {/* Optional motion preview, layered over the poster. */}
        {project.video && videoRequested ? (
          <video
            ref={videoRef}
            src={project.video}
            poster={project.poster}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: active ? 1 : 0,
              transition: "opacity var(--dur-mid) var(--ease-out)",
            }}
          />
        ) : null}

        {/* Index + year chrome */}
        <div
          style={{
            position: "absolute",
            inset: "auto 0 0 0",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "var(--gap-sm)",
            padding: "var(--gap-md)",
            background:
              "linear-gradient(0deg, color-mix(in oklab, var(--ink) 85%, transparent), transparent)",
            pointerEvents: "none",
          }}
        >
          <span
            className="eyebrow"
            style={{ color: "color-mix(in oklab, var(--paper) 70%, transparent)" }}
          >
            {String(index + 1).padStart(2, "0")} / {project.year}
          </span>
          <span
            className="pill"
            style={{
              background: "color-mix(in oklab, var(--ink) 60%, transparent)",
              backdropFilter: "blur(6px)",
              opacity: active ? 1 : 0,
              transform: active ? "translate3d(0,0,0)" : "translate3d(0, 0.6vh, 0)",
              transition:
                "opacity var(--dur-mid) var(--ease-out), transform var(--dur-mid) var(--ease-out)",
            }}
          >
            {project.video ? "Playing preview" : "Scrolling preview"}
          </span>
        </div>
      </div>

      {/* ---------------- copy ---------------- */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--gap-sm)",
          padding: "var(--gap-md)",
          flex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: "var(--gap-sm)",
            flexWrap: "wrap",
          }}
        >
          <h3
            className="display"
            style={{ fontSize: "var(--step-3)", margin: 0 }}
          >
            {project.title}
          </h3>
          <span
            className="display"
            style={{
              fontSize: "var(--step-2)",
              color: project.accent,
              letterSpacing: "-0.02em",
            }}
          >
            {project.metric.value}
          </span>
        </div>

        <p className="eyebrow" style={{ margin: 0 }}>
          {project.client} · {project.metric.label}
        </p>

        <p
          className="muted"
          style={{ margin: 0, fontSize: "var(--step-0)", flex: 1 }}
        >
          {project.summary}
        </p>

        <ul
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.4rem",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        >
          {project.stack.map((tech) => (
            <li key={tech} className="pill" style={{ fontSize: "var(--step--1)" }}>
              {tech}
            </li>
          ))}
        </ul>

        <a
          href={project.href}
          className="link"
          style={{
            marginTop: "var(--gap-xs)",
            alignSelf: "flex-start",
            fontWeight: 560,
            color: project.accent,
          }}
        >
          Read the case study{" "}
          <span
            aria-hidden
            style={{
              display: "inline-block",
              transform: active ? "translate3d(0.25em, 0, 0)" : "none",
              transition: "transform var(--dur-mid) var(--ease-out)",
            }}
          >
            →
          </span>
        </a>
      </div>
    </article>
  );
}
