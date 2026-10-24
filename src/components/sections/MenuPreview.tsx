import { MenuBoard, previewTabs } from "@/components/menu/MenuBoard";
import { RevealText } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { menu } from "@/lib/content";

export function MenuPreview() {
  return (
    <section className="relative bg-flour-deep pb-28 pt-10 md:pb-40" aria-labelledby="menu-title">
      <div className="shell">
        <div className="grid gap-8 md:grid-cols-12 md:items-end md:gap-[var(--gutter)]">
          <RevealText as="h2" id="menu-title" className="text-step-6 md:col-span-7">
            Something for every table.
          </RevealText>
          <RevealText className="measure text-cocoa/75 md:col-span-4 md:col-start-9" delay={0.1}>
            {menu.length} dishes and bakes, from a single meat pie to a full spread for your guests. Choose a category to look around.
          </RevealText>
        </div>
        <MenuBoard tabs={previewTabs} limit={6} className="mt-14" />
        <div className="mt-12 flex flex-wrap items-center gap-4">
          <Button href="/menu/">See the full menu</Button>
          <p className="text-[0.92rem] text-cocoa/65">Prices are shared when you order.</p>
        </div>
      </div>
    </section>
  );
}
