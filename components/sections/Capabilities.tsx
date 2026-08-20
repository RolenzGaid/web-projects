import { Reveal } from "@/components/motion/Reveal";
import { SectionHead } from "@/components/sections/SectionHead";
import { capabilities } from "@/lib/site";

export function Capabilities() {
  return (
    <section
      id="capabilities"
      className="section"
      style={{ background: "var(--ink-sunken)", borderBlock: "1px solid var(--line)" }}
    >
      <div className="shell">
        <SectionHead
          eyebrow="Capabilities"
          title="What I actually get hired for"
          intro="Six things, done properly, rather than a list of every logo I have touched. Most engagements are two or three of these at once."
        />

        <div className="row">
          {capabilities.map((item, i) => (
            <Reveal
              key={item.title}
              className="col-12 col-md-6 col-xl-4"
              // Stagger within the row, not across the whole grid, so the
              // last card never waits half a second behind the first.
              delay={(i % 3) * 110}
              style={{ display: "flex" }}
            >
              <div
                className="card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--gap-sm)",
                  padding: "var(--gap-md)",
                  width: "100%",
                }}
              >
                <p
                  className="eyebrow"
                  style={{ margin: 0, color: "var(--accent)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3
                  className="display"
                  style={{ fontSize: "var(--step-2)", margin: 0 }}
                >
                  {item.title}
                </h3>
                <p
                  className="muted"
                  style={{ margin: 0, fontSize: "var(--step-0)", flex: 1 }}
                >
                  {item.body}
                </p>
                <ul
                  style={{
                    listStyle: "none",
                    margin: 0,
                    padding: "var(--gap-sm) 0 0",
                    borderTop: "1px solid var(--line)",
                    display: "grid",
                    gap: "0.35rem",
                  }}
                >
                  {item.points.map((point) => (
                    <li
                      key={point}
                      style={{
                        display: "flex",
                        gap: "0.6em",
                        fontSize: "var(--step--1)",
                        color: "color-mix(in oklab, var(--paper) 74%, transparent)",
                      }}
                    >
                      <span aria-hidden style={{ color: "var(--accent)" }}>
                        ／
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
