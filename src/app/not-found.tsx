import type { Metadata } from "next";
import Link from "next/link";
import { Illo as Illustration } from "@/components/illustrations/Illo";
import { Steam } from "@/components/motion/Steam";
import { Button } from "@/components/ui/Button";
import { menu, whatsappHref } from "@/lib/content";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page isn't on the menu. Find pastries, small chops, cakes and meals from RAAF Catering instead.",
};

const routes = [
  { href: "/menu/", label: "The menu", line: "Pastries, small chops, breads, cakes and meals", art: "pie" },
  { href: "/order/", label: "Place an order", line: "Tell us the date and your guests", art: "cake" },
  { href: "/gallery/", label: "The gallery", line: "A look inside our kitchen", art: "jollof" },
  { href: "/story/", label: "Our story", line: "How a home kitchen feeds a crowd", art: "loaf" },
] as const;

const favourites = ["meat-pie", "bofrot", "butter-bread", "jollof-grilled"].map((id) => menu.find((m) => m.id === id)!).filter(Boolean);

/** 404: the zero is a ring doughnut, still warm, in the glow of the oven. */
export default function NotFound() {
  const wa = whatsappHref("Hello RAAF, I couldn't find what I was looking for on your website.");
  return (
    <>
      <section data-dark className="on-dark relative isolate overflow-hidden bg-cocoa pb-24 pt-36 text-flour md:pb-32 md:pt-44">
        <div aria-hidden className="oven-glow pointer-events-none absolute left-1/2 top-[46%] -z-[1] h-[120vmin] w-[120vmin] -translate-x-1/2 -translate-y-1/2 rounded-full" />
        <div className="shell flex flex-col items-center text-center">
          <p aria-hidden className="flex items-center font-display text-[clamp(7rem,4rem+22vw,20rem)] font-extrabold leading-[0.8] tracking-[-0.07em] text-butter">
            <span>4</span>
            <span className="relative mx-[0.02em] inline-block h-[0.82em] w-[0.82em]">
              <Steam className="absolute -top-[0.32em] left-1/2 h-[0.34em] w-[0.28em] -translate-x-1/2 text-butter-soft/80" />
              <Illustration name="doughnut" eager className="float-soft h-full w-full drop-shadow-[0_24px_30px_rgba(0,0,0,0.35)]" />
            </span>
            <span>4</span>
          </p>
          <h1 className="mt-10 max-w-[16ch] text-step-6">This page isn&rsquo;t on the menu.</h1>
          <p className="measure mt-6 text-step-1 leading-[1.55] text-flour/80">
            The link may be old, or a letter slipped on the way in. Everything we bake and cook is still a tap away.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button href="/" variant="butter">
              Back to home
            </Button>
            <Button href="/menu/" variant="light">
              See the menu
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-flour py-20 md:py-28" aria-labelledby="nf-routes">
        <div className="shell">
          <h2 id="nf-routes" className="text-step-4">
            Where would you like to go?
          </h2>
          <ul className="mt-10 grid gap-[var(--gutter)] sm:grid-cols-2 lg:grid-cols-4">
            {routes.map((r) => (
              <li key={r.href}>
                <Link prefetch={false} href={r.href} className="group flex h-full flex-col rounded-[28px] bg-flour-deep p-7 transition-[transform,background-color] duration-500 ease-expo hover:-translate-y-1 hover:bg-flour-shade">
                  <Illustration name={r.art} className="h-20 w-20 transition-transform duration-500 ease-spring group-hover:-rotate-6 group-hover:scale-110" />
                  <span className="mt-6 font-display text-step-2 font-bold tracking-[-0.03em]">{r.label}</span>
                  <span className="mt-2 text-[0.95rem] text-cocoa/70">{r.line}</span>
                  <span aria-hidden className="mt-auto pt-6 font-display text-[0.95rem] font-semibold text-palm transition-transform duration-500 ease-expo group-hover:translate-x-1.5">
                    Go &rarr;
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-20 grid gap-10 md:grid-cols-12 md:gap-[var(--gutter)]">
            <div className="md:col-span-4">
              <h2 className="text-step-3">Or start with a favourite</h2>
              <p className="mt-4 text-cocoa/70">
                {wa ? (
                  <>
                    Looking for something specific?{" "}
                    <a href={wa} target="_blank" rel="noopener noreferrer" className="link-draw font-medium text-palm">
                      Ask us on WhatsApp
                    </a>
                    .
                  </>
                ) : (
                  "The things people order again and again."
                )}
              </p>
            </div>
            <ul className="md:col-span-8">
              {favourites.map((m) => (
                <li key={m.id} className="border-t border-cocoa/12 last:border-b">
                  <Link prefetch={false} href={`/menu/#${m.id}`} className="group flex items-center gap-5 py-4">
                    <Illustration name={m.illustration} className="h-14 w-14 shrink-0" />
                    <span className="flex-1">
                      <span className="block font-display text-step-2 font-bold tracking-[-0.03em] transition-[transform,color] duration-500 ease-expo group-hover:translate-x-2 group-hover:text-crust-deep">
                        {m.name}
                      </span>
                      <span className="block text-[0.92rem] text-cocoa/65">{m.description}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
