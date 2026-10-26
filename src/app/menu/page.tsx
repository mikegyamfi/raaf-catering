import type { Metadata } from "next";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { PageIntro } from "@/components/layout/PageIntro";
import { MenuBoard, fullTabs } from "@/components/menu/MenuBoard";
import { Packs } from "@/components/sections/Packs";
import { OrderCta } from "@/components/sections/OrderCta";
import { menu, isPlaceholder } from "@/lib/content";

export const metadata: Metadata = pageMetadata({
  title: "Menu",
  description: "Meat pies, bofrot, spring rolls, butter bread, celebration cakes, jollof, waakye, banku and fufu. See the full RAAF Catering menu and small chops packs.",
  path: "/menu/",
  image: "og/menu.jpg",
});

export default function MenuPage() {
  const anyPrices = menu.some((m) => !isPlaceholder(m.price));
  return (
    <>
      <JsonLd data={breadcrumbJsonLd("Menu", "/menu/")} />
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
