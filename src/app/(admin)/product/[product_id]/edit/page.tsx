import InvalidIdMessage from "@/components/common/InvalidMessage";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ProductFormCreateEdit from "@/components/products/ProductFormCreateEdit";
import { decodeId } from "@/utils/idHasher";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Alpha POS | Edit Product",
  description:
    "Ini di halaman edit product",
};

interface ProductEditPageProps {
  params: {
    product_id: string
  };
}

export default async function ProductEditPage({ params }: ProductEditPageProps) {
  const productId = decodeId(params.product_id);

  if (productId === null) {
    return (
      <InvalidIdMessage
        title="ID Product Tidak Valid"
        message="ID Product yang Anda akses tidak dapat diproses. Mohon periksa URL Anda."
      />
    );
  }
  return (
    <div>
      <PageBreadcrumb pageTitle="Edit Product" />
      <ProductFormCreateEdit mode="update" productId={productId} />
    </div>
  );
}
