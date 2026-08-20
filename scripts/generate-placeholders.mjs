/**
 * Generates the placeholder "full-page screenshots" used by the work carousel
 * and the feature band.
 *
 * These stand in until real captures exist. Drop real full-page screenshots
 * into `public/work/` using the same filenames and ratios (1200x2400 for the
 * cards, 1600x1000 for the feature band), then delete this script — nothing in
 * the app imports it.
 *
 * Output is WebP rather than SVG on purpose: next/image refuses to optimize
 * SVG without the `dangerouslyAllowSVG` escape hatch, so shipping raster here
 * means the image pipeline behaves identically once real captures drop in.
 *
 *   node scripts/generate-placeholders.mjs
 */
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "work");

const W = 1200;
const H = 2400;

/** Keep slugs and accents in sync with lib/projects.ts. */
const subjects = [
  { slug: "atelier-norde", accent: "#C6F02E", theme: "dark", label: "ATELIER NORDE", kind: "editorial" },
  { slug: "verdant-supply", accent: "#23C79A", theme: "light", label: "VERDANT SUPPLY", kind: "table" },
  { slug: "kinetic-athletics", accent: "#FF6A2B", theme: "dark", label: "KINETIC", kind: "grid" },
  { slug: "maison-lumiere", accent: "#8A6BFF", theme: "light", label: "MAISON LUMIÈRE", kind: "configurator" },
  { slug: "northbound-coffee", accent: "#E0A32E", theme: "dark", label: "NORTHBOUND", kind: "grid" },
  { slug: "ferro-and-co", accent: "#3E86FF", theme: "light", label: "FERRO & CO.", kind: "table" },
];

/**
 * Per-theme drawing tokens.
 *
 * The first version of this script used 4–16% white on near-black, which is
 * roughly what a real dark UI does — but a card preview is displayed at a
 * fraction of full size, and at that scale those values collapse into solid
 * black. These are deliberately punchier so the mockups still read as a
 * webpage when shrunk into the carousel.
 */
const themes = {
  dark: {
    bg: "#0B0B0F",
    panel: "#FFFFFF",
    panelOpacity: 0.09,
    chrome: 0.14,
    heading: 0.82,
    body: 0.4,
    faint: 0.2,
    hairline: 0.12,
  },
  light: {
    bg: "#F4F2EE",
    panel: "#101018",
    panelOpacity: 0.05,
    chrome: 0.08,
    heading: 0.86,
    body: 0.42,
    faint: 0.16,
    hairline: 0.12,
  },
};

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function makeDraw(t) {
  const fg = t.panel;

  /** Rounded block in the theme's foreground colour. */
  const block = (x, y, w, h, opacity = t.body, r = 10, fill = fg) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" opacity="${opacity}"/>`;

  /** A run of text-like bars, decreasing in length. */
  const lines = (x, y, w, count, { gap = 26, height = 12, opacity = t.body } = {}) => {
    let out = "";
    for (let i = 0; i < count; i++) {
      const ratio = i === count - 1 ? 0.52 : 0.78 + ((i * 43) % 22) / 100;
      out += block(x, y + i * gap, Math.min(w * ratio, w), height, opacity, height / 2);
    }
    return out;
  };

  return { block, lines, fg };
}

function productGrid(y, accent, t, cols, rows) {
  const { block } = makeDraw(t);
  const pad = 80;
  const gutter = 24;
  const cw = (W - pad * 2 - gutter * (cols - 1)) / cols;
  const ch = cols > 3 ? 240 : 330;
  let out = "";
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = pad + c * (cw + gutter);
      const yy = y + r * (ch + 84);
      out += block(x, yy, cw, ch, t.panelOpacity + 0.05, 14);
      out += `<circle cx="${x + cw / 2}" cy="${yy + ch / 2 - 8}" r="${cw * 0.27}" fill="${accent}" opacity="${0.3 + ((r + c) % 3) * 0.16}"/>`;
      out += block(x, yy + ch + 18, cw * 0.72, 13, t.body, 6);
      out += block(x, yy + ch + 42, cw * 0.34, 13, 0.9, 6, accent);
    }
  }
  return out;
}

