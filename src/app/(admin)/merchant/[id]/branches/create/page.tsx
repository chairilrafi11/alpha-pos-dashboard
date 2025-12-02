import InvalidIdMessage from "@/components/common/InvalidMessage";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import MerchantFormCreate from "@/components/merchant/MerchantFormCreate";
import BranchFormCreate from "@/components/branch/BranchFormCreate";
import { decodeId } from "@/utils/idHasher";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Alpha POS | Create Merchant Branch",
  description:
    "Ini di halaman create merchant branch",
};

interface BranchCreatePageProps {
  params: {
    id: string
  };
}

export default async function CreateBranchPage({ params }: BranchCreatePageProps) {
  const hashedId = params.id;
  const merchantId = decodeId(hashedId);

  if (merchantId === null) {
    return (
      <InvalidIdMessage
        title="ID Merchant Tidak Valid"
        message="ID Merchant yang Anda akses tidak dapat diproses. Mohon periksa URL Anda."
      />
    );
  }


  return (
    <div>
      <PageBreadcrumb pageTitle="Create Merchant Branch" />
      <BranchFormCreate merchantId={merchantId} />
    </div>
  );
}
