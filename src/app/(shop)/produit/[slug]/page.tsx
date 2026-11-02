import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/add-to-cart";
import { BuyBar } from "@/components/buy-bar";
import { Gallery } from "@/components/gallery";
import { Icon } from "@/components/icon";
import { ProductGrid, Stock } from "@/components/product";
import { RangePicker, SpecTable } from "@/components/product-parts";
import { Breadcrumb, JsonLd, phone } from "@/components/site";
import { SHOP } from "@/content/shop";
import type { Product } from "@/content/types";
import { productIcon, toCartProduct } from "@/lib/cart-products";
import { AVAILABILITY, buyable, categoryPath, formatPrice, getCategory, getProduct, productPath, products } from "@/lib/catalogue";
import { getGuide } from "@/lib/guides";
import { renderInline, splitBody } from "@/lib/product-body";
import { pageMeta } from "@/lib/seo";
import { DOMAIN, url } from "@/lib/site";
import { faqLd, returnPolicyLd, shippingLd, STORE_ID } from "@/lib/structured";
import { paymentOpen } from "@/lib/stripe";

export const dynamicParams = false;

export const generateStaticParams = () => products().map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: PageProps<"/produit/[slug]">) {
  const product = getProduct((await params).slug);
  if (!product) return {};
  const img = product.images[0];
  return pageMeta({
    title: product.title,
    description: product.description,
    path: productPath(product),
    index: !product.draft,
    image: img ? { url: img.src, width: img.width, height: img.height, alt: img.alt } : undefined,
  });
}

/**
 * Product and Offer for Google's product results. Delivery appears once src/content/shop.ts has rates. The offer is
 * left out while visitors cannot pay (paymentOpen, read at build time): a price in the results must be payable.
 */
function productLd(product: Product) {
  const shipping = shippingLd();
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.summary,
    sku: product.sku,
    ...(product.mpn && { mpn: product.mpn }),
    ...(product.gtin && { gtin: product.gtin }),
    ...(product.brand && { brand: { "@type": "Brand", name: product.brand } }),
    ...(product.images.length && { image: product.images.map((i) => url(i.src)) }),
    // No offer without a price (a draft whose price is not known yet).
    offers: product.price > 0 && paymentOpen() ? {
      "@type": "Offer",
      url: url(productPath(product)),
      price: (product.price / 100).toFixed(2),
      priceCurrency: "EUR",
      availability: AVAILABILITY[product.availability].schema,
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "OnlineStore", "@id": STORE_ID, name: DOMAIN },
      ...(shipping && { shippingDetails: shipping }),
      hasMerchantReturnPolicy: returnPolicyLd(),
    } : undefined,
  };
}

/** What the buy box says about delivery: the cheapest rate and delay once src/content/shop.ts has them. */
function deliveryText() {
  const cheapest = [...SHOP.shipping].sort((a, b) => a.amount - b.amount)[0];
  if (!cheapest) return `en ${SHOP.countryNames}, frais affichés avant le paiement`;
  const price = cheapest.amount ? `dès ${formatPrice(cheapest.amount)}` : "offerte";
  return `${price}, en ${cheapest.minDays} à ${cheapest.maxDays} jours ouvrés`;
}

