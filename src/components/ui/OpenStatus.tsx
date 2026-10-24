"use client";

import { startTransition, useEffect, useState } from "react";
import { hours, timeZone } from "@/lib/content";
import { cn } from "@/lib/cn";

const DAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
const fmt = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const hh = h % 12 || 12;
  return m ? `${hh}:${String(m).padStart(2, "0")}${suffix}` : `${hh}${suffix}`;
};

/** Current day/minute in the kitchen's own timezone, not the visitor's */
function nowInZone() {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone, weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "0";
  return { day: SHORT.indexOf(get("weekday")), minute: Number(get("hour")) * 60 + Number(get("minute")) };
}

export type Status = { open: boolean; label: string } | null;

export function computeStatus(): Status {
  if (!hours) return null;
  const { day, minute } = nowInZone();
  const today = hours.find((h) => h.days.includes(day));
  if (today && minute >= toMin(today.open) && minute < toMin(today.close)) {
    return { open: true, label: `Open now · until ${fmt(today.close)}` };
  }
  // Find the next opening
  for (let i = 0; i < 7; i++) {
    const d = (day + i) % 7;
    const slot = hours.find((h) => h.days.includes(d));
    if (!slot) continue;
    if (i === 0 && minute >= toMin(slot.open)) continue;
    return { open: false, label: `Closed · opens ${i === 0 ? "today" : i === 1 ? "tomorrow" : DAY[d]} at ${fmt(slot.open)}` };
  }
  return { open: false, label: "Closed" };
}

/** Live "Open now / Closed" pill computed from `hours` in content.ts */
export function OpenStatus({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  const [status, setStatus] = useState<Status | undefined>(undefined);
  useEffect(() => {
    // Low priority: never interrupts hydration of the rest of the page
    const update = () => startTransition(() => setStatus(computeStatus()));
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  const label = status === undefined ? " " : status === null ? "Order hours coming soon" : status.label;

  return (
    <span
      className={cn(
        "inline-flex min-h-9 items-center rounded-full px-4 py-1.5 text-[0.88rem] font-medium",
        tone === "light" ? "bg-flour-deep text-cocoa" : "bg-flour/10 text-flour",
        status?.open && (tone === "light" ? "text-palm" : "text-butter"),
        className,
      )}
      aria-live="polite"
    >
      {label}
    </span>
  );
}

export function HoursList({ className }: { className?: string }) {
  if (!hours) {
    return <p className={className}>Order hours will be listed here soon. Until then, send a message to arrange your order.</p>;
  }
  return (
    <dl className={cn("grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5", className)}>
      {hours.map((h) => (
        <div key={h.days.join()} className="contents">
          <dt>{h.days.map((d) => SHORT[d]).join(", ")}</dt>
          <dd className="tabular">
            {fmt(h.open)}–{fmt(h.close)}
          </dd>
        </div>
      ))}
    </dl>
  );
}
