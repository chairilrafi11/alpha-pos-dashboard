import AccessTable from "@/components/access/AccessTable";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Access Page | Alpha POS Dashboard",
  description: "This is Access Page Alpha POS Dashboard",
};

export default function AccessPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="API Keys" />
      <AccessTable />
    </div>
  );
}
