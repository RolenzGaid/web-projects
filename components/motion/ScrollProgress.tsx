/**
 * Reading-progress bar.
 *
 * Deliberately not a Client Component: the animation is driven entirely by
 * `animation-timeline: scroll(root block)` in globals.css, so this ships zero
 * JavaScript and never runs a scroll handler. Browsers without scroll-driven
 * animations hide it rather than approximate it with JS.
 */
export function ScrollProgress() {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: "0 0 auto 0",
        height: "2px",
        zIndex: 60,
        pointerEvents: "none",
      }}
    >
      <div
        className="scroll-progress"
        style={{
          height: "100%",
          background:
            "linear-gradient(90deg, var(--accent), var(--accent-2))",
        }}
      />
    </div>
  );
}
