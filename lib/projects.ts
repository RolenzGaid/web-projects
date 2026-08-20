export type Project = {
  slug: string;
  title: string;
  client: string;
  year: string;
  role: string;
  summary: string;
  /** Headline outcome shown on the card. TODO(you): real numbers only. */
  metric: { value: string; label: string };
  stack: string[];
  tags: string[];
  href: string;
  /**
   * Tall "screenshot" image. On hover the card scrolls through it, which reads
   * as a walkthrough of the live site. Swap the generated placeholders in
   * `public/work/` for real full-page captures at the same 1:2 ratio.
   */
  poster: string;
  posterWidth: number;
  posterHeight: number;
  /**
   * Optional muted preview clip. When present the card plays it on hover
   * instead of scrolling the poster. Keep these under ~2 MB and 6 seconds,
   * H.264 or WebM, and always ship a poster as the first frame.
   */
  video?: string;
  /** Drives the generated placeholder art and the card's accent glow. */
  accent: string;
};

export const projects: Project[] = [
  {
    slug: "atelier-norde",
    title: "Atelier Norde",
    client: "Scandinavian fashion label",
    year: "2025",
    role: "Lead front-end & headless architecture",
    summary:
      "A headless Hydrogen storefront for a 4,000-SKU fashion catalogue. Editorial lookbooks share a rendering path with the product grid, so merchandising never waits on a deploy.",
    metric: { value: "+38%", label: "mobile conversion" },
    stack: ["Hydrogen", "Shopify Storefront API", "Sanity", "Oxygen"],
    tags: ["Headless", "Fashion", "Editorial"],
    href: "#",
    poster: "/work/atelier-norde.webp",
    posterWidth: 1200,
    posterHeight: 2400,
    accent: "#C6F02E",
  },
  {
    slug: "verdant-supply",
    title: "Verdant Supply",
    client: "B2B horticulture wholesaler",
    year: "2025",
    role: "Platform lead",
    summary:
      "Net-terms ordering, company-level price lists, and a reorder flow built around the way buyers actually work: a spreadsheet paste box that resolves 400 SKUs at once.",
    metric: { value: "−61%", label: "order entry time" },
    stack: ["Next.js", "Shopify Plus", "NetSuite", "Algolia"],
    tags: ["B2B", "Integrations", "Wholesale"],
    href: "#",
    poster: "/work/verdant-supply.webp",
    posterWidth: 1200,
    posterHeight: 2400,
    accent: "#23C79A",
  },
  {
    slug: "kinetic-athletics",
    title: "Kinetic Athletics",
    client: "Performance sportswear",
    year: "2024",
    role: "Performance engineering",
    summary:
      "A Core Web Vitals rescue. The catalogue was fine; the third-party tag stack was not. Server-side tagging and a rebuilt image pipeline took LCP from 4.1s to 1.2s on 4G.",
    metric: { value: "1.2s", label: "LCP on 4G" },
    stack: ["Next.js", "Storefront API", "Server-side GTM", "Vercel"],
    tags: ["Performance", "Core Web Vitals"],
    href: "#",
    poster: "/work/kinetic-athletics.webp",
    posterWidth: 1200,
    posterHeight: 2400,
    accent: "#FF6A2B",
  },
  {
    slug: "maison-lumiere",
    title: "Maison Lumière",
    client: "Luxury lighting atelier",
    year: "2024",
    role: "Design engineering",
    summary:
      "A configurator for made-to-order fixtures — finish, length, and diffuser combine into 1,400 variants, priced live, rendered without a page reload.",
    metric: { value: "2.4×", label: "average order value" },
    stack: ["Next.js", "BigCommerce", "Three.js", "Contentful"],
    tags: ["Configurator", "Luxury", "Made-to-order"],
    href: "#",
    poster: "/work/maison-lumiere.webp",
    posterWidth: 1200,
    posterHeight: 2400,
    accent: "#8A6BFF",
  },
  {
    slug: "northbound-coffee",
    title: "Northbound Coffee",
    client: "Specialty roaster",
    year: "2023",
    role: "Full-stack",
    summary:
      "Subscription commerce with a grind-and-cadence picker that survives contact with real customers: pause, swap, skip, and gift, all without an email to support.",
    metric: { value: "−44%", label: "involuntary churn" },
    stack: ["Next.js", "Stripe Billing", "Shopify", "Klaviyo"],
    tags: ["Subscriptions", "Retention"],
    href: "#",
    poster: "/work/northbound-coffee.webp",
    posterWidth: 1200,
    posterHeight: 2400,
    accent: "#E0A32E",
  },
  {
    slug: "ferro-and-co",
    title: "Ferro & Co.",
    client: "Industrial hardware supplier",
    year: "2023",
    role: "Migration lead",
    summary:
      "Eighteen years of Magento 1, 62,000 SKUs, and a catalogue nobody had fully mapped. Migrated over a single weekend with URL parity and no measurable organic dip.",
    metric: { value: "0%", label: "organic traffic lost" },
    stack: ["Shopify Plus", "Next.js", "SAP", "Elasticsearch"],
    tags: ["Migration", "SEO", "Enterprise"],
    href: "#",
    poster: "/work/ferro-and-co.webp",
    posterWidth: 1200,
    posterHeight: 2400,
    accent: "#3E86FF",
  },
];
