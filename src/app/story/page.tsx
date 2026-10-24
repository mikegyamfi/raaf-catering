import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";
import { RevealText, RevealMask, RevealGroup } from "@/components/motion/Reveal";
import { Photo } from "@/components/ui/Photo";
import { BakeStory } from "@/components/story/BakeStory";
import { ButterMelt } from "@/components/sections/ButterMelt";
import { OrderCta } from "@/components/sections/OrderCta";
import { RisingDough } from "@/components/sections/RisingDough";
import { ownerAlt } from "@/components/sections/AboutTeaser";
import { Illo as Illustration } from "@/components/illustrations/Illo";
import { about, business, promises, photos } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our story",
  description: about.paragraphs[0],
  alternates: { canonical: "/story/" },
};

export default function StoryPage() {
  return (
    <>
      <PageIntro title="Our story" lead="A home kitchen, a love of feeding people, and a simple belief: good food brings people together." illustration="loaf" />

      {/* Her portrait: given room to breathe */}
      <section className="pb-24 md:pb-36" aria-labelledby="story-about">
        <div className="shell grid gap-12 md:grid-cols-12 md:gap-[var(--gutter)]">
          <div className="md:col-span-6">
            <RevealMask className="group">
              <Photo src={photos.owner.src} alt={ownerAlt()} className="aspect-[4/5]" priority />
            </RevealMask>
          </div>
          <div className="md:col-span-5 md:col-start-8 md:pt-24">
            <RevealText as="h2" id="story-about" className="text-step-5">
              {about.title}
            </RevealText>
            {about.paragraphs.map((p, i) => (
              <RevealText key={i} className="measure mt-8 text-step-1 leading-[1.6] text-cocoa/85" delay={0.08 * i}>
                {p}
              </RevealText>
            ))}
            <p className="mt-12 font-display text-step-4 font-bold leading-[1.02] tracking-[-0.035em] text-crust-deep">{business.priority}</p>
          </div>
        </div>
      </section>

      <BakeStory />

      <section className="py-28 md:py-40" aria-labelledby="why-title">
        <div className="shell grid gap-12 md:grid-cols-12 md:gap-[var(--gutter)]">
          <div className="md:col-span-5">
            <RevealText as="h2" id="why-title" className="text-step-6">
              {about.whyTitle}
            </RevealText>
            <RevealText className="measure mt-8 text-step-1 leading-[1.6] text-cocoa/85" delay={0.1}>
              {about.why}
            </RevealText>
            <RisingDough className="mt-12 w-[70%] max-w-[340px]" />
          </div>
          <RevealGroup as="ul" className="grid gap-px self-start overflow-hidden rounded-[28px] bg-cocoa/10 md:col-span-6 md:col-start-7 sm:grid-cols-2">
            {promises.map((p) => (
              <li key={p.title} data-stagger className="bg-flour p-8">
                <Illustration name={p.illustration} className="h-20 w-20" />
                <h3 className="mt-6 text-step-2">{p.title}</h3>
                <p className="mt-3 text-cocoa/75">{p.body}</p>
              </li>
            ))}
          </RevealGroup>
        </div>
      </section>

      <ButterMelt from="var(--flour)" to="var(--cocoa)" />
      <OrderCta />
    </>
  );
}
