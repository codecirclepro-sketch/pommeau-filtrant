import type { Product } from "@/content/types";
import type { CartProduct } from "./cart";
import { buyable, productPath, products } from "./catalogue";

/** The drawing shown in place of a missing photo. */
export const productIcon = (p: Product): CartProduct["icon"] =>
  p.sku.startsWith("ACC") ? "box" : /recharge/i.test(p.name) ? "refill" : "shower";

export const toCartProduct = (p: Product): CartProduct => ({
  slug: p.slug,
  name: p.name,
  price: p.price,
  path: productPath(p),
  available: buyable(p),
  image: p.images[0] ? { src: p.images[0].src, alt: p.images[0].alt } : null,
  icon: productIcon(p),
  related: p.related ?? [],
});

/** Every product of this build, for the cart drawer and the cart page. */
export const cartProducts = (): CartProduct[] => products().map(toCartProduct);
