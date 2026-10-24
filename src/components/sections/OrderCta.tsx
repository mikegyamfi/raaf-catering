import { whatsappHref } from "@/lib/content";
import { Illo as Illustration } from "@/components/illustrations/Illo";
import { Steam } from "@/components/motion/Steam";
import { RevealText } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";

/** Closing call to order, lit by a breathing oven glow. */
export function OrderCta() {
  const wa = whatsappHref("Hello RAAF, I'm planning an event and would love to talk about catering.");
  return (
    <section data-dark className="on-dark relative overflow-hidden bg-cocoa py-28 text-flour md:py-40" aria-labelledby="cta-title">
      <div aria-hidden className="oven-glow pointer-events-none absolute left-1/2 top-[58%] h-[110vmin] w-[110vmin] -translate-x-1/2 -translate-y-1/2 rounded-full" />
      <div className="shell relative flex flex-col items-center text-center">
        <div className="relative h-44 w-44 md:h-56 md:w-56">
          <Steam className="absolute -top-12 left-1/2 h-20 w-16 -translate-x-1/2 text-butter-soft/80" />
          <Illustration name="loaf" className="h-full w-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.35)]" />
        </div>
        <RevealText as="h2" id="cta-title" className="mt-6 max-w-[14ch] text-step-6">
          Planning something special?
        </RevealText>
        <RevealText className="measure mt-6 text-step-1 leading-[1.55] text-flour/80" delay={0.1}>
          Tell us the date, how many guests, and what you&rsquo;d love on the table. We&rsquo;ll help you plan the rest.
        </RevealText>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button href={wa ?? "/order/"} variant="butter">
            {wa ? "Chat on WhatsApp" : "Start an order"}
          </Button>
          <Button href="/order/" variant="light">
            Send an enquiry
          </Button>
        </div>
      </div>
    </section>
  );
}
