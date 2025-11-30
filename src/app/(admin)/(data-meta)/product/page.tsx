import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

import { Metadata } from "next";
import React from "react";
import DataTableProduct from "@/components/data-meta/DataTableProduct";

export const metadata: Metadata = {
  title: "Alpha POS | Data Meta Product",
  description:
    "Ini di halaman product",
};

export default function ProductsPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Data Tables Product" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Data Product">
          <DataTableProduct />
        </ComponentCard>
      </div>
    </div>
  );
}
