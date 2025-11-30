"use client";

import React, { useEffect, useMemo, useState } from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import { SuperAdminMetrix } from "@/types/dashboard/SuperAdminMetrix";
import { getSuperAdminMetrix } from "@/services/dashboardService";
import { SuperAdminMetrics } from "@/components/dashboard/SuperAdminMetrix";

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
        {/* <div className="col-span-12 space-y-6 xl:col-span-7"> */}
        <SuperAdminMetrics platformSummary={data?.platform_summary} />

        {/* <MonthlySalesChart /> */}
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div>

      <div className="col-span-12">
        <StatisticsChart />
      </div>

      {/* <div className="col-span-12 xl:col-span-5">
        <DemographicCard />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <RecentOrders />
      </div> */}
    </div>
  );
}
