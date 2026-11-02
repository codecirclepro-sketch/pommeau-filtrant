import { LegalPage, legalMetadata } from "@/components/legal-page";

export const metadata = legalMetadata("confidentialite");

export default function Page() {
  return <LegalPage slug="confidentialite" />;
}
