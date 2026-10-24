"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { nav, business, whatsappHref } from "@/lib/content";
import { cn } from "@/lib/cn";
import { Wordmark } from "./Wordmark";
import { Button } from "@/components/ui/Button";
import { useLenis } from "@/components/motion/SmoothScroll";

const expo = [0.16, 1, 0.3, 1] as const;
const quint = [0.83, 0, 0.17, 1] as const;

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      // Tuck away when reading down, return the moment you scroll up
      setHidden(y > 480 && y > last + 2);
      if (y < last - 2) setHidden(false);
      last = y;
      // Over a dark section? Switch to the night palette
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const under = document.elementsFromPoint(window.innerWidth / 2, 36).find((n) => !n.closest("header"));
        setDark(!!under?.closest("[data-dark]"));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [pathname]);

  // Close the menu on navigation (adjusting state during render, not in an effect)
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }
  // Lock scrolling while the menu is open
  useEffect(() => {
    if (open) lenis.stop();
    else lenis.start();
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, lenis]);

  const orderHref = whatsappHref() ?? "/order/";

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[100] transition-[transform,background-color,box-shadow,padding] duration-700 ease-expo",
          scrolled && !open ? cn("py-2 md:backdrop-blur-md", dark ? "on-dark bg-cocoa/90 shadow-[0_1px_0_rgba(251,246,238,0.08)]" : "bg-flour/92 shadow-[0_1px_0_rgba(42,26,17,0.08)]") : "py-4 md:py-6",
          hidden && !open ? "-translate-y-full" : "translate-y-0",
        )}
      >
        <div className="shell flex items-center justify-between gap-6">
          <Link prefetch={false} href="/" className={cn("relative z-[2] text-[15px] transition-colors duration-500", open || dark ? "text-flour" : "text-cocoa")} data-cursor>
            <Wordmark />
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            {nav.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link prefetch={false}
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative rounded-full px-4 py-2 font-display text-[0.95rem] font-semibold tracking-[-0.01em] transition-colors duration-300",
                    dark ? (active ? "text-cocoa" : "text-flour/75 hover:text-flour") : active ? "text-cocoa" : "text-cocoa/70 hover:text-cocoa",
                  )}
                >
                  {active ? <motion.span layoutId="nav-pill" className={cn("absolute inset-0 -z-[1] rounded-full", dark ? "bg-butter" : "bg-flour-deep")} transition={{ type: "spring", stiffness: 300, damping: 30 }} /> : null}
                  {item.label}
                </Link>
              );
            })}
            <Button href={orderHref} variant={dark ? "butter" : "primary"} className="ml-3 min-h-[46px] px-6 text-[0.92rem]">
              Order now
            </Button>
          </nav>

          <button
            type="button"
            className={cn("relative z-[2] flex h-12 items-center gap-3 rounded-full pl-5 pr-4 font-display text-[0.95rem] font-semibold md:hidden", open ? "text-flour" : dark ? "bg-flour/10 text-flour" : "bg-flour-deep text-cocoa")}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
            <span className="relative block h-3 w-5" aria-hidden>
              <span className={cn("absolute left-0 h-[2px] w-full rounded bg-current transition-all duration-500 ease-expo", open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0")} />
              <span className={cn("absolute left-0 h-[2px] w-full rounded bg-current transition-all duration-500 ease-expo", open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0")} />
            </span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            data-dark
            className="on-dark fixed inset-0 z-[99] flex flex-col bg-cocoa px-[var(--gutter)] pb-10 pt-28 text-flour md:hidden"
            initial={{ clipPath: "circle(0% at calc(100% - 48px) 44px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 48px) 44px)", transition: { duration: 0.9, ease: quint } }}
            exit={{ clipPath: "circle(0% at calc(100% - 48px) 44px)", transition: { duration: 0.6, ease: quint, delay: 0.1 } }}
          >
            <nav aria-label="Mobile" className="flex flex-1 flex-col justify-center">
              <ul className="space-y-1">
                {[{ href: "/", label: "Home" }, ...nav].map((item, i) => (
                  <li key={item.href} className="overflow-hidden">
                    <motion.div initial={{ y: "110%" }} animate={{ y: 0, transition: { delay: 0.25 + i * 0.06, duration: 0.9, ease: expo } }} exit={{ y: "110%", transition: { duration: 0.35, ease: quint } }}>
                      <Link prefetch={false} href={item.href} className="block py-1 font-display text-[clamp(2.1rem,9.5vw,3.1rem)] font-bold leading-[1.05] tracking-[-0.04em]" aria-current={pathname === item.href ? "page" : undefined}>
                        {item.label}
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </nav>
            <motion.div className="space-y-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.6, duration: 0.8, ease: expo } }} exit={{ opacity: 0 }}>
              <p className="font-display text-xl font-semibold text-butter">{business.tagline}</p>
              <Button href={orderHref} variant="butter" className="w-full">
                Order now
              </Button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