function dataTable(y, accent, t, rows = 10) {
  const { block } = makeDraw(t);
  const pad = 80;
  const inner = W - pad * 2;
  let out = block(pad, y, inner, 58, t.chrome, 10);
  for (let i = 0; i < 4; i++) {
    out += block(pad + 28 + i * ((inner - 56) / 4), y + 23, 80, 12, t.body + 0.15, 6);
  }
  for (let r = 0; r < rows; r++) {
    const yy = y + 58 + 10 + r * 60;
    out += block(pad, yy, inner, 52, r % 2 ? t.panelOpacity * 0.5 : t.panelOpacity, 8);
    out += block(pad + 28, yy + 19, 150, 14, t.heading * 0.6, 7);
    out += block(pad + 28 + (inner - 56) / 4, yy + 20, 92, 13, t.body, 6);
    out += block(pad + 28 + ((inner - 56) / 4) * 2, yy + 20, 68, 13, t.body, 6);
    out += block(W - pad - 100, yy + 16, 72, 20, 0.85, 10, accent);
  }
  return out;
}

function configurator(y, accent, t) {
  const { block, lines } = makeDraw(t);
  const pad = 80;
  let out = block(pad, y, 620, 560, t.panelOpacity + 0.03, 16);
  out += `<circle cx="${pad + 310}" cy="${y + 280}" r="160" fill="${accent}" opacity="0.22"/>`;
  out += `<circle cx="${pad + 310}" cy="${y + 280}" r="92" fill="${accent}" opacity="0.55"/>`;

  const ox = pad + 660;
  out += block(ox, y + 8, 300, 22, t.heading * 0.8, 11);
  out += lines(ox, y + 48, 340, 1, { height: 12, opacity: t.body });
  for (let i = 0; i < 4; i++) {
    const yy = y + 104 + i * 106;
    out += block(ox, yy, 360, 84, t.panelOpacity + 0.04, 12);
    out += block(ox + 20, yy + 20, 130, 13, t.heading * 0.7, 6);
    out += block(ox + 20, yy + 48, 195, 11, t.body, 5);
    for (let s = 0; s < 3; s++) {
      out += `<circle cx="${ox + 278 + s * 30}" cy="${yy + 42}" r="11" fill="${accent}" opacity="${s === i % 3 ? 0.95 : 0.28}"/>`;
    }
  }
  out += block(ox, y + 540, 360, 58, 0.95, 12, accent);
  return out;
}

function svg({ slug, accent, theme, label, kind }) {
  const t = themes[theme];
  const { block, lines } = makeDraw(t);
  const parts = [];

  parts.push(`<rect width="${W}" height="${H}" fill="${t.bg}"/>`);
  parts.push(`<rect width="${W}" height="${H}" fill="url(#wash-${slug})"/>`);

  // --- sticky nav
  parts.push(block(0, 0, W, 78, t.chrome, 0));
  parts.push(
    `<text x="80" y="48" font-family="Helvetica,Arial,sans-serif" font-size="20" font-weight="700" letter-spacing="3" fill="${t.panel}" opacity="${t.heading}">${esc(label)}</text>`,
  );
  for (let i = 0; i < 4; i++) parts.push(block(W - 470 + i * 86, 33, 58, 12, t.body + 0.1, 6));
  parts.push(`<circle cx="${W - 96}" cy="39" r="16" fill="${accent}" opacity="0.95"/>`);

  // --- hero type
  parts.push(block(80, 180, 950, 84, t.heading, 8));
  parts.push(block(80, 286, 700, 84, t.heading, 8));
  parts.push(block(80, 392, 430, 84, 0.9, 8, accent));
  parts.push(lines(80, 526, 560, 3, { gap: 30, height: 14 }));
  parts.push(block(80, 650, 220, 60, 0.95, 30, accent));
  parts.push(block(320, 650, 180, 60, t.chrome + 0.06, 30));

  // --- hero visual
  parts.push(block(80, 780, W - 160, 600, t.panelOpacity, 20));
  parts.push(`<circle cx="${W / 2}" cy="1080" r="215" fill="${accent}" opacity="0.28"/>`);
  parts.push(`<circle cx="${W / 2 + 160}" cy="990" r="92" fill="${accent}" opacity="0.5"/>`);

  // --- section heading
  parts.push(block(80, 1452, 250, 14, 0.9, 7, accent));
  parts.push(block(80, 1496, 640, 44, t.heading, 8));

  // --- body
  if (kind === "table") parts.push(dataTable(1596, accent, t));
  else if (kind === "configurator") parts.push(configurator(1596, accent, t));
  else parts.push(productGrid(1596, accent, t, kind === "grid" ? 4 : 3, 1));

  // --- footer
  parts.push(block(0, H - 300, W, 300, t.chrome, 0));
  parts.push(block(80, H - 236, 340, 32, t.heading * 0.85, 8));
  for (let c = 0; c < 3; c++) parts.push(lines(560 + c * 200, H - 236, 160, 4, { gap: 26, height: 11 }));
  parts.push(block(80, H - 92, W - 160, 2, t.hairline, 0));

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)} site preview">
  <defs>
    <radialGradient id="wash-${slug}" cx="74%" cy="6%" r="72%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  ${parts.join("\n  ")}