export default async function ProductPage({ params }: PageProps<"/produit/[slug]">) {
  const product = getProduct((await params).slug);
  if (!product) notFound();
  const category = getCategory(product.category);
  const related = (product.related ?? []).map(getProduct).filter((p) => p !== undefined);
  const guides = (category?.guides ?? []).map(getGuide).filter((g) => g !== undefined);
  const { sections, faq } = splitBody(product.body);
  const open = paymentOpen();
  const faqData = faqLd(product.body);

  return (
    <>
      <Breadcrumb
        items={[
          ...(category ? [{ name: category.name, path: categoryPath(category) }] : []),
          { name: product.name, path: productPath(product) },
        ]}
      />
      <JsonLd data={productLd(product)} />
      {faqData && <JsonLd data={faqData} />}
      {/* Price in the share previews (Facebook, Pinterest), which read `property`; React moves these tags to <head>. */}
      {product.price > 0 && (
        <>
          <meta property="product:price:amount" content={(product.price / 100).toFixed(2)} />
          <meta property="product:price:currency" content="EUR" />
        </>
      )}
      {product.draft && (
        <p className="wrap draft-note">Fiche en préparation : les informations surlignées en jaune arrivent, et le prix peut encore changer.</p>
      )}

      <div className="wrap pdp">
        <div className="pdp-gallery">
          <Gallery images={product.images} icon={productIcon(product)} />
        </div>

        <div className="pdp-buy">
          <p className="pdp-top">
            {category && (
              <Link href={categoryPath(category)} className="pill">
                {category.name}
              </Link>
            )}
            <span className="pdp-ref">Réf. {product.sku}</span>
          </p>
          {product.brand && <p className="pdp-brand">{product.brand}</p>}
          <h1>{product.name}</h1>
          <p className="pdp-summary">{product.summary}</p>

          <div className="pdp-price-row">
            {product.price ? (
              <p className="pdp-price">{formatPrice(product.price)}</p>
            ) : (
              <p className="pdp-price">
                <mark className="todo">[À compléter : prix]</mark>
              </p>
            )}
            <Stock product={product} />
          </div>
          <p className="pdp-tax">
            {SHOP.vatExempt ? "TVA non applicable, art. 293 B du CGI" : "Prix TTC"}
          </p>

          <RangePicker product={product} />

          {product.specs.length > 0 && (
            <ul className="pdp-points">
              {product.specs.slice(0, 4).map((s) => (
                <li key={s.label}>
                  <Icon name="check" size={16} />
                  <span>
                    <strong>{s.label}</strong> {s.value}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <AddToCart slug={product.slug} available={buyable(product)} paymentOpen={open} />

          <ul className="pdp-assure">
            <li>
              <Icon name="truck" size={20} />
              <span>
                <strong>Livraison</strong> {product.dispatch ? `${product.dispatch}, ` : ""}
                {deliveryText()}
              </span>
            </li>
            <li>
              <Icon name="undo" size={20} />
              <span>
                <strong>Rétractation</strong> 14 jours après réception, comme pour tout achat à distance (
                <Link href="/livraison-retours">retours</Link>)
              </span>
            </li>
            <li>
              <Icon name="lock" size={20} />
              <span>
                <strong>Paiement sécurisé</strong> par carte, sur la page de Stripe
              </span>
            </li>
            {phone && (
              <li>
                <Icon name="call" size={20} />
                <span>
                  <strong>Une question ?</strong> <a href={phone.href}>{phone.label}</a> ou <Link href="/contact">par e-mail</Link>
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>

      <nav className="pdp-tabs" aria-label="Sur cette page">
        <div className="wrap">
          <a href="#description">Description</a>
          {product.specs.length > 0 && <a href="#caracteristiques">Caractéristiques</a>}
          {faq.length > 0 && <a href="#questions">Questions</a>}
          {related.length > 0 && <a href="#compatibles">Produits compatibles</a>}
        </div>
      </nav>

      <section className="wrap pdp-story" aria-labelledby="description">
        <p className="eyebrow">En détail</p>
        <h2 id="description" className="section-title">
          Description
        </h2>
        <div className="story">
          {sections.map((s, i) => (
            <article key={s.title || i} className="story-card">
              {s.title && <h3>{s.title}</h3>}
              <div className="prose" dangerouslySetInnerHTML={{ __html: s.html }} />
            </article>
          ))}
        </div>
      </section>

      {product.specs.length > 0 && (
        <section className="wrap pdp-tech" aria-labelledby="caracteristiques">
          <div className="pdp-tech-text">
            <p className="eyebrow">Fiche technique</p>
            <h2 id="caracteristiques" className="section-title">
              Caractéristiques
            </h2>
            <p>
              Les caractéristiques annoncées par le fabricant et le fournisseur. Un doute sur la compatibilité avec votre
              matériel ? Écrivez-nous avant de commander.
            </p>
            {guides.length > 0 && (
              <div className="side-box">
                <h3>Pour bien choisir</h3>
                <ul>
                  {guides.map((g) => (
                    <li key={g.slug}>
                      <Link href={`/guides/${g.slug}`}>
                        {g.title}
                        <Icon name="arrow" size={16} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <SpecTable product={product} />
        </section>
      )}

      {faq.length > 0 && (
        <section className="wrap pdp-faq" aria-labelledby="questions">
          <p className="eyebrow">FAQ</p>
          <h2 id="questions" className="section-title">
            Questions fréquentes
          </h2>
          <div className="faq">
            {faq.map((f, i) => (
              <details key={f.q} open={i === 0}>
                <summary>
                  <span dangerouslySetInnerHTML={{ __html: renderInline(f.q) }} />
                  <Icon name="plus" size={20} />
                </summary>
                <p dangerouslySetInnerHTML={{ __html: renderInline(f.a) }} />
              </details>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="wrap band" aria-labelledby="compatibles">
          <p className="eyebrow">Compatibles</p>
          <h2 id="compatibles" className="section-title">
            Complétez votre équipement
          </h2>
          <ProductGrid products={related} scroll />
        </section>
      )}

      <BuyBar product={toCartProduct(product)} />
    </>
  );
}
