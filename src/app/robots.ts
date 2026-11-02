import type { MetadataRoute } from "next";
import { INDEXABLE, url } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  if (!INDEXABLE) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/admin", "/panier", "/commande/"] },
    sitemap: url("/sitemap.xml"),
  };
}
