import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/site";

interface SectionCardOptions {
  section: string;
  title: string;
  detail: string;
  size: { width: number; height: number };
}

/**
 * Social card for a secondary page, in the frame of app/opengraph-image.tsx.
 * A page that sets its own `openGraph` metadata replaces the root image, so each one ships a card.
 */
export function renderSectionCard({ section, title, detail, size }: SectionCardOptions) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        color: "#e7eaf3",
        backgroundColor: "#0b0f17",
        backgroundImage:
          "radial-gradient(circle at 18% 0%, rgba(99,102,241,0.38), transparent 52%), radial-gradient(circle at 92% 30%, rgba(34,211,238,0.16), transparent 46%)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 36 }}>
        <svg width="48" height="48" viewBox="0 0 32 32">
          <path d="M16 2.5 4.5 12.2 16 29.5Z" fill="#a5b4fc" />
          <path d="M16 2.5 27.5 12.2 16 29.5Z" fill="#6366f1" />
          <path d="M16 18.6 19.4 15.2 16 29.5 12.6 15.2Z" fill="#22d3ee" />
        </svg>
        <div style={{ fontWeight: 600, letterSpacing: "-0.02em" }}>{siteConfig.name}</div>
        <div style={{ color: "#7a829b" }}>/</div>
        <div style={{ color: "#8e96ab" }}>{section}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            maxWidth: 1000,
            fontSize: 84,
            fontWeight: 700,
            letterSpacing: "-0.05em",
            lineHeight: 1.04,
            textWrap: "balance",
          }}
        >
          {title}
        </div>
        <div style={{ marginTop: 32, fontSize: 30, color: "#8e96ab" }}>{detail}</div>
      </div>
    </div>,
    size,
  );
}
