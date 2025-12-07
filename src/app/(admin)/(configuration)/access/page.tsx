import PageBreadcrumb from "@/components/common/PageBreadCrumb";

import { Metadata } from "next";
import React from "react";
import AccessListTable from "@/components/access/AccessListTable";

export const metadata: Metadata = {
  title: "Alpha POS | Access",
  description:
    "Ini di halaman access",
};

export default function AccessPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Data Tables Access" />
      <div className="space-y-5 sm:space-y-6">
        <AccessListTable />
      </div>
    </div>
  );
}
