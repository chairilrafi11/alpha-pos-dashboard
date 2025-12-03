import InvalidIdMessage from "@/components/common/InvalidMessage";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { decodeId } from "@/utils/idHasher";
import { Metadata } from "next";
import React from "react";
import UserFormCreateEdit from "@/components/users/UserFormCreateEdit";

export const metadata: Metadata = {
  title: "Alpha POS | Edit User",
  description:
    "Ini di halaman Edit User",
};

interface UserEditPageProps {
  params: {
    user_id: string
  };
}

export default async function CreateUserPage({ params }: UserEditPageProps) {
  const userId = decodeId(params.user_id);

  if (userId === null) {
    return (
      <InvalidIdMessage
        title="ID User Tidak Valid"
        message="ID User yang Anda akses tidak dapat diproses. Mohon periksa URL Anda."
      />
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Edit User" />
      <UserFormCreateEdit mode="update" userId={userId} />
    </div>
  );
}
