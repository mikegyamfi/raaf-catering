import type { ReactNode } from "react";
import { RevealText } from "@/components/motion/Reveal";
import { Illo as Illustration } from "@/components/illustrations/Illo";
import type { IllustrationName } from "@/components/illustrations";

/** Opening block for inner pages: oversized title, a short line, a drawing that floats in the light. */
export function PageIntro({ title, lead, illustration, children }: { title: string; lead: string; illustration: IllustrationName; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden pb-16 pt-36 md:pb-24 md:pt-48">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_80%_at_90%_0%,rgba(255,232,178,0.75),rgba(255,236,190,0)_70%)]" />
      <div className="shell relative grid gap-10 md:grid-cols-12 md:items-end md:gap-[var(--gutter)]">
        <div className="md:col-span-8">
          <RevealText as="h1" by="words" immediate className="text-step-6 md:text-[clamp(2.75rem,1rem+5.8vw,6.75rem)]">
            {title}
          </RevealText>
          <RevealText immediate delay={0.2} className="measure mt-8 text-step-1 leading-[1.55] text-cocoa/80">
            {lead}
          </RevealText>
          {children}
        </div>
        <div className="hidden md:col-span-3 md:col-start-10 md:block">
          <Illustration name={illustration} className="float-soft ml-auto w-full max-w-[260px] drop-shadow-[0_30px_30px_rgba(42,26,17,0.18)]" />
        </div>
      </div>
    </section>
  );
}
