import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";

/** Shared section header so every band shares one rhythm. */
export function SectionHead({
  eyebrow,
  title,
  intro,
  aside,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: string;
  aside?: ReactNode;
}) {
  return (
    <div className="row" style={{ marginBottom: "var(--gap-xl)" }}>
      <div className="col-12 col-lg-7">
        <Reveal>
          <p className="eyebrow" style={{ margin: "0 0 var(--gap-sm)" }}>
            {eyebrow}
          </p>
        </Reveal>
        <Reveal delay={90}>
          <h2
            className="display h-md balance"
            style={{ margin: 0, maxWidth: "22ch" }}
          >
            {title}
          </h2>
        </Reveal>
      </div>
      {(intro || aside) && (
        <div
          className="col-12 col-lg-5"
          style={{ display: "flex", alignItems: "flex-end" }}
        >
          <Reveal delay={180} style={{ width: "100%" }}>
            {intro ? (
              <p className="lede" style={{ margin: 0, maxWidth: "44ch" }}>
                {intro}
              </p>
            ) : null}
            {aside}
          </Reveal>
        </div>
      )}
    </div>
  );
}
