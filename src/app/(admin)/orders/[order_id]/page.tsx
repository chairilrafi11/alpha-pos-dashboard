import InvalidIdMessage from "@/components/common/InvalidMessage";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import OrderDetailMain from "@/components/order/OrderDetail";
import { decodeId } from "@/utils/idHasher";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Order Detail | Alpha POS Dashboard",
  description: "This is Order Detail | Alpha POS Dashboard",
};

interface OrderDetailPageProps {
  params: {
    order_id: string
  };
}
export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const orderId = decodeId(params.order_id);

  if (orderId === null) {
    return (
      <InvalidIdMessage
        title="ID Order Tidak Valid"
        message="ID Order yang Anda akses tidak dapat diproses. Mohon periksa URL Anda."
      />
    );
  }
  return (
    <div>
      <PageBreadcrumb pageTitle="Invoice Detail" />
      <OrderDetailMain order_id={orderId} />
    </div>
  );
}
