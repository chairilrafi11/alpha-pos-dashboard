"use client";

import React, { useEffect, useMemo, useState } from "react";
import { DashboardGroupMetrics } from "@/types/dashboard/DashboardGroupMetrics";
import { getDashboardGroupMetrics } from "@/services/client/dashboardService";
import ClientAnalyticsMetrics from "./ClientAnalyticsMetrics";
import { useAuth } from "@/context/AuthContext";
import { DashboardDataRequest } from "@/types/dashboard/DashboardDataRequest";
import { OrderStatisticsChart } from "./OrderStatisticChart";
import SitesPerformanceList from "./SitePerformanceList";
import TopProductClientList from "./TopProductClientList";

export default function DashboardOwner() {
  const [data, setData] = useState<DashboardGroupMetrics>();
  const [isLoading, setIsLoading] = useState(true);

  const { isLoading: isAuthLoading } = useAuth();

  const params: DashboardDataRequest = useMemo(() => {
    return {
      current_start: "2025-09-01",
      current_end: "2025-09-30",
      compare_start: "2025-08-01",
      compare_end: "2025-08-31",
    };
  }, []);

  useEffect(() => {
    if (isAuthLoading) return;

    const fetchData = async () => {

      try {
        setIsLoading(true);
        const data = await getDashboardGroupMetrics(params);

        setData(data);
      } catch (error) {
        setData(undefined);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [params, isAuthLoading]);

  if (isLoading) {
    return <div className="p-4 text-center text-gray-500">Loading metrics...</div>;
  }

  if (!data) {
    return <div className="p-4 text-center text-red-500">Failed to load dashboard data. Please check network connection.</div>;
  }

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <ClientAnalyticsMetrics summary={data.summary} />
      </div>
      <div className="col-span-12">
        <OrderStatisticsChart orders={data?.order_status} />
      </div>
      <div className="col-span-12 xl:col-span-12">
        <SitesPerformanceList sitePerformanceList={data?.site_performance} />
      </div>
      <div className="col-span-12 xl:col-span-12">
        <TopProductClientList data={data?.top_products} />
      </div>
    </div>
  );
}