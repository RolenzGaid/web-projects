/**
 * Motion capability detection + a single shared IntersectionObserver.
 *
 * One observer serves every reveal on the page. Forty components each newing
 * up their own observer works, but it also means forty separate sets of
 * callbacks the browser has to service; sharing one keeps scroll cheap.
 */

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * True when the browser can run scroll-driven animations natively, which keeps
 * scroll-linked motion entirely off the main thread. Chrome/Edge 115+ and
 * Safari 26+ qualify; older Safari and Firefox fall back to lib/scroll-fx.
 */
export function supportsScrollTimeline(): boolean {
  if (typeof window === "undefined" || !("CSS" in window) || !CSS.supports) {
    return false;
  }
  return CSS.supports("animation-timeline", "view()");
}

type RevealCallback = (entry: IntersectionObserverEntry) => void;

const callbacks = new WeakMap<Element, RevealCallback>();
let observer: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        callbacks.get(entry.target)?.(entry);
      }
    },
    {
      // Two deliberate choices here, both about elements that must never get
      // stranded at opacity 0:
      //
      // The huge TOP margin extends the root box far above the viewport, so an
      // element that is already scrolled past still counts as intersecting.
      // Without it, an element that goes from "below the fold" straight to
      // "above the fold" — anchor deep-link (`/#contact`), restored scroll
      // position, fast fling — never flips `isIntersecting`, so the observer
      // never fires a second time and the content stays invisible forever.
      // Such an element reveals off-screen, which costs nothing and means it
      // is already in place when the user scrolls back up.
      //
      // The -10% BOTTOM inset is the actual trigger line: an element reveals
      // once it reaches the top 90% of the viewport, so the motion reads as
      // "already happening" rather than starting right at the fold.
      rootMargin: "100000px 0px -10% 0px",
      // threshold stays 0. Any non-zero ratio is unreachable for an element
      // taller than the viewport (a 2000px section in an 800px window peaks at
      // 0.4, taller ones at less), which would leave exactly those elements
      // permanently invisible.
      threshold: 0,
    },
  );
  return observer;
}

/** Observe `el`; returns an unsubscribe function. */
export function observeReveal(el: Element, cb: RevealCallback): () => void {
  callbacks.set(el, cb);
  const io = getObserver();
  io.observe(el);
  return () => {
    io.unobserve(el);
    callbacks.delete(el);
  };
}

