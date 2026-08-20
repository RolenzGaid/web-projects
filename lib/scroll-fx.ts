/**
 * Scroll-linked motion fallback.
 *
 * Only used when the browser lacks `animation-timeline` (see
 * lib/motion.ts#supportsScrollTimeline). Where it is supported, CSS in
 * globals.css does this work off the main thread and this module never runs.
 *
 * Design notes:
 * - One passive scroll listener and one rAF for the whole page, not one per
 *   element. Writes are batched inside the frame callback.
 * - Only elements currently intersecting the viewport are written to, so a
 *   long page with many layers costs the same as a short one.
 * - Reads (getBoundingClientRect) all happen before any writes, so we never
 *   force a synchronous layout mid-loop.
 */

type Kind = "parallax" | "media";

type Item = {
  el: HTMLElement;
  kind: Kind;
  /** Parallax travel in px, resolved from the element's --depth (vh). */
  depth: number;
  /** Starting scale for media settle. */
  from: number;
  visible: boolean;
};

const items = new Map<HTMLElement, Item>();
let io: IntersectionObserver | null = null;
let frame = 0;
let listening = false;

function viewportH() {
  return window.innerHeight || document.documentElement.clientHeight;
}

/** Resolve a `--depth` written in vh (e.g. "6vh") into px. */
function resolveDepth(el: HTMLElement): number {
  const raw = getComputedStyle(el).getPropertyValue("--depth").trim();
  const n = parseFloat(raw);
  if (Number.isNaN(n)) return 0.04 * viewportH();
  return raw.endsWith("vh") ? (n / 100) * viewportH() : n;
}

function resolveFrom(el: HTMLElement): number {
  const raw = getComputedStyle(el).getPropertyValue("--media-from").trim();
  const n = parseFloat(raw);
  return Number.isNaN(n) ? 1.14 : n;
}

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

function update() {
  frame = 0;
  const vh = viewportH();

  // --- read phase ---------------------------------------------------------
  const work: { item: Item; progress: number }[] = [];
  for (const item of items.values()) {
    if (!item.visible) continue;
    const rect = item.el.getBoundingClientRect();
    // 0 when the element's top edge sits at the viewport bottom, 1 when its
    // bottom edge passes the viewport top — the same span CSS `view()` covers.
    const progress = clamp01((vh - rect.top) / (vh + rect.height));
    work.push({ item, progress });
  }

  // --- write phase --------------------------------------------------------
  for (const { item, progress } of work) {
    if (item.kind === "parallax") {
      const y = item.depth - progress * item.depth * 2;
      item.el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
    } else {
      // Mirror the CSS range (entry 15% → cover 45%): settle early, then hold.
      const t = clamp01((progress - 0.15) / 0.35);
      const scale = item.from + (1 - item.from) * t;
      item.el.style.transform = `scale(${scale.toFixed(4)})`;
    }
  }
}

function schedule() {
  if (frame) return;
  frame = requestAnimationFrame(update);
}

function getIO(): IntersectionObserver {
  if (io) return io;
  io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const item = items.get(entry.target as HTMLElement);
        if (item) item.visible = entry.isIntersecting;
      }
      schedule();
    },
    { rootMargin: "20% 0px 20% 0px" },
  );
  return io;
}

function ensureListeners() {
  if (listening) return;
  listening = true;
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
}

function onResize() {
  for (const item of items.values()) {
    item.depth = resolveDepth(item.el);
  }
  schedule();
}

function teardownIfEmpty() {
  if (items.size > 0) return;
  window.removeEventListener("scroll", schedule);
  window.removeEventListener("resize", onResize);
  listening = false;
  io?.disconnect();
  io = null;
  if (frame) {
    cancelAnimationFrame(frame);
    frame = 0;
  }
}

/**
 * Register an element for JS-driven scroll motion.
 * `kind: "media"` expects to be given the inner element that should scale.
 */
export function registerScrollFx(el: HTMLElement, kind: Kind): () => void {
  const item: Item = {
    el,
    kind,
    depth: kind === "parallax" ? resolveDepth(el) : 0,
    from: kind === "media" ? resolveFrom(el) : 1,
    visible: false,
  };
  items.set(el, item);
  ensureListeners();
  getIO().observe(el);
  schedule();

  return () => {
    io?.unobserve(el);
    items.delete(el);
    el.style.transform = "";
    teardownIfEmpty();
  };
}
