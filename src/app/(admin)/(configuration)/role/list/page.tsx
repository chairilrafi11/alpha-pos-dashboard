import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import RoleTable from "@/components/role/RoleTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Role Page | Alpha POS Dashboard",
  description: "This is Role Page Alpha POS Dashboard",
};

export default function RolesPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Role" />
      <RoleTable />
    </div>
  );
}
