"use client";

import { useEffect, useState } from "react";
import { nav, site } from "@/lib/site";

/**
 * Fixed header that condenses once the hero is behind it and tracks which
 * section is in view.
 *
 * The scroll handler is passive and rAF-coalesced, and it only ever flips a
 * boolean — no per-frame style writes, so scrolling stays free even on a
 * long page.
 */
export function Header() {
  const [condensed, setCondensed] = useState(false);
  const [active, setActive] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      setCondensed(window.scrollY > window.innerHeight * 0.12);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const sections = nav
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        // The entry closest to the top of the viewport wins, which keeps the
        // highlight stable when two sections overlap mid-scroll.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );

    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Close the drawer on Escape, and stop the page scrolling behind it.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  return (
    <header
      data-condensed={condensed || undefined}
      style={{
        position: "fixed",
        inset: "0 0 auto 0",
        zIndex: 50,
        transition:
          "background-color var(--dur-mid) var(--ease-out), backdrop-filter var(--dur-mid) var(--ease-out), border-color var(--dur-mid) var(--ease-out)",
        backgroundColor: condensed
          ? "color-mix(in oklab, var(--ink) 72%, transparent)"
          : "transparent",
        backdropFilter: condensed ? "blur(14px) saturate(140%)" : "none",
        borderBottom: `1px solid ${condensed ? "var(--line)" : "transparent"}`,
      }}
    >
      <div
        className="shell"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--gap-md)",
          // The bar itself shrinks as you scroll — a vh-based height so it
          // stays proportional on tablets.
          height: condensed ? "clamp(3.5rem, 7vh, 4.5rem)" : "clamp(4.25rem, 9vh, 5.75rem)",
          transition: "height var(--dur-mid) var(--ease-out)",
        }}
      >
        <a
          href="#top"
          style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}
        >
          <span
            aria-hidden
            style={{
              display: "grid",
              placeItems: "center",
              width: "2.1em",
              height: "2.1em",
              borderRadius: "0.6em",
              background: "var(--accent)",
              color: "var(--accent-ink)",
              fontSize: "var(--step--1)",
              fontWeight: 700,
              letterSpacing: "0.02em",
            }}
          >
            {site.initials}
          </span>
          <span style={{ fontWeight: 560, letterSpacing: "-0.01em" }}>
            {site.name}
          </span>
        </a>

        {/* Desktop / tablet nav */}
        <nav
          aria-label="Sections"
          className="d-none d-md-flex"
          style={{ alignItems: "center", gap: "clamp(1rem, 2.4vw, 2.4rem)" }}
        >
          {nav.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="link"
              aria-current={active === item.id ? "true" : undefined}
              style={{
                fontSize: "var(--step-0)",
                color:
                  active === item.id
                    ? "var(--paper)"
                    : "color-mix(in oklab, var(--paper) 62%, transparent)",
                transition: "color var(--dur-fast) var(--ease-out)",
              }}
            >
              {item.label}
            </a>
          ))}
          <a href="#contact" className="btn" style={{ padding: "0.7em 1.3em" }}>
            Start a project
          </a>
        </nav>

        {/* Mobile trigger */}
        <button
          type="button"
          className="d-md-none"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((v) => !v)}
          style={{
            display: "grid",
            gap: "5px",
            padding: "0.7rem",
            background: "transparent",
            border: `1px solid var(--line-strong)`,
            borderRadius: "0.7rem",
            cursor: "pointer",
          }}
        >
          <span className="visually-hidden-focusable" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
            {menuOpen ? "Close menu" : "Open menu"}
          </span>
          {[0, 1].map((i) => (
            <span
              key={i}
              aria-hidden
              style={{
                display: "block",
                width: "20px",
                height: "1.5px",
                background: "var(--paper)",
                transition: "transform var(--dur-fast) var(--ease-out)",
                transform: menuOpen
                  ? `translateY(${i === 0 ? 3.25 : -3.25}px) rotate(${i === 0 ? 45 : -45}deg)`
                  : "none",
              }}
            />
          ))}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-nav"
        className="d-md-none"
        hidden={!menuOpen}
        style={{
          borderTop: "1px solid var(--line)",
          background: "color-mix(in oklab, var(--ink) 96%, transparent)",
          backdropFilter: "blur(18px)",
        }}
      >
        <nav
          aria-label="Sections"
          className="shell"
          style={{
            display: "grid",
            gap: "var(--gap-sm)",
            paddingBlock: "var(--gap-md)",
          }}
        >
          {nav.map((item, i) => (
            <a
              key={item.id}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="fade-up"
              style={
                {
                  fontSize: "var(--step-2)",
                  fontWeight: 500,
                  "--i": i,
                  "--lead": "40ms",
                  "--stagger": "50ms",
                } as React.CSSProperties
              }
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="btn"
            style={{ marginTop: "var(--gap-sm)" }}
          >
            Start a project
          </a>
        </nav>
      </div>
    </header>
  );
}
