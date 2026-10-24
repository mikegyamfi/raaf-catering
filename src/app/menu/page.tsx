import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";
import { MenuBoard, fullTabs } from "@/components/menu/MenuBoard";
import { Packs } from "@/components/sections/Packs";
import { OrderCta } from "@/components/sections/OrderCta";
import { menu, business, isPlaceholder } from "@/lib/content";

export const metadata: Metadata = {
  title: "Menu",
  description: `Pastries, small chops, breads, cakes, chips and Ghanaian meals from ${business.legalName}: meat pies, bofrot, butter bread, jollof, waakye, banku, fufu and more.`,
  alternates: { canonical: "/menu/" },
};

export default function MenuPage() {
  const anyPrices = menu.some((m) => !isPlaceholder(m.price));
  return (
    <>
      <PageIntro
        title="The menu"
        lead="Everything we cook and bake, from a single meat pie to a full spread for a celebration. Filter by what you're craving."
        illustration="pie"
      />
      <section className="pb-28 md:pb-36" aria-label="Menu">
        <div className="shell">
          {!anyPrices ? (
            <p className="mb-10 text-[0.95rem] text-toast">
              Prices and portion sizes are shared when you order. Just ask.
            </p>
          ) : null}
          <MenuBoard tabs={fullTabs} withIds />
        </div>
      </section>
      <Packs />
      <OrderCta />
    </>
  );
}
