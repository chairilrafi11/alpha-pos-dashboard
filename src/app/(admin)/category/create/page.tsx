import CategoryFormCreateEdit from "@/components/category/CategoryFormCreateEdit";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Alpha POS | Create Category",
  description:
    "Ini di halaman create Category",
};

export default async function CategoryCreatePage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Create Category" />
      <CategoryFormCreateEdit mode="create" />
    </div>
  );
}
