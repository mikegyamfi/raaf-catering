"use client";

import { useRef, type ElementType, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { gsap, SplitText, useGSAP, MQ } from "@/lib/gsap";

/**
 * Run a reveal's setup only once its element is within about a screen of
 * the viewport. Dozens of reveals set up at once would otherwise stretch
 * hydration into one long task; this keeps first load light.
 */
function whenNear(el: Element, setup: () => void, immediate = false) {
  if (immediate) {
    setup();
    return;
  }
  let ctx: gsap.Context | null = null;
  const io = new IntersectionObserver(
    ([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      ctx = gsap.context(setup);
    },
    { rootMargin: "100% 0px" },
  );
  io.observe(el);
  return () => {
    io.disconnect();
    ctx?.revert();
  };
}

type RevealTextProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  /** "lines" for headlines/paragraphs, "words" for short punchy lines */
  by?: "lines" | "words";
  delay?: number;
  /** Start on mount instead of on scroll (hero copy) */
  immediate?: boolean;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "children" | "className">;

/**
 * Masked text reveal: each line (or word) slides up from behind a clip.
 * Reduced motion gets a soft opacity fade instead.
 */
export function RevealText<T extends ElementType = "p">({
  as,
  children,
  by = "lines",
  delay = 0,
  immediate = false,
  className,
  ...rest
}: RevealTextProps<T>) {
  const Tag = (as ?? "p") as ElementType;
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () =>
        whenNear(el, () => {
          // Body copy: a soft rise. Line-splitting is reserved for headlines,
          // where the masked reveal is worth the layout measurement it costs.
          if (!/^H[1-3]$/.test(el.tagName) && by === "lines") {
            el.classList.add("is-ready");
            gsap.from(el, { y: 28, opacity: 0, duration: 1.1, ease: "expo", delay, scrollTrigger: immediate ? undefined : { trigger: el, start: "top 90%", once: true } });
            return;
          }
          const split = SplitText.create(el, {
            type: by === "lines" ? "lines" : "words,lines",
            mask: by === "lines" ? "lines" : "words",
            autoSplit: true,
            aria: "none", // words stay real text, so screen readers read it naturally
            onSplit(self) {
              const targets = by === "lines" ? self.lines : self.words;
              return gsap.from(targets, {
                yPercent: 110,
                rotate: by === "words" ? 4 : 0,
                duration: by === "lines" ? 1.1 : 0.9,
                ease: "expo",
                stagger: by === "lines" ? 0.08 : 0.05,
                delay,
                scrollTrigger: immediate ? undefined : { trigger: el, start: "top 88%", once: true },
              });
            },
          });
          el.classList.add("is-ready");
          return () => split.revert();
        }, immediate),
      );
      mm.add(MQ.reduce, () => {
        el.classList.add("is-ready");
        gsap.from(el, { opacity: 0, duration: 0.8, ease: "power1.out", delay, scrollTrigger: immediate ? undefined : { trigger: el, start: "top 90%", once: true } });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    // Above-the-fold text (immediate) stays visible in the prerendered HTML so it counts for LCP;
    // the preloader or route transition covers the moment GSAP takes over.
    <Tag ref={ref} data-reveal={immediate ? undefined : true} className={className} {...rest}>
      {children}
    </Tag>
  );
}

/**
 * Image/illustration reveal: a clip-path wipe from the bottom with a slow
 * settle in scale, like a photo being laid down on the table.
 */
export function RevealMask({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const el = ref.current!;
      const inner = el.firstElementChild as HTMLElement | null;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () =>
        whenNear(el, () => {
          el.classList.add("is-ready");
          const tl = gsap.timeline({ delay, scrollTrigger: { trigger: el, start: "top 85%", once: true } });
          tl.fromTo(el, { clipPath: "inset(100% 0% 0% 0% round 28px)" }, { clipPath: "inset(0% 0% 0% 0% round 28px)", duration: 1.3, ease: "expo" });
          if (inner) tl.from(inner, { scale: 1.18, duration: 1.8, ease: "expo" }, 0);
        }),
      );
      mm.add(MQ.reduce, () => {
        el.classList.add("is-ready");
        gsap.from(el, { opacity: 0, duration: 0.8, scrollTrigger: { trigger: el, start: "top 90%", once: true } });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return (
    <div ref={ref} data-reveal className={className}>
      {children}
    </div>
  );
}

/** Generic fade-up for small groups (stagger children with [data-stagger]) */
export function RevealGroup({ children, className, as }: { children: ReactNode; className?: string; as?: ElementType }) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const el = ref.current!;
      const items = el.querySelectorAll("[data-stagger]");
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () =>
        whenNear(el, () => {
          el.classList.add("is-ready");
          gsap.from(items.length ? items : el, { y: 40, opacity: 0, duration: 1, ease: "expo", stagger: 0.07, scrollTrigger: { trigger: el, start: "top 86%", once: true } });
        }),
      );
      mm.add(MQ.reduce, () => {
        el.classList.add("is-ready");
        gsap.from(items.length ? items : el, { opacity: 0, duration: 0.7, stagger: 0.05, scrollTrigger: { trigger: el, start: "top 90%", once: true } });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return (
    <Tag ref={ref} data-reveal className={className}>
      {children}
    </Tag>
  );
}
