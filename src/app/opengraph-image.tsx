import { ImageResponse } from "next/og";

// Share image of every page without a photo of its own. Built once, at build time, in the colours of the site.
export const alt = "pommeau-filtrant.fr : pommeaux de douche filtrants, filtres et recharges";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #0b5d7b 0%, #0a5470 55%, #08445b 100%)",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 36 }}>
          <svg width="68" height="68" viewBox="0 0 38 38">
            <rect width="38" height="38" rx="11" fill="#ffffff" />
            <path d="M10 18.5a9 9 0 0 1 18 0z" fill="none" stroke="#0b5d7b" strokeWidth="2.4" strokeLinejoin="round" />
          <path d="M19 9.5V7h5.5" fill="none" stroke="#0b5d7b" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 23.5v2.5M19 23.5v4M24 23.5v2.5" fill="none" stroke="#f27d52" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
          <span style={{ display: "flex" }}>
            <b style={{ fontWeight: 800 }}>pommeau</b>&nbsp;filtrant
            <span style={{ color: "#bfe0ec" }}>.fr</span>
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 78, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, maxWidth: 960 }}>
            Le pommeau filtrant qui se visse sur votre douche
          </div>
          <div style={{ fontSize: 34, color: "#dbeef4" }}>Vitamine C, charbon actif, filtres à visser et recharges</div>
        </div>
      </div>
    ),
    size,
  );
}
