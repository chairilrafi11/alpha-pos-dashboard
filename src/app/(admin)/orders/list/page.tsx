import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import OrderListTable from "@/components/order/OrderListTable";

export const metadata: Metadata = {
  title: "Alpha POS | Order List",
  description: "Ini di halaman order list",
};

export default function OrderListPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Data Table Order" />
      <div className="space-y-5 sm:space-y-6">
        <OrderListTable />
      </div>
    </div>
  );
}
