"use client";

import React, { useEffect, useMemo, useState } from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import { SuperAdminMetrix } from "@/types/dashboard/SuperAdminMetrix";
import { getSuperAdminMetrix } from "@/services/dashboardService";
import { SuperAdminMetrics } from "@/components/dashboard/SuperAdminMetrix";
import AnalyticsMetrics from "./AnalyticsMetrics";
import { OrderStatisticsChart } from "./OrderStatisticChart";
import { SessionPlatformChart } from "./SessionPlatformChart";
import { SessionsPieChart } from "./SessionsPieChart";
import { TopMerchantList } from "./TopMerchantList";
import { TopProductList } from "./TopProductList";

export default function DashboardSuperAdmin() {
  const [data, setData] = useState<SuperAdminMetrix>();
  const [isLoading, setIsLoading] = useState(true);

  const params = useMemo(() => {
    return {
      limit: 10,
    };
  }, []);

  useEffect(() => {
    if (!params) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getSuperAdminMetrix();
        setData(data);
      } catch (error) {
        setData(undefined);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [params]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">

      <div className="col-span-12">
        <AnalyticsMetrics platformSummary={data?.platform_summary} />
        {/* <div className="col-span-12 space-y-6 xl:col-span-7"> */}
        {/* <SuperAdminMetrics platformSummary={data?.platform_summary} /> */}

        {/* <MonthlySalesChart /> */}
      </div>

      <div className="col-span-12">
        <OrderStatisticsChart orders={data?.order_status} />
        {/* <MonthlyTarget /> */}
      </div>

      <div className="col-span-12 xl:col-span-4">
        <SessionsPieChart data={data?.sessions_by_platform} />
        {/* <SessionPlatformChart data={data?.sessions_by_platform} /> */}
      </div>

      <div className="col-span-12 xl:col-span-4">
        <TopMerchantList topMerchantList={data?.top_merchants} />
      </div>

      <div className="col-span-12 xl:col-span-4">
        <TopProductList topProductList={data?.top_products} />
      </div>

      {/* <div className="col-span-12">
        <StatisticsChart />
      </div> */}

      {/* <div className="col-span-12 xl:col-span-5">
        <DemographicCard />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <RecentOrders />
      </div> */}
    </div>
  );
}
