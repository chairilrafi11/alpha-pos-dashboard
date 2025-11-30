import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TransactionList from "@/components/ecommerce/TransactionList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Alpha POS | Order",
  description:
    "This is Order",
};

export default function OrdersPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Orders" />
      <TransactionList />
    </div>
  );
}
