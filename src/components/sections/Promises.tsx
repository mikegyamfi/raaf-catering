import { promises, business } from "@/lib/content";
import { Illo as Illustration } from "@/components/illustrations/Illo";
import { RevealText, RevealGroup } from "@/components/motion/Reveal";
import { MilkPour } from "./MilkPour";

/** "Why choose us?", in her words, beside a glass of milk filling as you read. */
export function Promises() {
  return (
    <section className="relative overflow-hidden py-28 md:py-40" aria-labelledby="promise-title">
      <div className="shell grid gap-14 md:grid-cols-12 md:gap-[var(--gutter)]">
        <div className="md:col-span-7">
          <RevealText as="h2" id="promise-title" className="max-w-[12ch] text-step-6">
            {business.priority}
          </RevealText>
          <RevealText className="measure mt-8 text-step-1 leading-[1.55] text-cocoa/80" delay={0.1}>
            We are passionate about good food and customer satisfaction. Here is what that means every time you order.
          </RevealText>

          <RevealGroup as="ul" className="mt-16 grid gap-x-[var(--gutter)] gap-y-12 sm:grid-cols-2">
            {promises.map((p) => (
              <li key={p.title} data-stagger className="group">
                <span className="grid h-20 w-20 place-items-center rounded-[22px] bg-flour-deep transition-transform duration-500 ease-spring group-hover:-rotate-6 group-hover:scale-110">
                  <Illustration name={p.illustration} className="h-16 w-16" />
                </span>
                <h3 className="mt-5 text-step-2">{p.title}</h3>
                <p className="mt-3 max-w-[38ch] text-cocoa/75">{p.body}</p>
              </li>
            ))}
          </RevealGroup>
        </div>

        <div className="relative md:col-span-5">
          <div className="md:sticky md:top-[18svh]">
            <MilkPour className="mx-auto aspect-[320/440] w-[min(70vw,360px)] md:w-[min(100%,52svh)]" />
          </div>
        </div>
      </div>
    </section>
  );
}
