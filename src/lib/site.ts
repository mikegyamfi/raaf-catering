import { business, isPlaceholder } from "./content";

/**
 * Hosting settings. On GitHub Pages the site lives under a sub-path
 * (e.g. /raaf-catering), set at build time through environment variables:
 *   NEXT_PUBLIC_BASE_PATH=/raaf-catering
 *   NEXT_PUBLIC_SITE_URL=https://user.github.io/raaf-catering
 * Locally and on a custom domain both are empty and nothing changes.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix a /public file path with the base path (links do this automatically; assets don't). */
export const asset = (path: string) => `${basePath}${path}`;

/** The public address of the site, used for SEO, social previews and the sitemap. */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || (isPlaceholder(business.siteUrl.replace("https://", "")) ? "https://raaf.example" : business.siteUrl)).replace(/\/$/, "");
