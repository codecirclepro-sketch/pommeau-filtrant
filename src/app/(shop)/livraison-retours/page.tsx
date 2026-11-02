import { LegalPage, legalMetadata } from "@/components/legal-page";

export const metadata = legalMetadata("livraison-retours");

export default function Page() {
  return <LegalPage slug="livraison-retours" />;
}
