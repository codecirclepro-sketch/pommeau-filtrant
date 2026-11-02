import Image from "next/image";
import Link from "next/link";
import type { Guide } from "@/lib/guides";
import { Icon } from "./icon";

/** A guide in a list: its photo when it has one (otherwise a book icon), title, description and a short line. */
export function GuideCard({ guide, meta }: { guide: Guide; meta: string }) {
  return (
    <Link href={`/guides/${guide.slug}`} className={guide.image ? "guide-card has-image" : "guide-card"}>
      {guide.image ? (
        <span className="guide-card-media">
          <Image src={guide.image.src} alt="" width={600} height={400} sizes="(max-width: 640px) 100vw, 320px" />
        </span>
      ) : (
        <Icon name="book" size={22} />
      )}
      <span className="guide-card-title">{guide.title}</span>
      <span className="guide-card-desc">{guide.description}</span>
      <span className="guide-card-meta">{meta}</span>
    </Link>
  );
}
