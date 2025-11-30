import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

import { Metadata } from "next";
import React from "react";
import DataTableUser from "@/components/user/DataTableUser";
import DataTableCategory from "@/components/data-meta/DataTableCategory";

export const metadata: Metadata = {
  title: "Alpha POS | Data Meta Category",
  description:
    "Ini di halaman category",
};

export default function CategoryPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Data Tables Category" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Data Category">
          <DataTableCategory />
        </ComponentCard>
      </div>
    </div>
  );
}
