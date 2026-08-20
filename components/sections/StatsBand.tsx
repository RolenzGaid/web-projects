import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";
import { stats } from "@/lib/site";

export function StatsBand() {
  return (
    <section className="section" style={{ paddingBlock: "var(--gap-xl)" }}>
      <div className="shell">
        <div className="row">
          {stats.map((stat, i) => (
            <Reveal
              key={stat.label}
              className="col-6 col-lg-3"
              delay={i * 90}
            >
              <div
                style={{
                  paddingTop: "var(--gap-md)",
                  borderTop: "1px solid var(--line)",
                  height: "100%",
                }}
              >
                <p
                  className="display"
                  style={{
                    fontSize: "var(--step-4)",
                    margin: "0 0 0.3em",
                    letterSpacing: "-0.03em",
                  }}
                >
                  <CountUp
                    value={stat.value}
                    prefix={"prefix" in stat ? stat.prefix : ""}
                    suffix={stat.suffix}
                  />
                </p>
                <p
                  className="muted"
                  style={{ margin: 0, fontSize: "var(--step-0)", maxWidth: "22ch" }}
                >
                  {stat.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
