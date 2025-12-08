import InvalidIdMessage from "@/components/common/InvalidMessage";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import InvoiceDetailMain from "@/components/invoice/InvoiceDetail";
import { decodeId } from "@/utils/idHasher";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Invoice Detail | Alpha POS Dashboard",
  description: "This is Invoice Detail | Alpha POS Dashboard",
};

interface InvoiceDetailPageProps {
  params: {
    invoice_id: string
  };
}
export default function InvoiceDetailPage({ params }: InvoiceDetailPageProps) {
  const invoiceId = decodeId(params.invoice_id);

  if (invoiceId === null) {
    return (
      <InvalidIdMessage
        title="ID Invoice Tidak Valid"
        message="ID Invoice yang Anda akses tidak dapat diproses. Mohon periksa URL Anda."
      />
    );
  }
  return (
    <div>
      <PageBreadcrumb pageTitle="Invoice Detail" />
      <InvoiceDetailMain invoice_id={invoiceId} />
    </div>
  );
}
