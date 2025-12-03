import InvalidIdMessage from "@/components/common/InvalidMessage";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import UserFormCreateEdit from "@/components/users/UserFormCreateEdit";
import { decodeId } from "@/utils/idHasher";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Alpha POS | Create Merchant User",
  description:
    "Ini di halaman create merchant branch",
};

export default async function CreateUserPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Create User" />
      <UserFormCreateEdit mode="create" />
    </div>
  );
}
