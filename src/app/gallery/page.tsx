import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";
import { Gallery } from "@/components/gallery/Gallery";
import { OrderCta } from "@/components/sections/OrderCta";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Pastries, breads, cakes, small chops and meals from the RAAF kitchen.",
  alternates: { canonical: "/gallery/" },
};

export default function GalleryPage() {
  return (
    <>
      <PageIntro title="Gallery" lead="A look inside the RAAF kitchen: what comes out of the oven, off the stove and onto the table." illustration="cake" />
      <section className="pb-28 md:pb-40" aria-label="Photos">
        <div className="shell">
          <Gallery />
        </div>
      </section>
      <OrderCta />
    </>
  );
}
