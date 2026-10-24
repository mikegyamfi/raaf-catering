import { Hero } from "@/components/hero/Hero";
import { Signature } from "@/components/sections/Signature";
import { BakeStory } from "@/components/story/BakeStory";
import { Promises } from "@/components/sections/Promises";
import { ButterMelt } from "@/components/sections/ButterMelt";
import { MenuPreview } from "@/components/sections/MenuPreview";
import { Packs } from "@/components/sections/Packs";
import { AboutTeaser } from "@/components/sections/AboutTeaser";
import { GalleryTeaser } from "@/components/sections/GalleryTeaser";
import { OrderCta } from "@/components/sections/OrderCta";

export default function Home() {
  return (
    <>
      <Hero />
      <Signature />
      <BakeStory />
      <Promises />
      <ButterMelt />
      <MenuPreview />
      <Packs />
      <AboutTeaser />
      <GalleryTeaser />
      <OrderCta />
    </>
  );
}
