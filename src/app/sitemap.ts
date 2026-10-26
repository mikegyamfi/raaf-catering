import type { MetadataRoute } from "next";
import { abs } from "@/lib/seo";

export const dynamic = "force-static";

// Trailing slashes match the canonical links (trailingSlash: true).
// Photos are left out while the slots hold stand-in stock images (see README).
const pages = [
  { path: "/", priority: 1 },
  { path: "/menu/", priority: 0.9 },
  { path: "/order/", priority: 0.9 },
  { path: "/gallery/", priority: 0.7 },
  { path: "/story/", priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return pages.map((p) => ({ url: abs(p.path), lastModified, changeFrequency: "monthly", priority: p.priority }));
}
