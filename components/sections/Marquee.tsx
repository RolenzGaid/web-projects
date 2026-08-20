import { platforms } from "@/lib/site";

/**
 * Infinite platform marquee.
 *
 * Two identical tracks sit side by side and the pair translates by -100% of a
 * single track's width, so the seam lands exactly where the loop restarts.
 * It's one composited transform on a linear infinite keyframe — no JS, and it
 * pauses on hover so the names stay readable.
 */
export function Marquee() {
  const track = (
    <ul
      className="marquee__track"
      style={{ listStyle: "none", margin: 0, padding: 0 }}
    >
      {platforms.map((name) => (
        <li
          key={name}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--gap-lg)",
            fontSize: "var(--step-2)",
            fontWeight: 500,
            letterSpacing: "-0.01em",
            color: "color-mix(in oklab, var(--paper) 72%, transparent)",
            whiteSpace: "nowrap",
          }}
        >
          {name}
          <span aria-hidden style={{ color: "var(--accent)", fontSize: "0.6em" }}>
            ✦
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      style={{
        paddingBlock: "clamp(1.5rem, 4vh, 3rem)",
        borderBlock: "1px solid var(--line)",
        background: "var(--ink-sunken)",
      }}
    >
      <div className="marquee">
        {track}
        {/* Duplicate is decorative: screen readers already read the first. */}
        <div aria-hidden style={{ display: "flex" }}>
          {track}
        </div>
      </div>
    </div>
  );
}
