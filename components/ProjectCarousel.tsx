"use client";

import { useCallback, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Keyboard, Pagination } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper/types";
import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/lib/projects";

import "swiper/css";
import "swiper/css/pagination";

/**
 * Touch-friendly project carousel.
 *
 * Only the modules actually used are imported (`A11y`, `Keyboard`,
 * `Pagination`) rather than `swiper/bundle` — Swiper is modular and the bundle
 * entry pulls in every effect and module whether the page uses them or not.
 *
 * Navigation is deliberately custom rather than Swiper's built-in buttons: it
 * lets the arrows live outside the clipping container, next to the counter,
 * and keeps the disabled states in React where the rest of the UI lives.
 */
export function ProjectCarousel() {
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);
  const [index, setIndex] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback((instance: SwiperClass) => {
    setIndex(instance.activeIndex);
    setAtStart(instance.isBeginning);
    setAtEnd(instance.isEnd);
  }, []);

  return (
    <div>
      <Swiper
        modules={[A11y, Keyboard, Pagination]}
        onSwiper={(instance) => {
          setSwiper(instance);
          sync(instance);
        }}
        onSlideChange={sync}
        onResize={sync}
        // Fractional counts let the next card peek in, which advertises that
        // the row scrolls without needing a hint.
        slidesPerView={1.06}
        spaceBetween={14}
        breakpoints={{
          640: { slidesPerView: 1.5, spaceBetween: 18 },
          900: { slidesPerView: 2.05, spaceBetween: 22 },
          1400: { slidesPerView: 2.5, spaceBetween: 26 },
        }}
        grabCursor
        watchSlidesProgress
        keyboard={{ enabled: true, onlyInViewport: true }}
        a11y={{
          enabled: true,
          containerMessage: "Selected work carousel",
          prevSlideMessage: "Previous project",
          nextSlideMessage: "Next project",
        }}
        pagination={{ type: "progressbar" }}
        style={{ paddingBottom: "var(--gap-md)", overflow: "hidden" }}
      >
        {projects.map((project, i) => (
          <SwiperSlide key={project.slug} style={{ height: "auto" }}>
            <ProjectCard project={project} index={i} eager={i === 0} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* ---------------- controls ---------------- */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--gap-md)",
          marginTop: "var(--gap-md)",
        }}
      >
        <p className="eyebrow" style={{ margin: 0 }}>
          <span style={{ color: "var(--paper)" }}>
            {/* With a fractional slidesPerView the last snap point leaves
                activeIndex short of the final slide (the tail is already on
                screen), so the counter would stall at 05/06. Showing the total
                once Swiper reports the end matches what the user sees. */}
            {String(atEnd ? projects.length : index + 1).padStart(2, "0")}
          </span>{" "}
          / {String(projects.length).padStart(2, "0")}
        </p>

        <div style={{ display: "flex", gap: "var(--gap-xs)" }}>
          <CarouselButton
            label="Previous project"
            disabled={atStart}
            onClick={() => swiper?.slidePrev()}
          >
            ←
          </CarouselButton>
          <CarouselButton
            label="Next project"
            disabled={atEnd}
            onClick={() => swiper?.slideNext()}
          >
            →
          </CarouselButton>
        </div>
      </div>
    </div>
  );
}

function CarouselButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      style={{
        display: "grid",
        placeItems: "center",
        width: "clamp(2.75rem, 5vh, 3.25rem)",
        aspectRatio: "1",
        borderRadius: "999px",
        border: "1px solid var(--line-strong)",
        background: "transparent",
        color: "var(--paper)",
        fontSize: "var(--step-1)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.32 : 1,
        transition:
          "opacity var(--dur-fast) var(--ease-out), background-color var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)",
      }}
      onPointerEnter={(event) => {
        if (disabled) return;
        event.currentTarget.style.backgroundColor = "var(--paper)";
        event.currentTarget.style.color = "var(--ink)";
      }}
      onPointerLeave={(event) => {
        event.currentTarget.style.backgroundColor = "transparent";
        event.currentTarget.style.color = "var(--paper)";
      }}
    >
      <span aria-hidden>{children}</span>
    </button>
  );
}
