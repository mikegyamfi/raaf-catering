"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// One Lenis instance for the app. Kept outside React state on purpose:
// setting state at the root right after mount would force React to finish
// hydrating the whole page in one long, blocking task.
let instance: Lenis | null = null;

/** Pause/resume smooth scrolling (e.g. while a menu or lightbox is open). */
const controls = {
  stop: () => instance?.stop(),
  start: () => instance?.start(),
  scrollTo: (target: number, opts?: { immediate?: boolean }) => (instance ? instance.scrollTo(target, opts) : window.scrollTo(0, target)),
};
export const useLenis = () => controls;

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger and
 * Lenis share one clock (no double rAF, no drift).
 * Skipped entirely for reduced-motion users: native scrolling instead.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.classList.toggle("js-motion", !reduce);
    if (reduce) return;

    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    instance = lenis;

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      instance = null;
    };
  }, []);

  // New page → start at the top, then let triggers re-measure
  useEffect(() => {
    if (window.location.hash) return;
    controls.scrollTo(0, { immediate: true });
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return <>{children}</>;
}
