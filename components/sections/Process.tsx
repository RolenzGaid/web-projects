import { Reveal } from "@/components/motion/Reveal";
import { process } from "@/lib/site";

/**
 * Process timeline.
 *
 * The heading is `position: sticky` and holds while the steps scroll past it —
 * a pinned effect with no scroll listener and no library, just sticky
 * positioning inside a tall grid column.
 */
export function Process() {
  return (
    <section id="process" className="section">
      <div className="shell">
        <div className="row">
          <div className="col-12 col-lg-5">
            <div
              style={{
                position: "sticky",
                top: "clamp(6rem, 16vh, 9rem)",
                paddingBottom: "var(--gap-lg)",
              }}
            >
              <Reveal>
                <p className="eyebrow" style={{ margin: "0 0 var(--gap-sm)" }}>
                  How it goes
                </p>
              </Reveal>
              <Reveal delay={90}>
                <h2
                  className="display h-md"
                  style={{ margin: "0 0 var(--gap-md)", maxWidth: "16ch" }}
                >
                  Four phases, no{" "}
                  <em style={{ fontStyle: "italic", color: "var(--accent)" }}>
                    surprises
                  </em>
                </h2>
              </Reveal>
              <Reveal delay={180}>
                <p className="lede" style={{ margin: 0, maxWidth: "38ch" }}>
                  Fixed scope where it can be fixed, and an honest conversation
                  where it cannot. You will always know what week you are in.
                </p>
              </Reveal>
            </div>
          </div>

          <div className="col-12 col-lg-7">
            <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {process.map((phase, i) => (
                <Reveal as="li" key={phase.step} delay={i * 80}>
                  <div
                    style={{
                      display: "flex",
                      gap: "var(--gap-md)",
                      paddingBlock: "var(--gap-lg)",
                      borderTop: "1px solid var(--line)",
                    }}
                  >
                    <span
                      className="display"
                      aria-hidden
                      style={{
                        fontSize: "var(--step-3)",
                        color: "var(--accent)",
                        lineHeight: 1,
                        minWidth: "2.5em",
                      }}
                    >
                      {phase.step}
                    </span>
                    <div>
                      <h3
                        className="display"
                        style={{
                          fontSize: "var(--step-2)",
                          margin: "0 0 0.4em",
                        }}
                      >
                        {phase.title}
                      </h3>
                      <p
                        className="muted"
                        style={{ margin: 0, maxWidth: "44ch" }}
                      >
                        {phase.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
