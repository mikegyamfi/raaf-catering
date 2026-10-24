"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { gallery } from "@/lib/content";
import { Photo } from "@/components/ui/Photo";
import { RevealText } from "@/components/motion/Reveal";

const picks = [gallery[0], gallery[1], gallery[3], gallery[6], gallery[4]];
const layout = [
  "col-span-6 md:col-span-4 aspect-[4/5]",
  "col-span-6 md:col-span-3 md:mt-28 aspect-square",
  "col-span-12 md:col-span-5 md:-mt-10 aspect-[5/4]",
  "col-span-7 md:col-span-5 md:col-start-2 aspect-[4/3]",
  "col-span-5 md:col-span-3 md:col-start-8 md:-mt-24 aspect-[3/4]",
];
// Different depths → gentle parallax between tiles
const speed = [-6, 10, -12, 6, -14];

export function GalleryTeaser() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MQ.motion} and ${MQ.desktop}`, () => {
        root.current!.querySelectorAll<HTMLElement>(".gt-tile").forEach((t, i) => {
          gsap.fromTo(t, { yPercent: speed[i] * -0.5 }, { yPercent: speed[i] * 0.5, ease: "none", scrollTrigger: { trigger: t, start: "top bottom", end: "bottom top", scrub: true } });
        });
      });
      mm.add(MQ.motion, () => {
        gsap.from(root.current!.querySelectorAll(".gt-clip"), {
          clipPath: "inset(100% 0% 0% 0% round 28px)",
          duration: 1.4,
          ease: "expo",
          stagger: 0.08,
          scrollTrigger: { trigger: root.current!.querySelector(".gt-grid"), start: "top 80%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-flour-deep py-28 md:py-40" aria-labelledby="gallery-title">
      <div className="shell">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <RevealText as="h2" id="gallery-title" className="text-step-6">
            From our kitchen
          </RevealText>
          <Link prefetch={false} href="/gallery/" className="link-draw font-display text-lg font-semibold">
            Open the gallery
          </Link>
        </div>
        <ul className="gt-grid mt-16 grid grid-cols-12 gap-[var(--gutter)]">
          {picks.map((g, i) => (
            <li key={g.id} className={`gt-tile group ${layout[i]}`}>
              <Link prefetch={false} href="/gallery/" className="block h-full" aria-label={`${g.caption}, open the gallery`}>
                <div className="gt-clip h-full">
                  <Photo src={g.src} alt={g.caption} className="h-full" sizes="(min-width: 900px) 33vw, 50vw" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
