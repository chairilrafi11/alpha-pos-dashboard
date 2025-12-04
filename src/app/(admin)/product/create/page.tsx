import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ProductFormCreateEdit from "@/components/products/ProductFormCreateEdit";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Alpha POS | Create Product",
  description:
    "Ini di halaman create product",
};

export default async function ProductCreatePage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Create Product" />
      <ProductFormCreateEdit mode="create" />
    </div>
  );
}
