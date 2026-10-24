"use client";

import Link from "next/link";
import { useRef, type ReactNode, type MouseEvent } from "react";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost" | "butter" | "light";

const styles: Record<Variant, string> = {
  primary: "bg-palm text-flour hover:bg-palm-soft",
  butter: "bg-butter text-cocoa hover:bg-butter-soft",
  ghost: "border-[1.5px] border-cocoa/25 text-cocoa hover:border-cocoa",
  light: "border-[1.5px] border-flour/35 text-flour hover:border-flour",
};

type Props = {
  children: ReactNode;
  href?: string;
  external?: boolean;
  variant?: Variant;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  "aria-label"?: string;
};

/**
 * Magnetic pill button: the pill leans toward the pointer and the label
 * follows a little further, then both spring back.
 */
export function Button({ children, href, external, variant = "primary", className, type = "button", onClick, disabled, ...aria }: Props) {
  const ref = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  const onMove = (e: MouseEvent) => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    gsap.to(el, { x: x * 0.28, y: y * 0.38, duration: 0.5, ease: "expo" });
    gsap.to(labelRef.current, { x: x * 0.12, y: y * 0.16, duration: 0.5, ease: "expo" });
  };
  const onLeave = () => {
    gsap.to([ref.current, labelRef.current], { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.45)" });
  };

  const cls = cn(
    "group relative inline-flex min-h-[52px] items-center justify-center gap-3 overflow-hidden rounded-full px-7 py-3",
    "font-display text-[0.98rem] font-semibold tracking-[-0.01em] transition-colors duration-300 ease-expo",
    "disabled:pointer-events-none disabled:opacity-50",
    styles[variant],
    className,
  );
  const inner = (
    <span ref={labelRef} className="relative z-10 inline-flex items-center gap-3">
      {children}
    </span>
  );
  const common = { onMouseMove: onMove, onMouseLeave: onLeave, className: cls, "data-cursor": "hover", ...aria };

  if (href) {
    if (external || href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:")) {
      return (
        <a ref={ref as React.Ref<HTMLAnchorElement>} href={href} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...common}>
          {inner}
        </a>
      );
    }
    return (
      <Link prefetch={false} ref={ref as React.Ref<HTMLAnchorElement>} href={href} {...common}>
        {inner}
      </Link>
    );
  }
  return (
    <button ref={ref as React.Ref<HTMLButtonElement>} type={type} onClick={onClick} disabled={disabled} {...common}>
      {inner}
    </button>
  );
}
