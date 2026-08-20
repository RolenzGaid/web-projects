import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray package-lock.json above this directory makes Turbopack guess the
  // wrong workspace root. Pinning it keeps the dev/build output clean.
  turbopack: {
    root: process.cwd(),
  },

  // NOTE: deliberately NOT setting `images.formats: ["image/avif", ...]`.
  // On Next 16.3.1 the optimizer's AVIF path returns a badly darkened image
  // for these posters — a light mockup came back with a mean top-strip pixel
  // of rgb(24,40,35) instead of rgb(205,217,211), while the WebP output of the
  // same source is pixel-correct and sharp's own AVIF encode of the same file
  // is fine. AVIF is opt-in (the default is `["image/webp"]`), so the default
  // is both correct and safe here. Worth re-testing on a future Next release
  // before enabling AVIF for the compression win.
};

export default nextConfig;
