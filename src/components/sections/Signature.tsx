"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { menu, categories, type MenuItem } from "@/lib/content";
import { Illo as Illustration } from "@/components/illustrations/Illo";
import { Steam } from "@/components/motion/Steam";
import { RevealText } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";

const picks = ["meat-pie", "sausage-rolls", "bofrot", "butter-bread", "banana-chocolate-bread", "vanilla-cake", "jollof-grilled"];
const items = picks.map((id) => menu.find((m) => m.id === id)!).filter(Boolean) as MenuItem[];
const catLabel = (id: string) => categories.find((c) => c.id === id)?.label ?? "";

/**
 * Signature index: a type-led menu board. On desktop, hovering a row floats its
 * illustration beside the pointer (with a little tilt from the pointer's
 * speed). On touch screens each row carries its own small illustration.
 */
export function Signature() {
  const root = useRef<HTMLElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<MenuItem | null>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const float = floatRef.current!;
      const mm = gsap.matchMedia();
      mm.add(`${MQ.fine} and ${MQ.motion} and ${MQ.desktop}`, () => {
        gsap.set(float, { xPercent: -50, yPercent: -50, scale: 0.6, opacity: 0 });
        const xTo = gsap.quickTo(float, "x", { duration: 0.7, ease: "expo" });
        const yTo = gsap.quickTo(float, "y", { duration: 0.7, ease: "expo" });
        const rTo = gsap.quickTo(float, "rotate", { duration: 0.9, ease: "expo" });
        let lastX = 0;
        const list = el.querySelector(".sig-list") as HTMLElement;
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          xTo(e.clientX - r.left);
          yTo(e.clientY - r.top);
          rTo(gsap.utils.clamp(-14, 14, (e.clientX - lastX) * 0.9));
          lastX = e.clientX;
        };
        const enter = () => gsap.to(float, { scale: 1, opacity: 1, duration: 0.6, ease: "expo" });
        const leave = () => gsap.to(float, { scale: 0.6, opacity: 0, duration: 0.5, ease: "expo" });
        list.addEventListener("pointermove", move);
        list.addEventListener("pointerenter", enter);
        list.addEventListener("pointerleave", leave);
        return () => {
          list.removeEventListener("pointermove", move);
          list.removeEventListener("pointerenter", enter);
          list.removeEventListener("pointerleave", leave);
        };
      });
      mm.add(MQ.motion, () => {
        gsap.from(el.querySelectorAll(".sig-row"), {
          y: 50,
          opacity: 0,
          duration: 1.1,
          stagger: 0.07,
          ease: "expo",
          scrollTrigger: { trigger: el.querySelector(".sig-list"), start: "top 82%", once: true },
        });
        gsap.from(el.querySelectorAll(".sig-rule"), {
          scaleX: 0,
          transformOrigin: "0 50%",
          duration: 1.4,
          stagger: 0.07,
          ease: "expo",
          scrollTrigger: { trigger: el.querySelector(".sig-list"), start: "top 82%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative py-28 md:py-40" aria-labelledby="sig-title">
      <div className="shell grid gap-12 md:grid-cols-12 md:gap-[var(--gutter)]">
        <div className="md:col-span-4">
          <div className="md:sticky md:top-32">
            <RevealText as="h2" id="sig-title" className="text-step-5">
              Made by hand, for your table.
            </RevealText>
            <RevealText className="measure mt-6 text-cocoa/75" delay={0.15}>
              Flaky pies and pillowy bofrot, soft butter bread and tender cakes, from a kitchen that bakes in small batches for the people it feeds.
            </RevealText>
            <div className="mt-8">
              <Button href="/menu/" variant="ghost">
                Browse the full menu
              </Button>
            </div>
          </div>
        </div>

        <ul className="sig-list relative md:col-span-7 md:col-start-6" onPointerLeave={() => setActive(null)}>
          {items.map((item) => (
            <li key={item.id} className="sig-row relative">
              <span aria-hidden className="sig-rule absolute inset-x-0 top-0 h-px bg-cocoa/15" />
              <Link prefetch={false}
                href={`/menu/#${item.id}`}
                onPointerEnter={() => setActive(item)}
                onFocus={() => setActive(item)}
                className="group flex items-center gap-5 py-6 md:py-7"
              >
                <span className="flex-1">
                  <span className="block font-display text-step-3 font-bold leading-[1.05] tracking-[-0.035em] transition-[transform,color] duration-500 ease-expo group-hover:translate-x-3 group-hover:text-crust-deep group-focus-visible:translate-x-3">
                    {item.name}
                  </span>
                  <span className="mt-2 block text-[0.92rem] text-cocoa/65">{item.description}</span>
                </span>
                <span className="hidden shrink-0 text-[0.85rem] font-medium text-toast sm:block">{catLabel(item.category)}</span>
                {/* Touch / small screens: illustration sits in the row */}
                <span className="relative h-20 w-20 shrink-0 md:hidden">
                  <Illustration name={item.illustration} className="h-full w-full" />
                </span>
              </Link>
            </li>
          ))}
          <li aria-hidden className="sig-row">
            <span className="sig-rule block h-px bg-cocoa/15" />
          </li>
        </ul>
      </div>

      {/* Floating preview (desktop, fine pointer) */}
      <div ref={floatRef} aria-hidden className="pointer-events-none absolute left-0 top-0 z-10 hidden h-64 w-64 md:block" style={{ opacity: 0 }}>
        <div className="absolute inset-4 rounded-full bg-[radial-gradient(circle,rgba(242,207,116,0.55),rgba(242,207,116,0)_68%)]" />
        {active ? (
          <>
            {active.warm ? <Steam className="absolute left-1/2 top-0 h-16 w-14 -translate-x-1/2 text-crust/70" /> : null}
            <Illustration key={active.id} name={active.illustration} className="sig-illo relative h-full w-full drop-shadow-[0_24px_30px_rgba(42,26,17,0.18)]" />
          </>
        ) : null}
      </div>
    </section>
  );
}
