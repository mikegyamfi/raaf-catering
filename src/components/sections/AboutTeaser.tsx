import { about, business, photos, isPlaceholder } from "@/lib/content";
import { RevealText, RevealMask } from "@/components/motion/Reveal";
import { Photo } from "@/components/ui/Photo";
import { Button } from "@/components/ui/Button";
import { RisingDough } from "./RisingDough";

export function ownerAlt() {
  return isPlaceholder(business.ownerName) ? "The founder of RAAF in her kitchen" : `${business.ownerName}, founder of RAAF, in her kitchen`;
}

/** "About RAAF": her own words, a portrait slot and dough proving beside them. */
export function AboutTeaser() {
  return (
    <section className="relative overflow-hidden pb-24 pt-8 md:py-40" aria-labelledby="about-title">
      <div className="shell grid gap-14 md:grid-cols-12 md:gap-[var(--gutter)]">
        <div className="md:col-span-5">
          <RevealMask className="group">
            <Photo src={photos.owner.src} alt={ownerAlt()} className="aspect-[4/5]" />
          </RevealMask>
          <RisingDough className="-mt-24 ml-auto w-[62%] max-w-[320px] md:-mr-10" />
        </div>

        <div className="md:col-span-6 md:col-start-7 md:pt-16">
          <RevealText as="h2" id="about-title" className="text-step-6">
            Good food brings people together.
          </RevealText>
          <RevealText className="measure mt-10 text-step-1 leading-[1.6] text-cocoa/85" delay={0.1}>
            {about.paragraphs[0]}
          </RevealText>
          <RevealText className="measure mt-6 text-cocoa/75" delay={0.15}>
            {about.paragraphs[1]}
          </RevealText>
          <p className="mt-12 font-display text-step-3 font-bold tracking-[-0.03em] text-crust-deep">{business.mood}</p>
          <div className="mt-10">
            <Button href="/story/" variant="ghost">
              Read our story
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
