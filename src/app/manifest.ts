import type { MetadataRoute } from "next";
import { business } from "@/lib/content";
import { asset } from "@/lib/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: business.legalName,
    short_name: business.name,
    description: business.tagline,
    start_url: asset("/"),
    id: asset("/"),
    scope: asset("/"),
    lang: "en",
    categories: ["food", "shopping"],
    display: "standalone",
    background_color: "#fbf6ee",
    theme_color: "#2a1a11",
    icons: [
      { src: asset("/icon-192.png"), sizes: "192x192", type: "image/png" },
      { src: asset("/icon-512.png"), sizes: "512x512", type: "image/png" },
      { src: asset("/icon-512.png"), sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
