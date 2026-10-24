import Link from "next/link";
import { business, nav, isPlaceholder, whatsappHref, telHref, mailHref } from "@/lib/content";
import { Wordmark, SteamCurl } from "./Wordmark";
import { HoursList, OpenStatus } from "@/components/ui/OpenStatus";

export function ContactList({ className }: { className?: string }) {
  const wa = whatsappHref();
  const tel = telHref();
  const mail = mailHref();
  const rows = [
    { label: "WhatsApp", href: wa, value: wa ? `+${business.whatsapp}` : null, missing: "WhatsApp number coming soon" },
    { label: "Call", href: tel, value: tel ? `+${business.phone}` : null, missing: "Phone number coming soon" },
    { label: "Email", href: mail, value: mail ? business.email : null, missing: "Email coming soon" },
    { label: "Area", href: null, value: isPlaceholder(business.area) ? null : business.area, missing: "Location coming soon" },
  ];
  return (
    <dl className={className}>
      {rows.map((r) => (
        <div key={r.label} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-current/12 py-3">
          <dt className="opacity-75">{r.label}</dt>
          <dd className="ml-auto text-right font-medium">
            {r.value && r.href ? (
              <a href={r.href} className="link-draw" {...(r.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                {r.value}
              </a>
            ) : (
              (r.value ?? <span className="opacity-75">{r.missing}</span>)
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function Footer() {
  const socials = business.socials.filter((s) => !isPlaceholder(s.href));
  const year = 2026;
  return (
    <footer data-dark className="on-dark relative overflow-hidden bg-cocoa text-flour">
      <div aria-hidden className="pointer-events-none absolute -right-[10vw] -top-[20vw] h-[60vw] w-[60vw] rounded-full bg-[radial-gradient(circle,rgba(242,207,116,0.16),transparent_62%)]" />
      <div className="shell relative pb-10 pt-24 md:pt-32">
        <p className="max-w-[14ch] font-display text-step-6 font-bold leading-[0.92] tracking-[-0.045em]">
          Good food.
          <br />
          <span className="text-butter">Great moments.</span>
        </p>

        <div className="mt-20 grid gap-12 md:grid-cols-12 md:gap-[var(--gutter)]">
          <div className="md:col-span-4">
            <h2 className="font-display text-lg font-semibold tracking-[-0.01em] text-butter">Order</h2>
            <ContactList className="mt-4 text-[0.95rem]" />
          </div>
          <div className="md:col-span-3 md:col-start-6">
            <h2 className="font-display text-lg font-semibold tracking-[-0.01em] text-butter">Hours</h2>
            <OpenStatus tone="dark" className="mt-4" />
            <HoursList className="mt-4 text-[0.95rem] text-flour/75" />
          </div>
          <div className="md:col-span-2">
            <h2 className="font-display text-lg font-semibold tracking-[-0.01em] text-butter">Explore</h2>
            <ul className="mt-4 space-y-2">
              {[{ href: "/", label: "Home" }, ...nav].map((n) => (
                <li key={n.href}>
                  <Link prefetch={false} href={n.href} className="link-draw text-[0.95rem]">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-2">
            <h2 className="font-display text-lg font-semibold tracking-[-0.01em] text-butter">Follow</h2>
            {socials.length ? (
              <ul className="mt-4 space-y-2">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="link-draw text-[0.95rem]">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-[0.95rem] text-flour/60">Social links coming soon</p>
            )}
          </div>
        </div>

        <div className="mt-24 flex flex-col gap-8 border-t border-flour/12 pt-8 md:flex-row md:items-end md:justify-between">
          <div className="text-[18px] text-flour">
            <Wordmark />
          </div>
          <p className="flex items-center gap-2 text-[0.9rem] text-flour/70">
            <SteamCurl className="h-5 w-auto text-crust" />
            Made by hand in a home kitchen. {business.mood}
          </p>
          <p className="text-[0.85rem] text-flour/55">
            © {year} {business.legalName}
          </p>
        </div>
      </div>
    </footer>
  );
}
