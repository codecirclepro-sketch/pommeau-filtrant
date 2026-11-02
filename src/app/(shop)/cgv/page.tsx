import { LegalPage, legalMetadata } from "@/components/legal-page";

export const metadata = legalMetadata("cgv");

export default function Page() {
  return <LegalPage slug="cgv" />;
}
