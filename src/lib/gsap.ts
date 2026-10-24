"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { Flip } from "gsap/Flip";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, MorphSVGPlugin, Flip, CustomEase, useGSAP);

  // The site's easing tokens, shared with CSS (see globals.css)
  CustomEase.create("expo", "0.16, 1, 0.3, 1");
  CustomEase.create("quint", "0.83, 0, 0.17, 1");
  CustomEase.create("spring", "0.34, 1.56, 0.64, 1");
  CustomEase.create("viscous", "0.45, 0, 0.2, 1");

  gsap.defaults({ ease: "expo", duration: 0.9 });
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/** Media-query conditions used with gsap.matchMedia() everywhere */
export const MQ = {
  motion: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
  desktop: "(min-width: 900px)",
  mobile: "(max-width: 899px)",
  fine: "(hover: hover) and (pointer: fine)",
} as const;

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, MorphSVGPlugin, Flip, useGSAP };
