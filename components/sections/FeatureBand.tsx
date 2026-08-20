import Image from "next/image";
import { MediaScale } from "@/components/motion/MediaScale";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Full-bleed feature band.
 *
 * The image enters slightly over-scaled and settles to 1:1 as it crosses the
 * viewport (see MediaScale), while the floating stat card drifts at a
 * different rate (Parallax). Two elements moving at two speeds is what sells
 * depth — and both are single composited transforms, so the band costs nothing
 * to scroll past.
 */
export function FeatureBand() {
  return (
    <section
      className="section"
      style={{ paddingBlock: "var(--gap-xl)", overflow: "clip" }}
    >
      <div className="shell">
        <div style={{ position: "relative" }}>
          <MediaScale
            from={1.16}
            style={{
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--line)",
            }}
          >
            <Image
              src="/work/feature-wide.webp"
              alt="Commerce analytics dashboard from a recent build"
              width={1600}
              height={1000}
              sizes="(max-width: 1200px) 94vw, 88rem"
              style={{ width: "100%", height: "auto" }}
            />
          </MediaScale>

          {/* Floating stat, drifting against the image. */}
          <Parallax
            depth={5}
            style={{
              position: "absolute",
              bottom: "clamp(-1.5rem, -2vh, -1rem)",
              left: "clamp(1rem, 4vw, 3.5rem)",
              maxWidth: "min(24rem, 74vw)",
            }}
          >
            <Reveal
              className="card"
              delay={120}
              style={{
                padding: "var(--gap-md)",
                background: "color-mix(in oklab, var(--ink) 88%, transparent)",
                backdropFilter: "blur(12px)",
              }}
            >
              <p className="eyebrow" style={{ margin: "0 0 0.4em" }}>
                Measured, not claimed
              </p>
              <p
                className="display"
                style={{
                  fontSize: "var(--step-3)",
                  margin: "0 0 0.35em",
                  letterSpacing: "-0.03em",
                }}
              >
                Every build ships with a dashboard
              </p>
              <p className="muted" style={{ margin: 0, fontSize: "var(--step--1)" }}>
                Conversion, Core Web Vitals, and revenue per session — wired up
                before launch, so week one is a reading rather than a guess.
              </p>
            </Reveal>
          </Parallax>
        </div>
      </div>
    </section>
  );
}
