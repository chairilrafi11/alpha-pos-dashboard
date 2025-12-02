import InvalidIdMessage from "@/components/common/InvalidMessage";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BranchFormCreate from "@/components/branch/BranchFormCreate";
import { decodeId } from "@/utils/idHasher";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Alpha POS | Edit Merchant Branch",
  description:
    "Ini di halaman Edit merchant branch",
};

interface BranchEditPageProps {
  params: {
    id: string,
    branchId: string
  };
}

export default async function CreateBranchPage({ params }: BranchEditPageProps) {
  const hashedId = params.id;
  const merchantId = decodeId(hashedId);
  const branchId = decodeId(params.branchId);

  if (merchantId === null || branchId === null) {
    return (
      <InvalidIdMessage
        title="ID Merchant Tidak Valid"
        message="ID Merchant yang Anda akses tidak dapat diproses. Mohon periksa URL Anda."
      />
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Edit Merchant Branch" />
      <BranchFormCreate mode="update" merchantId={merchantId} branchId={branchId}/>
    </div>
  );
}
