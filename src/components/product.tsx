import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/content/types";
import { productIcon } from "@/lib/cart-products";
import { AVAILABILITY, buyable, filterValues, formatPrice, productPath } from "@/lib/catalogue";
import { QuickAdd } from "./add-to-cart";
import type { FilterItem } from "./filtered-grid";
import { Icon } from "./icon";

/** The product's first photo, or its drawing while the product has none. */
export function ProductPicture({ product, sizes }: { product: Product; sizes: string }) {
  const img = product.images[0];
  if (!img)
    return (
      <div className="pic pic-empty" aria-hidden="true">
        <Icon name={productIcon(product)} size={56} />
      </div>
    );
  return (
    <div className="pic">
      <Image src={img.src} alt={img.alt} width={img.width} height={img.height} sizes={sizes} />
    </div>
  );
}

export function Stock({ product }: { product: Product }) {
  return <span className={`stock stock-${product.availability}`}>{AVAILABILITY[product.availability].label}</span>;
}

/**
 * A product in a grid: the photo on its grey tile with the round add button, then the brand, the name, the summary,
 * the price and the button to its page. The whole card opens the product; the round button adds it without leaving.
 */
export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="card">
      <div className="card-media">
        <ProductPicture product={product} sizes="(max-width: 640px) 50vw, (max-width: 1100px) 33vw, 290px" />
        <QuickAdd slug={product.slug} name={product.name} available={buyable(product)} />
      </div>
      <div className="card-body">
        {product.brand && <p className="card-brand">{product.brand}</p>}
        <h3 className="card-title">
          <Link href={productPath(product)} className="card-link">
            {product.name}
          </Link>
        </h3>
        <p className="card-summary">{product.summary}</p>
        <p className="card-price">{product.price ? formatPrice(product.price) : "Prix à venir"}</p>
        {product.availability !== "in_stock" && <Stock product={product} />}
        <span className="card-cta">Voir le produit</span>
      </div>
    </article>
  );
}

/** The products as the items of a FilteredGrid: each card rendered here, on the server. */
export const gridItems = (products: Product[]): FilterItem[] =>
  products.map((p) => ({ slug: p.slug, price: p.price, values: filterValues(p), card: <ProductCard product={p} /> }));

export function ProductGrid({ products, scroll }: { products: Product[]; scroll?: boolean }) {
  return (
    <div className={scroll ? "grid grid-scroll" : "grid"}>
      {products.map((p) => (
        <ProductCard key={p.slug} product={p} />
      ))}
    </div>
  );
}
