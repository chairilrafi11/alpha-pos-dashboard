import PageBreadcrumb from "@/components/common/PageBreadCrumb";

import { Metadata } from "next";
import React from "react";
import RoleAccessListTable from "@/components/role/RoleAccessListTable";

export const metadata: Metadata = {
  title: "Alpha POS | Role Access",
  description:
    "Ini di halaman role access",
};

export default function AccessPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Data Tables Role Access" />
      <div className="space-y-5 sm:space-y-6">
        <RoleAccessListTable />
      </div>
    </div>
  );
}
