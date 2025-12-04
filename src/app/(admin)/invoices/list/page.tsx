import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import InvoiceListTable from "@/components/invoice/InvoiceListTable";

export const metadata: Metadata = {
  title: "Alpha POS | Invoice List",
  description: "Ini di halaman invoice list",
};

export default function InvoiceListPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Data Table Invoice" />
      <div className="space-y-5 sm:space-y-6">
        <InvoiceListTable />
      </div>
    </div>
  );
}
