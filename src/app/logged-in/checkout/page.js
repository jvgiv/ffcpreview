import CheckoutFlow from "@/app/components/checkout/CheckoutFlow";
import { getPurchaseBySlug, listPurchases } from "@/lib/purchases";

export const metadata = {
  title: "Checkout | Far Flung Change",
};

export default async function LoggedInCheckoutPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const requestedAgreementSlug = resolvedSearchParams?.agreement;
  const fallbackPurchase = listPurchases()[0] || null;
  const selectedPurchase =
    getPurchaseBySlug(requestedAgreementSlug) || fallbackPurchase;

  return <CheckoutFlow initialAgreementSlug={selectedPurchase?.agreementSlug || ""} />;
}
