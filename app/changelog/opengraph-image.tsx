import { formatReleaseDate, latestRelease } from "@/lib/data/changelog";
import { siteConfig } from "@/lib/site";
import { renderSectionCard } from "@/lib/og";

export const alt = `${siteConfig.name} changelog: ${latestRelease.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return renderSectionCard({
    section: "Changelog",
    title: latestRelease.title,
    detail: `Latest release: v${latestRelease.version}, ${formatReleaseDate(latestRelease.date)}`,
    size,
  });
}
