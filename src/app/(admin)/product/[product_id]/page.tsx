import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { decodeId } from "@/utils/idHasher";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alpha POS | Merchant Detail",
  description: "Ini di halaman merchant",
};

export default function ProductDetailPage({ params }: { params: { product_id: string } }) {
  const hashedId = params.product_id;
  const merchantId = decodeId(hashedId);

  if (merchantId === null) {
    console.error("Invalid Product ID");
    return;
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Product Detail" />
    </div>
  );
}
