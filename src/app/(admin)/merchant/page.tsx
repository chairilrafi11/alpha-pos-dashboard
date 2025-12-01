import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

import { Metadata } from "next";
import React from "react";
import DataTableMerchant from "@/components/merchant/DataTableMerchant";

export const metadata: Metadata = {
  title: "Alpha POS | Merchant",
  description:
    "Ini di halaman merchant",
};

export default function MerchantPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Data Merchant" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Data Merchant">
          <DataTableMerchant />
        </ComponentCard>
      </div>
    </div>
  );
}
