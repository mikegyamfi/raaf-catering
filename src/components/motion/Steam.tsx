import { cn } from "@/lib/cn";

/** Three soft curls of steam that rise and fade on a loop (CSS only, GPU-cheap). */
export function Steam({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 70" aria-hidden className={cn("steam pointer-events-none", className)}>
      {["M14 66 C4 52 24 44 14 30 C6 20 18 12 14 4", "M30 66 C20 50 40 42 30 28 C22 18 34 10 30 2", "M46 66 C36 52 56 44 46 30 C38 20 50 12 46 4"].map((d, i) => (
        <path key={i} d={d} style={{ animationDelay: `${i * 0.7}s` }} />
      ))}
    </svg>
  );
}
