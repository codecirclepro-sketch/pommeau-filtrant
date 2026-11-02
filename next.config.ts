import type { NextConfig } from "next";

const dev = process.env.NODE_ENV !== "production";

// No third-party script, font or image: everything is served by the site itself. Payment happens on
// checkout.stripe.com, reached by a plain navigation, which this policy does not restrict.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
          ...(dev ? [] : [{ key: "Strict-Transport-Security", value: "max-age=31536000" }]),
        ],
      },
    ];
  },
  async redirects() {
    // One host for search engines: www answers with a permanent redirect to the bare domain.
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.pommeau-filtrant.fr" }],
        destination: "https://pommeau-filtrant.fr/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
