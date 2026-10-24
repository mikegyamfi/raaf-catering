"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { packs, priceLabel, whatsappHref } from "@/lib/content";
import { Illo as Illustration } from "@/components/illustrations/Illo";
import type { IllustrationName } from "@/components/illustrations";
import { Button } from "@/components/ui/Button";

const art: Record<string, IllustrationName> = {
  "meat pie": "pie",
  samosa: "samosa",
  "spring roll": "springRoll",
  "spring rolls": "springRoll",
  "gizzard kebab": "kebab",
  "ring doughnut": "doughnut",
  "chicken wings": "wings",
  "vanilla cake": "cake",
  "banana bread or cake": "bananaBread",
  "spring roll or samosa": "samosa",
  "sausage rolls": "sausageRoll",
  "sausage roll": "sausageRoll",
  "drop doughnuts": "bofrot",
  "gizzard or chicken": "kebab",
};

/**
 * Her six small-chops packs as open boxes. Desktop: the row slides sideways
 * while the section is pinned. Touch: a native swipeable row.
 */
export function Packs() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const track = el.querySelector<HTMLElement>(".pk-track")!;
      const mm = gsap.matchMedia();
      mm.add(`${MQ.desktop} and ${MQ.motion}`, () => {
        const distance = () => track.scrollWidth - track.clientWidth;
        const tween = gsap.to(track.querySelector(".pk-row"), {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: () => `+=${distance()}`, pin: true, scrub: 1, invalidateOnRefresh: true },
        });
        // Each box's lid lifts as it reaches the middle of the screen
        el.querySelectorAll<HTMLElement>(".pk-card").forEach((card) => {
          gsap.fromTo(
            card.querySelector(".pk-lid"),
            { rotateX: 0, yPercent: 0, opacity: 1 },
            { rotateX: -75, yPercent: -55, opacity: 0, ease: "power2.in", scrollTrigger: { trigger: card, containerAnimation: tween, start: "left 95%", end: "left 60%", scrub: true } },
          );
          gsap.from(card.querySelectorAll(".pk-food"), {
            y: 30,
            opacity: 0,
            stagger: 0.05,
            ease: "back.out(2)",
            scrollTrigger: { trigger: card, containerAnimation: tween, start: "left 85%", end: "left 60%", scrub: true },
          });
        });
      });
      // Without motion the boxes simply stand open
      mm.add(`not all and ${MQ.desktop}, ${MQ.reduce}`, () => {
        gsap.set(el.querySelectorAll(".pk-lid"), { display: "none" });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const wa = whatsappHref("Hello RAAF, I'd like to order small chops packs.");

  return (
    <section ref={root} className="relative overflow-hidden bg-flour py-24 md:flex md:min-h-[100svh] md:flex-col md:justify-center md:py-16" aria-labelledby="packs-title">
      <div className="shell flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 id="packs-title" className="text-step-5">
            Small chops packs
          </h2>
          <p className="measure mt-4 text-cocoa/75">Ready-made boxes for parties, meetings and gifts. Six combinations, each one a little celebration.</p>
        </div>
        <Button href={wa ?? "/order/"} variant="ghost">
          Order packs
        </Button>
      </div>

      <div className="pk-track mt-12 overflow-x-auto [scrollbar-width:none] md:overflow-visible" data-lenis-prevent-touch>
        <ol className="pk-row flex w-max snap-x snap-mandatory gap-5 px-[var(--gutter)] md:gap-8 md:pr-[20vw] lg:pl-[max(var(--gutter),calc((100vw-var(--page-max))/2+var(--gutter)))]">
          {packs.map((p, i) => (
            <li key={p.id} className="pk-card w-[78vw] max-w-[380px] snap-start [perspective:900px] md:w-[360px]">
              <div className="relative">
                {/* Box */}
                <div className="relative h-[230px] rounded-[22px] bg-[#e7c48d] shadow-[0_24px_40px_-24px_rgba(42,26,17,0.5)]">
                  <div className="absolute inset-[14px] rounded-[14px] bg-[#f6e7c9] shadow-[inset_0_6px_14px_rgba(122,69,32,0.18)]">
                    <div className="flex h-full flex-wrap content-center items-center justify-center gap-x-0 gap-y-1 p-2">
                      {p.items.slice(0, 6).map((it, j) => (
                        <Illustration key={j} name={art[it.name.toLowerCase()] ?? "pie"} className="pk-food -mx-1 h-[88px] w-[88px]" />
                      ))}
                    </div>
                  </div>
                  {/* Lid hinged at the top edge */}
                  <div className="pk-lid absolute inset-x-0 top-0 h-full origin-top rounded-[22px] bg-[#d9ae6c] [backface-visibility:hidden] [transform-style:preserve-3d] max-md:hidden">
                    <div className="grid h-full place-items-center">
                      <svg viewBox="0 0 120 34" className="h-8 w-auto" aria-hidden>
                        <text x="60" y="27" textAnchor="middle" fill="#a26b2c" style={{ font: "800 30px var(--font-montserrat-alt)", letterSpacing: "-0.05em" }}>RAAF</text>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-baseline justify-between gap-4">
                <h3 className="text-step-2">{p.name}</h3>
                <span className="tabular shrink-0 whitespace-nowrap text-[0.9rem] font-medium text-toast">Pack {i + 1}</span>
              </div>
              <ul className="mt-3 space-y-1 text-[0.95rem] text-cocoa/75">
                {p.items.map((it) => (
                  <li key={it.name} className="flex gap-2">
                    <span className="tabular w-6 shrink-0 font-medium text-toast">{it.qty ? `${it.qty}×` : ""}</span>
                    {it.name}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[0.88rem] font-medium text-toast">{priceLabel(p.price)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
