import { cn } from "@/lib/cn";

/**
 * The RAAF wordmark: Montserrat Alternates ExtraBold, tightly tracked,
 * with a curl of steam rising off the F: fresh from the oven.
 */
export function Wordmark({ className, sub = true }: { className?: string; sub?: boolean }) {
  return (
    <span className={cn("inline-flex items-end gap-2 leading-none", className)}>
      <span className="relative font-display text-[1.7em] font-extrabold tracking-[-0.06em]">
        RAAF
        <SteamCurl className="absolute -right-[0.3em] -top-[0.42em] h-[0.66em] w-auto text-crust" />
      </span>
      {sub ? (
        <span className="mb-[0.2em] ml-2 hidden font-display text-[0.62em] font-semibold leading-[1.05] tracking-[-0.01em] opacity-80 sm:block">
          Professional
          <br />
          Catering Services
        </span>
      ) : null}
    </span>
  );
}

/** Two soft curls of steam, the brand's small accent. */
export function SteamCurl({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 40" className={className} aria-hidden fill="none" stroke="currentColor" strokeLinecap="round">
      <path d="M8 38 C3 31 13 27 8 20 C4 14 11 10 8 3" strokeWidth="2.6" />
      <path d="M16.5 36 C12.5 30 20.5 27 16.5 21 C13.5 16.5 19 13.5 16.5 8" strokeWidth="2" opacity="0.6" />
    </svg>
  );
}
