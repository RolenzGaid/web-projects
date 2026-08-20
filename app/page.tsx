import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { StatsBand } from "@/components/sections/StatsBand";
import { Work } from "@/components/sections/Work";
import { FeatureBand } from "@/components/sections/FeatureBand";
import { Capabilities } from "@/components/sections/Capabilities";
import { Process } from "@/components/sections/Process";
import { Contact } from "@/components/sections/Contact";

/**
 * The page is a Server Component and stays one. Interactivity is pushed to the
 * leaves — the carousel, the reveal wrappers, the header — so the shell of the
 * site is static HTML and only the parts that genuinely need the browser ship
 * JavaScript.
 */
export default function Page() {
  return (
    <>
      <Hero />
      <Marquee />
      <StatsBand />
      <Work />
      <FeatureBand />
      <Capabilities />
      <Process />
      <Contact />
    </>
  );
}
