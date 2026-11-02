import { ShopPage } from "@/components/shop-page";
import { BOUTIQUE } from "@/content/facets";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: BOUTIQUE.title, description: BOUTIQUE.description, path: "/boutique" });

export default function BoutiquePage() {
  return <ShopPage />;
}
