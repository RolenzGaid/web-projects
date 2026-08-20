import { ProjectCarousel } from "@/components/ProjectCarousel";
import { SectionHead } from "@/components/sections/SectionHead";
import { projects } from "@/lib/projects";

export function Work() {
  return (
    <section id="work" className="section">
      <div className="shell">
        <SectionHead
          eyebrow={`Selected work · ${projects.length} builds`}
          title={
            <>
              Storefronts that carry{" "}
              <em style={{ fontStyle: "italic", color: "var(--accent)" }}>
                real
              </em>{" "}
              revenue
            </>
          }
          intro="Drag, swipe, or use the arrow keys. Hover a card and the preview scrolls the full page, so you can see how a build actually reads before opening a case study."
        />
        <ProjectCarousel />
      </div>
    </section>
  );
}
