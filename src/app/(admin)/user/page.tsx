import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

import { Metadata } from "next";
import React from "react";
import DataTableUser from "@/components/user/DataTableUser";

export const metadata: Metadata = {
  title: "Alpha POS | Users",
  description:
    "Ini di halaman user",
};

export default function UsersPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Data Tables User" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Data User">
          <DataTableUser />
        </ComponentCard>
      </div>
    </div>
  );
}
