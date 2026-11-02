import { ImageResponse } from "next/og";

// Home-screen icon for iOS: the mark of src/app/icon.svg, as a PNG.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#0b5d7b", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="150" height="150" viewBox="0 0 38 38">
          <path d="M10 18.5a9 9 0 0 1 18 0z" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinejoin="round" />
          <path d="M19 9.5V7h5.5" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 23.5v2.5M19 23.5v4M24 23.5v2.5" fill="none" stroke="#f27d52" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      </div>
    ),
    size,
  );
}
