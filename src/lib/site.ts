import { business } from "./content";

/**
 * Hosting settings. On GitHub Pages the site lives under a sub-path
 * (e.g. /raaf-catering), set at build time through environment variables:
 *   NEXT_PUBLIC_BASE_PATH=/raaf-catering
 *   NEXT_PUBLIC_SITE_URL=https://user.github.io/raaf-catering
 * Locally and on the real domain both are empty and nothing changes.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix a /public file path with the base path (links do this automatically; assets don't). */
export const asset = (path: string) => `${basePath}${path}`;

/** The site's real home. Canonical links, the sitemap and search data always point here. */
export const siteUrl = business.siteUrl.replace(/\/$/, "");

/** Where this particular build is served from: the real domain, or a preview such as GitHub Pages. */
export const deployUrl = (process.env.NEXT_PUBLIC_SITE_URL || siteUrl).replace(/\/$/, "");

const bareHost = (url: string) => new URL(url).host.replace(/^www\./, "");

/** Only the real domain (with or without www) is indexed; preview copies ask search engines to stay away. */
export const isProduction = bareHost(deployUrl) === bareHost(siteUrl);
