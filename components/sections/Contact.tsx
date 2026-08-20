import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { site } from "@/lib/site";

export function Contact() {
  return (
    <section
      id="contact"
      className="section"
      style={{ position: "relative", overflow: "clip" }}
    >
      <Parallax
        decorative
        depth={9}
        style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          translate: "-50% 0",
          width: "80vw",
          height: "80vw",
          maxWidth: "1000px",
          maxHeight: "1000px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--accent) 13%, transparent), transparent 62%)",
          filter: "blur(60px)",
          zIndex: 0,
        }}
      >
        <span />
      </Parallax>

      <div className="shell" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", maxWidth: "44rem", marginInline: "auto" }}>
          <Reveal>
            <p className="eyebrow" style={{ margin: "0 0 var(--gap-md)" }}>
              {site.availability}
            </p>
          </Reveal>

          <Reveal delay={80}>
            <h2
              className="display h-lg balance"
              style={{ margin: "0 0 var(--gap-md)" }}
            >
              Got a storefront that deserves{" "}
              <em style={{ fontStyle: "italic", color: "var(--accent)" }}>
                better
              </em>
              ?
            </h2>
          </Reveal>

          <Reveal delay={160}>
            <p
              className="lede"
              style={{ margin: "0 auto var(--gap-lg)", maxWidth: "40ch" }}
            >
              Send over the URL and what is frustrating you about it. I will
              reply with what I would look at first — no deck, no discovery call
              required.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "var(--gap-sm)",
                justifyContent: "center",
              }}
            >
              <a href={`mailto:${site.email}`} className="btn">
                {site.email}
              </a>
              <a
                href={site.social[0].href}
                className="btn btn--ghost"
                target="_blank"
                rel="noreferrer noopener"
              >
                GitHub ↗
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
