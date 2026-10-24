import type { Metadata, Viewport } from "next";
import { Montserrat_Alternates, Poppins } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Preloader } from "@/components/motion/Preloader";
import { Cursor } from "@/components/motion/Cursor";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { business, about, isPlaceholder, hours, menu, categories } from "@/lib/content";
import { asset, siteUrl } from "@/lib/site";

const display = Montserrat_Alternates({
  variable: "--font-montserrat-alt",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const body = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});


const description = "RAAF Professional Catering Services: a home-based caterer making fresh pastries, breads, cakes, small chops and Ghanaian meals for every occasion. Good food. Great moments.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl + "/"),
  title: {
    default: `${business.name} · ${business.legalName}`,
    template: `%s · ${business.name} Catering`,
  },
  description,
  applicationName: business.legalName,
  openGraph: {
    type: "website",
    siteName: business.legalName,
    title: `${business.name}: ${business.tagline}`,
    description,
    images: [{ url: "og.png", width: 1200, height: 630, alt: "RAAF Professional Catering Services: Good food. Great moments." }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${business.name}: ${business.tagline}`,
    description,
    images: ["og.png"],
  },
  icons: {
    icon: [{ url: asset("/favicon.ico"), sizes: "any" }, { url: asset("/icon.png"), type: "image/png", sizes: "96x96" }],
    apple: asset("/apple-icon.png"),
  },
  manifest: asset("/manifest.webmanifest"),
};

export const viewport: Viewport = {
  themeColor: "#fbf6ee",
  width: "device-width",
  initialScale: 1,
};

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Bakery JSON-LD built only from real details; placeholders are left out. */
function jsonLd() {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["Bakery", "FoodEstablishment"],
    name: business.legalName,
    alternateName: business.name,
    slogan: business.tagline,
    description: about.paragraphs[0],
    url: siteUrl,
    servesCuisine: ["Ghanaian", "Pastries", "Baked goods"],
    hasMenu: {
      "@type": "Menu",
      url: `${siteUrl}/menu/`,
      hasMenuSection: categories.map((c) => ({
        "@type": "MenuSection",
        name: c.label,
        hasMenuItem: menu.filter((m) => m.category === c.id).map((m) => ({ "@type": "MenuItem", name: m.name, description: m.description })),
      })),
    },
  };
  if (!isPlaceholder(business.phone)) data.telephone = `+${business.phone}`;
  if (!isPlaceholder(business.email)) data.email = business.email;
  if (!isPlaceholder(business.address) || !isPlaceholder(business.area)) {
    data.address = {
      "@type": "PostalAddress",
      ...(isPlaceholder(business.address) ? {} : { streetAddress: business.address }),
      ...(isPlaceholder(business.area) ? {} : { addressLocality: business.area }),
      ...(isPlaceholder(business.country) ? {} : { addressCountry: business.country }),
    };
  }
  if (hours) {
    data.openingHoursSpecification = hours.map((h) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: h.days.map((d) => DAYS[d]), opens: h.open, closes: h.close }));
  }
  const socials = business.socials.map((s) => s.href).filter((h) => !isPlaceholder(h));
  if (socials.length) data.sameAs = socials;
  return JSON.stringify(data);
}

// Runs before first paint: lets CSS hide reveal targets only when motion is allowed (no flash)
const motionScript = `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('js-motion')}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd() }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SmoothScroll>
          <Preloader />
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <Cursor />
        </SmoothScroll>
      </body>
    </html>
  );
}
