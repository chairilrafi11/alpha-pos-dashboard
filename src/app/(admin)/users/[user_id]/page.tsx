import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { decodeId } from "@/utils/idHasher";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alpha POS | Merchant Detail",
  description: "Ini di halaman merchant",
};

export default function MerchantDetailPage({ params }: { params: { id: string } }) {
  const hashedId = params.id;
  const merchantId = decodeId(hashedId);

  if (merchantId === null) {
    console.error("Invalid Merchant ID");
    return;
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Merchant Detail" />
      {/* <MerchantDetailClient merchantId={merchantId} /> */}
    </div>
  );
}
