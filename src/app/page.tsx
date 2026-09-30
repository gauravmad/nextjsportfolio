import { Approach } from "@/components/sections/approach";
import { Contact } from "@/components/sections/contact";
import { Experience } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { Impact } from "@/components/sections/impact";
import { Stack } from "@/components/sections/stack";
import { Work } from "@/components/sections/work";
import { Workflows } from "@/components/sections/workflows";
import { SiteChrome } from "@/components/site/site-chrome";
import { SmoothScroll } from "@/components/site/smooth-scroll";

export default function Home() {
  return (
    <SmoothScroll>
      <SiteChrome />
      <main id="main">
        <Hero />
        <Approach />
        <Work />
        <Workflows />
        <Impact />
        <Experience />
        <Stack />
        <Contact />
      </main>
    </SmoothScroll>
  );
}
