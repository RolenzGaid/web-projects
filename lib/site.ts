/**
 * Single source of truth for personal / contact details.
 *
 * TODO(you): every value in this file is yours to replace. The stats and
 * client names below are illustrative placeholders — swap in real numbers
 * before this goes in front of a client.
 */

export const site = {
  name: "Rolenz Gaid",
  initials: "RG",
  role: "Senior Web Developer",
  secondRole: "E-commerce Expert",
  tagline:
    "I build fast, high-converting storefronts — headless commerce, custom platform integrations, and interfaces that feel expensive.",
  location: "Remote · Worldwide",
  // TODO(you): replace with the address you want published. This file ships to
  // a public repo, so pick an inbox you're happy to have crawled.
  email: "hello@ryzeagency.com",
  availability: "Available for select projects",
  social: [
    { label: "GitHub", href: "https://github.com/RolenzGaid" },
    { label: "LinkedIn", href: "#" },
    { label: "Dribbble", href: "#" },
    { label: "Email", href: "mailto:hello@ryzeagency.com" },
  ],
} as const;

export const nav = [
  { label: "Work", href: "#work", id: "work" },
  { label: "Capabilities", href: "#capabilities", id: "capabilities" },
  { label: "Process", href: "#process", id: "process" },
  { label: "Contact", href: "#contact", id: "contact" },
] as const;

/** Headline metrics for the stats band. TODO(you): use real figures. */
export const stats = [
  { value: 9, suffix: "+", label: "Years shipping for the web" },
  { value: 120, suffix: "M+", prefix: "$", label: "Online revenue influenced" },
  { value: 74, suffix: "", label: "Storefronts launched" },
  { value: 98, suffix: "/100", label: "Median Lighthouse score" },
] as const;

export const platforms = [
  "Shopify Plus",
  "Hydrogen",
  "Next.js",
  "BigCommerce",
  "WooCommerce",
  "Magento",
  "Stripe",
  "Sanity",
  "Contentful",
  "Klaviyo",
  "Algolia",
  "Vercel",
] as const;

export const capabilities = [
  {
    title: "Headless Commerce",
    body: "Storefront API builds on Hydrogen and Next.js — decoupled front ends that keep the checkout you already trust.",
    points: ["Shopify Storefront API", "Hydrogen / Oxygen", "ISR & edge caching"],
  },
  {
    title: "Platform Migration",
    body: "Magento and WooCommerce escapes with URL parity, SEO retention, and zero-downtime cutovers.",
    points: ["301 mapping", "Catalog transforms", "Historical order import"],
  },
  {
    title: "Conversion Engineering",
    body: "Core Web Vitals work, checkout instrumentation, and the boring measurement that makes A/B tests trustworthy.",
    points: ["INP & LCP budgets", "Server-side GTM", "Experiment plumbing"],
  },
  {
    title: "Systems Integration",
    body: "ERP, PIM, and 3PL wiring — idempotent jobs, replayable webhooks, and reconciliation you can audit.",
    points: ["NetSuite / SAP", "Webhook queues", "Inventory sync"],
  },
  {
    title: "Design Engineering",
    body: "Motion systems and design tokens built in the browser, so the shipped build matches the pitch deck.",
    points: ["Fluid type scales", "Compositor-only motion", "Design tokens"],
  },
  {
    title: "Subscriptions & B2B",
    body: "Recurring billing, net terms, tiered pricing, and quote flows for merchants selling to businesses.",
    points: ["Stripe Billing", "Company accounts", "Approval workflows"],
  },
] as const;

export const process = [
  {
    step: "01",
    title: "Audit",
    body: "I start in your analytics and your codebase. Two weeks of measurement beats six months of guessing, and it tells us which pages actually carry the revenue.",
  },
  {
    step: "02",
    title: "Architect",
    body: "Platform decision, data model, and integration map — written down, with the trade-offs made explicit so nobody relitigates them in month four.",
  },
  {
    step: "03",
    title: "Build",
    body: "Weekly deploys to a preview URL from day one. You watch it come together instead of waiting for a reveal.",
  },
  {
    step: "04",
    title: "Launch & tune",
    body: "Cutover, then the unglamorous part: watching real traffic, closing the gap between the lab score and the field data.",
  },
] as const;
