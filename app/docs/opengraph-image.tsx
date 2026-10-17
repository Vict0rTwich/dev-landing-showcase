import { siteConfig } from "@/lib/site";
import { renderSectionCard } from "@/lib/og";

export const alt = `${siteConfig.name} documentation: three commands to a global deploy`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return renderSectionCard({
    section: "Docs",
    title: "Three commands to a global deploy.",
    detail: `Install the CLI, link a project, run ${siteConfig.cliCommand}.`,
    size,
  });
}
