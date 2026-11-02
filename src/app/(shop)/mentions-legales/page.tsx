import { LegalPage, legalMetadata } from "@/components/legal-page";

export const metadata = legalMetadata("mentions-legales");

export default function Page() {
  return <LegalPage slug="mentions-legales" />;
}
