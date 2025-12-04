import CategoryFormCreateEdit from "@/components/category/CategoryFormCreateEdit";
import InvalidIdMessage from "@/components/common/InvalidMessage";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { decodeId } from "@/utils/idHasher";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Alpha POS | Edit Category",
  description:
    "Ini di halaman edit category",
};

interface CategoryEditPageProps {
  params: {
    category_id: string
  };
}

export default async function CategoryEditPage({ params }: CategoryEditPageProps) {
  const categoryId = decodeId(params.category_id);

  if (categoryId === null) {
    return (
      <InvalidIdMessage
        title="Category Tidak Valid"
        message="Category yang Anda akses tidak dapat diproses. Mohon periksa URL Anda."
      />
    );
  }
  return (
    <div>
      <PageBreadcrumb pageTitle="Edit Category" />
      <CategoryFormCreateEdit mode="update" categoryId={categoryId} />
    </div>
  );
}