</svg>
`;
}

/* ---------------------------------------------------------------------------
   Wide feature image — the full-bleed band that scales down on scroll.
   --------------------------------------------------------------------------- */

const FW = 1600;
const FH = 1000;

function wideSvg() {
  const accent = "#C6F02E";
  const t = themes.dark;
  const { block } = makeDraw(t);
  const pad = 56;
  const parts = [`<rect width="${FW}" height="${FH}" fill="${t.bg}"/>`];
  parts.push(`<rect width="${FW}" height="${FH}" fill="url(#feature-wash)"/>`);

  // app chrome
  parts.push(block(pad, pad, FW - pad * 2, FH - pad * 2, t.panelOpacity, 18));
  parts.push(block(pad, pad, FW - pad * 2, 54, t.chrome, 18));
  for (let i = 0; i < 3; i++) {
    parts.push(`<circle cx="${pad + 32 + i * 24}" cy="${pad + 27}" r="7" fill="${t.panel}" opacity="0.3"/>`);
  }
  parts.push(block(pad + 140, pad + 17, 440, 20, t.chrome + 0.06, 10));

  // sidebar
  const sx = pad + 22;
  const sy = pad + 78;
  const sh = FH - pad * 2 - 100;
  parts.push(block(sx, sy, 224, sh, t.panelOpacity + 0.03, 12));
  for (let i = 0; i < 7; i++) {
    const on = i === 1;
    parts.push(block(sx + 18, sy + 28 + i * 48, on ? 160 : 124, 14, on ? 0.95 : t.body, 7, on ? accent : t.panel));
  }

  // KPI cards
  const cx = sx + 252;
  const gw = FW - pad * 2 - 300;
  const cw = (gw - 48) / 3;
  for (let i = 0; i < 3; i++) {
    const x = cx + i * (cw + 24);
    parts.push(block(x, sy, cw, 152, t.panelOpacity + 0.04, 14));
    parts.push(block(x + 24, sy + 28, 100, 13, t.body, 6));
    parts.push(block(x + 24, sy + 60, 156, 36, i === 0 ? 0.95 : t.heading, 8, i === 0 ? accent : t.panel));
    parts.push(block(x + 24, sy + 112, 84, 11, t.faint, 5));
  }

  // chart
  const gy = sy + 180;
  const gh = sh - 180;
  parts.push(block(cx, gy, gw, gh, t.panelOpacity + 0.02, 14));
  for (let i = 1; i < 6; i++) {
    parts.push(block(cx + 30, gy + 26 + i * ((gh - 80) / 6), gw - 60, 2, t.hairline, 0));
  }
  let path = "";
  const pts = 28;
  for (let i = 0; i < pts; i++) {
    const px = cx + 30 + (i * (gw - 60)) / (pts - 1);
    const p = i / (pts - 1);
    const wave = Math.sin(p * 5.2) * 0.15 + Math.sin(p * 2.1) * 0.1;
    const py = gy + gh - 44 - (p * 0.6 + wave + 0.16) * (gh - 110);
    path += `${i === 0 ? "M" : "L"}${px.toFixed(1)},${py.toFixed(1)} `;
  }
  parts.push(`<path d="${path}L${cx + gw - 30},${gy + gh - 30} L${cx + 30},${gy + gh - 30} Z" fill="${accent}" opacity="0.16"/>`);
  parts.push(`<path d="${path}" fill="none" stroke="${accent}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity="1"/>`);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${FW}" height="${FH}" viewBox="0 0 ${FW} ${FH}" role="img" aria-label="Commerce analytics dashboard">
  <defs>
    <radialGradient id="feature-wash" cx="82%" cy="8%" r="80%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  ${parts.join("\n  ")}
</svg>
`;
}

mkdirSync(outDir, { recursive: true });

async function emit(name, markup, w, h, quality) {
  const file = join(outDir, name);
  const info = await sharp(Buffer.from(markup, "utf8"), { density: 96 })
    .resize(w, h, { fit: "fill" })
    .webp({ quality, effort: 5 })
    .toFile(file);
  console.log("wrote", file.replace(root + "/", ""), `${info.width}x${info.height}`, `${(info.size / 1024).toFixed(0)}kB`);
}

for (const subject of subjects) {
  await emit(`${subject.slug}.webp`, svg(subject), W, H, 82);
}
await emit("feature-wide.webp", wideSvg(), FW, FH, 84);
