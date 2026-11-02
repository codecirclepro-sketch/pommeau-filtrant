import { CartDrawer } from "@/components/cart-drawer";
import { Hit } from "@/components/hit";
import { Footer, Header } from "@/components/site";
import { cartProducts } from "@/lib/cart-products";
import { INDEXABLE } from "@/lib/site";
import { paymentOpen } from "@/lib/stripe";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#contenu" className="skip">
        Aller au contenu
      </a>
      {!INDEXABLE && <p className="preview-bar">Site en préparation : les fiches produits et les informations sont provisoires.</p>}
      <Header />
      <main id="contenu">{children}</main>
      <Footer />
      <CartDrawer products={cartProducts()} paymentOpen={paymentOpen()} />
      <Hit />
    </>
  );
}
