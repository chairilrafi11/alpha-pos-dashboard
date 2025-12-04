import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import ShiftingHistoryListTable from "@/components/shifting-history/ShiftingHistoryListTable";

export const metadata: Metadata = {
  title: "Alpha POS | Shifting History List",
  description: "Ini di halaman Shifting History list",
};

export default function ShiftingHistoryListPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Data Table Shifting History" />
      <div className="space-y-5 sm:space-y-6">
        <ShiftingHistoryListTable />
      </div>
    </div>
  );
}
