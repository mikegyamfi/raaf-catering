import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-static";

const base = siteUrl;

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/menu/", "/story/", "/gallery/", "/order/"].map((path, i) => ({
    url: `${base}${path || "/"}`,
    changeFrequency: "monthly",
    priority: i === 0 ? 1 : 0.8,
  }));
}
