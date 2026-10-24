"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gallery } from "@/lib/content";
import { asset } from "@/lib/site";
import { useLenis } from "@/components/motion/SmoothScroll";
import { RevealGroup } from "@/components/motion/Reveal";

const ratio = { tall: "aspect-[4/5]", wide: "aspect-[4/3]", square: "aspect-square" } as const;
const expo = [0.16, 1, 0.3, 1] as const;

/**
 * Masonry gallery. Tapping a photo grows it into a lightbox from exactly
 * where it sat (shared layout animation). Arrows, swipe and Escape work;
 * focus returns to the photo you opened.
 */
export function Gallery() {
  const [open, setOpen] = useState<number | null>(null);
  const lenis = useLenis();
  const lastFocus = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dragStart = useRef<number | null>(null);

  const show = (i: number) => {
    lastFocus.current = document.activeElement as HTMLElement;
    setOpen(i);
  };
  const close = useCallback(() => {
    setOpen(null);
    requestAnimationFrame(() => lastFocus.current?.focus());
  }, []);
  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + gallery.length) % gallery.length)), []);

  useEffect(() => {
    if (open === null) return;
    lenis.stop();
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
      // Keep focus inside the dialog
      if (e.key === "Tab") {
        const f = Array.from(document.querySelectorAll<HTMLElement>("#lightbox button"));
        const idx = f.indexOf(document.activeElement as HTMLElement);
        e.preventDefault();
        f[(idx + (e.shiftKey ? -1 : 1) + f.length) % f.length]?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      lenis.start();
    };
  }, [open, lenis, close, step]);

  const item = open === null ? null : gallery[open];

  return (
    <>
      <RevealGroup as="ul" className="columns-1 gap-[var(--gutter)] sm:columns-2 lg:columns-3">
        {gallery.map((g, i) => (
          <li key={g.id} data-stagger className="mb-[var(--gutter)] break-inside-avoid">
            <button type="button" onClick={() => show(i)} className="group block w-full text-left" aria-label={`Open photo: ${g.caption}`}>
              <motion.div layoutId={`photo-${g.id}`} className={`relative overflow-hidden rounded-[24px] bg-flour-deep ${ratio[g.ratio]}`} transition={{ duration: 0.7, ease: expo }}>
                <Image src={asset(g.src)} alt="" fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw" className="object-cover transition-transform duration-[1.2s] ease-expo group-hover:scale-[1.05]" />
              </motion.div>
              <span className="mt-3 block text-[0.95rem] text-cocoa/75 transition-colors group-hover:text-cocoa">{g.caption}</span>
            </button>
          </li>
        ))}
      </RevealGroup>

      <AnimatePresence>
        {item ? (
          <motion.div
            id="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={item.caption}
            data-dark
            className="on-dark fixed inset-0 z-[130] flex flex-col bg-cocoa/95 text-flour backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4, delay: 0.1 } }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center justify-between px-[var(--gutter)] py-4">
              <p className="tabular text-[0.9rem] text-flour/70">
                {open! + 1} / {gallery.length}
              </p>
              <button ref={closeRef} type="button" onClick={close} className="rounded-full bg-flour/10 px-5 py-2.5 font-display text-[0.95rem] font-semibold hover:bg-flour/20">
                Close
              </button>
            </div>
            <div
              className="relative flex flex-1 items-center justify-center px-[var(--gutter)]"
              onClick={(e) => e.target === e.currentTarget && close()}
              onPointerDown={(e) => (dragStart.current = e.clientX)}
              onPointerUp={(e) => {
                if (dragStart.current === null) return;
                const dx = e.clientX - dragStart.current;
                dragStart.current = null;
                if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
              }}
            >
              <motion.div key={item.id} layoutId={`photo-${item.id}`} className={`relative max-h-[74svh] overflow-hidden rounded-[24px] ${ratio[item.ratio]}`}
                style={{ width: `min(92vw, calc(74svh * ${item.ratio === "wide" ? "4 / 3" : item.ratio === "tall" ? "4 / 5" : "1"}))` }} transition={{ duration: 0.7, ease: expo }}>
                <Image src={asset(item.src)} alt={item.caption} fill sizes="92vw" className="object-cover" priority />
              </motion.div>
            </div>
            <div className="flex items-center justify-between gap-4 px-[var(--gutter)] py-5">
              <button type="button" onClick={() => step(-1)} className="rounded-full border border-flour/25 px-5 py-2.5 font-display text-[0.95rem] font-semibold hover:border-flour" aria-label="Previous photo">
                Previous
              </button>
              <motion.p key={item.caption} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center font-display text-lg font-semibold">
                {item.caption}
              </motion.p>
              <button type="button" onClick={() => step(1)} className="rounded-full border border-flour/25 px-5 py-2.5 font-display text-[0.95rem] font-semibold hover:border-flour" aria-label="Next photo">
                Next
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
