import Image from "next/image";
import type { CartProduct } from "@/lib/cart";
import { Icon } from "./icon";

/** Small square picture of a product: its photo, or its drawing while it has none. */
export function Thumb({ product, size }: { product: Pick<CartProduct, "image" | "icon">; size: number }) {
  return (
    <span className="thumb" style={{ width: size, height: size }}>
      {product.image ? (
        <Image src={product.image.src} alt="" width={size * 2} height={size * 2} sizes={`${size}px`} />
      ) : (
        <Icon name={product.icon} size={Math.round(size * 0.45)} />
      )}
    </span>
  );
}
