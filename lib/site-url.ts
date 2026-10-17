/**
 * Absolute origin used for metadata, the sitemap and robots.txt.
 * Set NEXT_PUBLIC_SITE_URL once you have a custom domain; on Vercel the
 * production URL is picked up automatically.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}
