import { Parallax } from "@/components/motion/Parallax";
import { site } from "@/lib/site";

/**
 * Hero.
 *
 * The entrance animation is pure CSS keyframes (`.reveal-mask` / `.reveal-line`
 * in globals.css) rather than JS-driven: each line slides up out of its own
 * clipping mask, staggered by a `--i` index. Nothing here waits on hydration,
 * so the animation starts as soon as the CSS lands instead of after the
 * JavaScript bundle parses — which is the whole point of a first impression.
 */
export function Hero() {
  const lines = ["Senior Web", "Developer &"];

  return (
    <section
      id="top"
      className="section"
      style={{
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
        paddingTop: "clamp(6rem, 14vh, 9rem)",
        overflow: "clip",
      }}
    >
      {/* Ambient depth. Decorative, so it stays out of the a11y tree. */}
      <Parallax
        decorative
        depth={7}
        style={{
          position: "absolute",
          top: "-12vh",
          right: "-14vw",
          width: "62vw",
          height: "62vw",
          maxWidth: "900px",
          maxHeight: "900px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 50% 50%, color-mix(in oklab, var(--accent) 16%, transparent), transparent 65%)",
          filter: "blur(40px)",
          zIndex: 0,
        }}
      >
        <span />
      </Parallax>
      <Parallax
        decorative
        depth={11}
        style={{
          position: "absolute",
          bottom: "-18vh",
          left: "-10vw",
          width: "44vw",
          height: "44vw",
          maxWidth: "640px",
          maxHeight: "640px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 50% 50%, color-mix(in oklab, var(--accent-2) 22%, transparent), transparent 68%)",
          filter: "blur(50px)",
          zIndex: 0,
        }}
      >
        <span />
      </Parallax>

      <div className="shell" style={{ position: "relative", zIndex: 1 }}>
        <p
          className="eyebrow fade-up"
          style={{ ["--i" as string]: 0, marginBottom: "var(--gap-md)" }}
        >
          <span
            aria-hidden
            style={{
              display: "inline-block",
              width: "0.5em",
              height: "0.5em",
              marginRight: "0.6em",
              borderRadius: "50%",
              background: "var(--accent)",
              verticalAlign: "middle",
            }}
          />
          {site.availability} · {site.location}
        </p>

        <h1
          className="display h-xl"
          style={{ margin: 0, maxWidth: "18ch", letterSpacing: "-0.035em" }}
        >
          {lines.map((line, i) => (
            <span key={line} className="reveal-mask">
              <span
                className="reveal-line"
                style={{ ["--i" as string]: i, display: "block" }}
              >
                {line}
              </span>
            </span>
          ))}
          <span className="reveal-mask">
            <span
              className="reveal-line"
              style={{ ["--i" as string]: lines.length, display: "block" }}
            >
              <em
                style={{
                  fontStyle: "italic",
                  color: "var(--accent)",
                  paddingRight: "0.06em",
                }}
              >
                E-commerce
              </em>{" "}
              Expert
            </span>
          </span>
        </h1>

        <div
          className="row"
          style={{ marginTop: "clamp(1.5rem, 4vh, 3rem)", alignItems: "end" }}
        >
          <div className="col-12 col-lg-7">
            <p
              className="lede fade-up balance"
              style={{ ["--i" as string]: 4, maxWidth: "52ch", margin: 0 }}
            >
              {site.tagline}
            </p>

            <div
              className="fade-up"
              style={{
                ["--i" as string]: 5,
                display: "flex",
                flexWrap: "wrap",
                gap: "var(--gap-sm)",
                marginTop: "clamp(1.5rem, 3.5vh, 2.5rem)",
              }}
            >
              <a href="#work" className="btn">
                See selected work
                <span aria-hidden>↓</span>
              </a>
              <a href="#contact" className="btn btn--ghost">
                Start a project
              </a>
            </div>
          </div>

          <div className="col-12 col-lg-5">
            <dl
              className="fade-up"
              style={{
                ["--i" as string]: 6,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(9rem, 1fr))",
                gap: "var(--gap-md)",
                margin: "clamp(1.5rem, 4vh, 0rem) 0 0",
                paddingTop: "var(--gap-md)",
                borderTop: "1px solid var(--line)",
              }}
            >
              {[
                { k: "Focus", v: "Headless commerce" },
                { k: "Platforms", v: "Shopify · Next.js" },
                { k: "Based", v: "Remote, worldwide" },
              ].map((row) => (
                <div key={row.k}>
                  <dt className="eyebrow" style={{ marginBottom: "0.35em" }}>
                    {row.k}
                  </dt>
                  <dd style={{ margin: 0, fontSize: "var(--step-0)" }}>
                    {row.v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Scroll affordance */}
      <div
        aria-hidden
        className="fade-up d-none d-md-block"
        style={{
          ["--i" as string]: 8,
          position: "absolute",
          bottom: "clamp(1.5rem, 4vh, 3rem)",
          left: "50%",
          translate: "-50% 0",
          fontSize: "var(--step--1)",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--muted)",
        }}
      >
        Scroll
      </div>
    </section>
  );
}
