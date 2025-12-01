import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import MerchantFormCreate from "@/components/merchant/MerchantFormCreate";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Alpha POS | Create Merchant",
  description:
    "Ini di halaman create merchant",
};

export default function CreateMerchantPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Create Merchant" />
      <MerchantFormCreate />
    </div>
  );
}
