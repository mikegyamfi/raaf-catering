import type { Metadata, Viewport } from "next";
import { Montserrat_Alternates, Poppins } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Preloader } from "@/components/motion/Preloader";
import { Cursor } from "@/components/motion/Cursor";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { business } from "@/lib/content";
import { asset, deployUrl, isProduction, siteUrl } from "@/lib/site";
import { JsonLd, defaultTitle, pageMetadata, siteDescription, siteJsonLd } from "@/lib/seo";

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

// Social defaults for every page; each page sets its own canonical link
const { openGraph, twitter } = pageMetadata({ description: siteDescription, path: "/" });

export const metadata: Metadata = {
  // Images and icons resolve against wherever this build is served; canonical links always use the real domain
  metadataBase: new URL(deployUrl + "/"),
  title: { default: defaultTitle, template: `%s · ${business.name} Catering` },
  description: siteDescription,
  applicationName: business.legalName,
  authors: [{ name: business.legalName, url: siteUrl }],
  creator: business.legalName,
  publisher: business.legalName,
  category: "food",
  openGraph,
  twitter,
  // Preview copies (e.g. GitHub Pages) stay out of search results so they never compete with the real domain
  robots: isProduction
    ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } }
    : { index: false, follow: false },
  formatDetection: { telephone: false, email: false, address: false },
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

// Runs before first paint: lets CSS hide reveal targets only when motion is allowed (no flash)
const motionScript = `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('js-motion')}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionScript }} />
        <JsonLd data={siteJsonLd()} />
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
