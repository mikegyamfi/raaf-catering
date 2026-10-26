import type { Metadata } from "next";
import { business, about, isPlaceholder, hours, menu, categories } from "./content";
import { siteUrl } from "./site";

export const siteName = business.legalName;

/**
 * Share card for WhatsApp, Facebook, X, LinkedIn… (1200×630 JPEG, well under WhatsApp's ~300 KB limit).
 * Resolved against metadataBase, so it always loads from wherever the site is served.
 * Regenerate with scripts/make-og.mjs.
 */
const shareImage = (file: string, alt: string) => ({ url: file, type: "image/jpeg", width: 1200, height: 630, alt });

/** Absolute URL on the real domain, e.g. abs("/menu/") → https://www.raafcatering.com/menu/ */
export const abs = (path: string) => `${siteUrl}${path}`;

/**
 * Metadata for one page. Next replaces (rather than merges) openGraph and
 * twitter objects from the layout, so every page builds the full set here.
 */
export function pageMetadata({ title, description, path, image = "og.jpg" }: { title?: string; description: string; path: string; image?: string }): Metadata {
  const fullTitle = title ? `${title} · RAAF Catering` : defaultTitle;
  const card = shareImage(image, title ? `${title}: ${business.legalName}` : `${business.legalName}: ${business.tagline}`);
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: abs(path) },
    openGraph: { type: "website", siteName, locale: "en_GB", url: abs(path), title: fullTitle, description, images: [card] },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [{ url: card.url, alt: card.alt }] },
  };
}

export const defaultTitle = `${business.legalName} · Pastries, Small Chops & Meals`;

export const siteDescription =
  "Fresh pastries, breads, cakes, small chops packs and Ghanaian meals from a home kitchen, made to order for every occasion. Good food. Great moments.";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Site-wide structured data, built only from real details; placeholders are left out. */
export function siteJsonLd() {
  const biz: Record<string, unknown> = {
    "@type": ["FoodEstablishment", "Bakery"],
    "@id": abs("/#business"),
    name: business.legalName,
    alternateName: [business.name, business.shortName],
    slogan: business.tagline,
    description: about.paragraphs[0],
    url: abs("/"),
    image: abs("/og.jpg"),
    logo: abs("/icon-512.png"),
    servesCuisine: ["Ghanaian", "Pastries", "Baked goods", "Small chops"],
    hasMenu: {
      "@type": "Menu",
      url: abs("/menu/"),
      hasMenuSection: categories.map((c) => ({
        "@type": "MenuSection",
        name: c.label,
        hasMenuItem: menu.filter((m) => m.category === c.id).map((m) => ({ "@type": "MenuItem", name: m.name, description: m.description })),
      })),
    },
  };
  if (!isPlaceholder(business.phone)) biz.telephone = `+${business.phone}`;
  if (!isPlaceholder(business.email)) biz.email = business.email;
  if (!isPlaceholder(business.address) || !isPlaceholder(business.area)) {
    biz.address = {
      "@type": "PostalAddress",
      ...(isPlaceholder(business.address) ? {} : { streetAddress: business.address }),
      ...(isPlaceholder(business.area) ? {} : { addressLocality: business.area }),
      ...(isPlaceholder(business.country) ? {} : { addressCountry: business.country }),
    };
  }
  if (!isPlaceholder(business.deliveryArea)) biz.areaServed = business.deliveryArea;
  if (hours) {
    biz.openingHoursSpecification = hours.map((h) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: h.days.map((d) => DAYS[d]), opens: h.open, closes: h.close }));
  }
  const socials = business.socials.map((s) => s.href).filter((h) => !isPlaceholder(h));
  if (socials.length) biz.sameAs = socials;

  const site = { "@type": "WebSite", "@id": abs("/#website"), url: abs("/"), name: business.legalName, alternateName: "RAAF Catering", publisher: { "@id": abs("/#business") }, inLanguage: "en" };
  return { "@context": "https://schema.org", "@graph": [biz, site] };
}

/** Home › Page breadcrumb for an inner page. */
export function breadcrumbJsonLd(name: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: abs("/") },
      { "@type": "ListItem", position: 2, name, item: abs(path) },
    ],
  };
}

/** Renders structured data; "<" is escaped so content can never close the script tag. */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
