import Link from "next/link";
import type { Product } from "@/content/types";
import { formatPrice, productPath, rangeOf } from "@/lib/catalogue";

// Server parts of the product page: the range picker and the specification table.

/** The other products of the range (colours, packs), as options linking to their page. */
export function RangePicker({ product }: { product: Product }) {
  const range = rangeOf(product);
  if (!range) return null;
  return (
    <nav className="range" aria-label={range.title}>
      <p className="range-title">{range.title}</p>
      <ul>
        {range.items.map((p) => (
          <li key={p.slug}>
            <Link
              href={productPath(p)}
              scroll={false}
              className="range-opt"
              aria-current={p.slug === product.slug ? "page" : undefined}
            >
              <span className="range-name">{p.range?.option}</span>
              <span className="range-price">{formatPrice(p.price)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** The specifications, as given by the manufacturer, and the reference. */
export function SpecTable({ product }: { product: Product }) {
  return (
    <table className="specs">
      <tbody>
        {product.specs.map((s) => (
          <tr key={s.label}>
            <th scope="row">{s.label}</th>
            <td>{s.value}</td>
          </tr>
        ))}
        <tr>
          <th scope="row">Référence</th>
          <td>{product.sku}</td>
        </tr>
      </tbody>
    </table>
  );
}
