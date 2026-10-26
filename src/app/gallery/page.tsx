import type { Metadata } from "next";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { PageIntro } from "@/components/layout/PageIntro";
import { Gallery } from "@/components/gallery/Gallery";
import { OrderCta } from "@/components/sections/OrderCta";

export const metadata: Metadata = pageMetadata({
  title: "Gallery",
  description: "Photos from the RAAF kitchen: meat pies, small chops platters, butter bread, celebration cakes, party jollof and more, made for every occasion.",
  path: "/gallery/",
  image: "og/gallery.jpg",
});

export default function GalleryPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd("Gallery", "/gallery/")} />
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
