import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import CategoryListTable from "@/components/category/CategoryListTable";

export const metadata: Metadata = {
  title: "Alpha POS | Product List",
  description:
    "Ini di halaman product",
};

export default function ProductListPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Data Table Category" />
      <div className="space-y-5 sm:space-y-6">
        <CategoryListTable />
      </div>
    </div>
  );
}
