"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { ProductImage } from "@/content/types";
import type { CartProduct } from "@/lib/cart";
import { Icon } from "./icon";

/**
 * The product's photos in a strip that swipes on touch screens (scroll snap), with thumbnails and a counter, or a
 * drawing while there is none. Every photo is in the HTML with its alt text.
 */
export function Gallery({ images, icon }: { images: ProductImage[]; icon: CartProduct["icon"] }) {
  const track = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  if (!images.length)
    return (
      <div className="gallery">
        <div className="gallery-empty" aria-hidden="true">
          <Icon name={icon} size={88} />
        </div>
      </div>
    );
  const go = (i: number) => {
    const el = track.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };
  return (
    <div className="gallery">
      <div
        className="gallery-track"
        ref={track}
        onScroll={(e) => setCurrent(Math.round(e.currentTarget.scrollLeft / Math.max(1, e.currentTarget.clientWidth)))}
      >
        {images.map((img, i) => (
          <div className="gallery-slide" key={img.src}>
            <Image
              src={img.src}
              alt={img.alt}
              width={img.width}
              height={img.height}
              sizes="(max-width: 900px) 100vw, 620px"
              {...(i === 0 && { loading: "eager", fetchPriority: "high" })}
            />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <>
          <p className="gallery-count" aria-hidden="true">
            {current + 1} / {images.length}
          </p>
          <ul className="gallery-thumbs">
            {images.map((im, i) => (
              <li key={im.src}>
                <button type="button" onClick={() => go(i)} aria-current={i === current} aria-label={`Voir la photo ${i + 1}`}>
                  <Image src={im.src} alt="" width={160} height={160} sizes="80px" />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
