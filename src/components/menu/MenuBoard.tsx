"use client";

import { useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { gsap, Flip } from "@/lib/gsap";
import { menu, categories, isPlaceholder, priceLabel, type CategoryId, type MenuItem } from "@/lib/content";
import { Illo as Illustration } from "@/components/illustrations/Illo";
import { Steam } from "@/components/motion/Steam";
import { cn } from "@/lib/cn";

export type Tab = { id: string; label: string; match: (m: MenuItem) => boolean };

const mealCats: CategoryId[] = ["rice", "chicken", "ampesi", "banku", "fufu"];

export const previewTabs: Tab[] = [
  { id: "pastries", label: "Pastries", match: (m) => m.category === "pastries" },
  { id: "small-chops", label: "Small chops", match: (m) => m.category === "small-chops" || m.category === "snacks" },
  { id: "breads", label: "Breads", match: (m) => m.category === "breads" },
  { id: "cakes", label: "Cakes", match: (m) => m.category === "cakes" },
  { id: "meals", label: "Meals", match: (m) => mealCats.includes(m.category) },
];

export const fullTabs: Tab[] = [{ id: "all", label: "Everything", match: () => true }, ...categories.map((c) => ({ id: c.id, label: c.label, match: (m: MenuItem) => m.category === c.id }))];

/**
 * Filterable menu. Changing tab animates items with GSAP Flip: those staying
 * glide to their new place, newcomers rise in, leavers fade away.
 */
export function MenuBoard({ tabs, limit, withIds = false, className }: { tabs: Tab[]; limit?: number; withIds?: boolean; className?: string }) {
  const [tab, setTab] = useState(tabs[0].id);
  const listRef = useRef<HTMLUListElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const current = tabs.find((t) => t.id === tab)!;

  const items = menu.filter(current.match).slice(0, limit);
  const busy = useRef(false);

  // Only the current tab's dishes are in the DOM. Leavers fade out first,
  // then the survivors glide to their new spots (Flip) and newcomers rise in.
  const choose = (id: string) => {
    if (id === tab || busy.current) return;
    const list = listRef.current;
    if (!list || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setTab(id);
    const next = tabs.find((t) => t.id === id)!;
    const keep = new Set(menu.filter(next.match).slice(0, limit).map((m) => m.id));
    const els = Array.from(list.querySelectorAll<HTMLElement>(".mb-item"));
    const leaving = els.filter((el) => !keep.has(el.dataset.flipId!));
    busy.current = true;
    gsap.to(leaving, {
      opacity: 0,
      y: -12,
      duration: 0.22,
      ease: "power1.in",
      stagger: 0.01,
      onComplete: () => {
        flipState.current = Flip.getState(els.filter((el) => keep.has(el.dataset.flipId!)));
        setTab(id);
      },
    });
  };

  useLayoutEffect(() => {
    const state = flipState.current;
    const list = listRef.current;
    busy.current = false;
    if (!state || !list) return;
    flipState.current = null;
    const els = Array.from(list.querySelectorAll<HTMLElement>(".mb-item"));
    Flip.from(state, { targets: els, duration: 0.7, ease: "expo", stagger: 0.012, onEnter: (entering) => gsap.fromTo(entering, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "expo", stagger: 0.025 }) });
  }, [tab]);

  // Arrow-key navigation between tabs (WAI-ARIA tabs pattern)
  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = tabs[(i + dir + tabs.length) % tabs.length];
    choose(next.id);
    (document.getElementById(`tab-${next.id}`) as HTMLButtonElement | null)?.focus();
  };

  const blurb = categories.find((c) => c.id === tab)?.blurb;

  return (
    <div className={className}>
      <div role="tablist" aria-label="Menu categories" className="-mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] pb-2 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0" data-lenis-prevent>
        {tabs.map((t, i) => {
          const active = t.id === tab;
          return (
            <button
              key={t.id}
              id={`tab-${t.id}`}
              role="tab"
              type="button"
              aria-selected={active}
              aria-controls="menu-panel"
              tabIndex={active ? 0 : -1}
              onClick={() => choose(t.id)}
              onKeyDown={(e) => onKey(e, i)}
              className={cn(
                "relative shrink-0 rounded-full px-5 py-2.5 font-display text-[0.95rem] font-semibold tracking-[-0.01em] transition-colors duration-300",
                active ? "bg-cocoa text-flour" : "bg-flour-deep text-cocoa/75 hover:text-cocoa",
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <p className="mt-6 min-h-[1.7em] text-cocoa/70" aria-live="polite">
        {blurb ?? (tab === "meals" ? "Ghanaian favourites, cooked for a crowd." : tab === "small-chops" ? "Party bites and crunchy chips." : "")}
      </p>

      <div id="menu-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} tabIndex={0} className="mt-6 rounded-2xl">
      <ul ref={listRef} className="relative grid gap-x-[var(--gutter)] md:grid-cols-2">
        {items.map((m) => (
          <li
            key={m.id}
            id={withIds ? m.id : undefined}
            data-flip-id={m.id}
            className="mb-item group scroll-mt-32 border-t border-cocoa/12"
          >
            <div className="flex items-center gap-5 py-5">
              <span className="relative grid h-[72px] w-[72px] shrink-0 place-items-center rounded-2xl bg-flour-deep transition-transform duration-500 ease-spring group-hover:-rotate-3 group-hover:scale-105">
                {m.warm ? <Steam className="absolute -top-7 left-1/2 h-8 w-7 -translate-x-1/2 text-crust/60" /> : null}
                <Illustration name={m.illustration} className="h-[64px] w-[64px]" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-4">
                  <span className="font-display text-step-1 font-bold leading-[1.15] tracking-[-0.02em]">{m.name}</span>
                  {!isPlaceholder(m.price) ? <span className="tabular shrink-0 font-medium text-toast">{priceLabel(m.price)}</span> : null}
                </span>
                <span className="mt-1 block text-[0.94rem] leading-[1.55] text-cocoa/70">{m.description}</span>
                {m.tags?.length ? (
                  <span className="mt-2 flex flex-wrap gap-1.5">
                    {m.tags.map((t) => (
                      <span key={t} className="rounded-full bg-butter-soft px-2.5 py-0.5 text-[0.78rem] font-medium text-toast">
                        {t}
                      </span>
                    ))}
                  </span>
                ) : null}
              </span>
            </div>
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
}
