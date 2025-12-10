import React from "react";
import Badge from "../ui/badge/Badge";
import { formatIDR } from "@/utils/currencyFormatter";
import { GroupSummary } from "@/types/dashboard/DashboardGroupMetrics";

type Props = {
  summary: GroupSummary | undefined;
};

export const ClientAnalyticsMetrics = ({ summary }: Props) => {
  //? Set Data
  const data = [
    {
      id: 1,
      title: "Total Net Revenue",
      value: formatIDR(summary?.net_revenue),
      change: summary?.net_revenue_change,
      direction: "up",
      comparisonText: "",
    },
    {
      id: 2,
      title: "Total Orders",
      value: summary?.total_orders,
      change: summary?.total_orders_change,
      direction: "up",
      comparisonText: "",
    },
    {
      id: 3,
      title: "Average Orders",
      value: formatIDR(summary?.average_order_value),
      change: summary?.aov_change,
      direction: "up",
      comparisonText: "",
    },
    {
      id: 4,
      title: "Total Gross Sales",
      value: formatIDR(summary?.total_gross_sales),
      change: summary?.total_gross_sales_change,
      direction: "up",
      comparisonText: "",
    },
    {
      id: 5,
      title: "Total Items Sold",
      value: summary?.total_items_sold,
      change: summary?.total_items_sold_change,
      direction: "up",
      comparisonText: "",
    },
    {
      id: 6,
      title: "Total Discount",
      value: formatIDR(summary?.total_discount),
      change: summary?.total_discount_change,
      direction: "up",
      comparisonText: "",
    },
    {
      id: 7,
      title: "Total User",
      value: summary?.total_users,
      // change: summary?.total_discount_change,
      direction: "up",
      comparisonText: "",
    },
    {
      id: 8,
      title: "Total Products",
      value: summary?.total_products,
      // change: summary?.total_discount_change,
      direction: "up",
      comparisonText: "",
    },
  ]
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
      {data.map((item) => (
        <div
          key={item.id}
          className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]"
        >
          <p className="text-gray-500 text-theme-sm dark:text-gray-400">
            {item.title}
          </p>
          <div className="flex items-end justify-between mt-3">
            <div>
              <h4 className="text-2xl font-bold text-gray-800 dark:text-white/90">
                {item.value}
              </h4>
            </div>
            <div className="flex items-center gap-1">
              <Badge
                color={
                  item.direction === "up"
                    ? "success"
                    : item.direction === "down"
                      ? "error"
                      : "warning"
                }
              >
                <span className="text-xs"> {item.change}</span>
              </Badge>
              <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                {item.comparisonText}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClientAnalyticsMetrics;
