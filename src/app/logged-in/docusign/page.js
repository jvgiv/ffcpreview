import EmbeddedSigningDemo from "@/app/components/docusign/EmbeddedSigningDemo";
import { getAgreementBySlug } from "@/lib/agreements";

export const metadata = {
  title: "DocuSign | Far Flung Change",
};

export default async function LoggedInDocuSignPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const requestedAgreementSlug = resolvedSearchParams?.agreement;
  const agreement = getAgreementBySlug(requestedAgreementSlug);

  return <EmbeddedSigningDemo initialAgreementSlug={agreement?.slug} />;
}
