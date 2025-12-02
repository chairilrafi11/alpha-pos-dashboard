"use client";

import { getMerchantDetail } from "@/services/merchantService";
import { MerchantDetail } from "@/types/merchant/merchantDetail";
import { formatIDR } from "@/utils/currencyFormatter";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function DetailMerchantMetrics({ merchantId }: { merchantId: number }) {
  const [merchantData, setMerchantData] = useState<MerchantDetail>();

  const fetchMerchantData = async () => {
    const data = await getMerchantDetail(merchantId);
    setMerchantData(data);
  };

  useEffect(() => {
    fetchMerchantData();
  }, []);

  return (
    <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-gray-800 dark:text-white/90">
            {merchantData?.name}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {merchantData?.email}
          </p>
        </div>
        <div>
          <Link
            href="/create-invoice"
            className="bg-brand-500 shadow-theme-xs hover:bg-brand-600 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M5 10.0002H15.0006M10.0002 5V15.0006"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Create an Invoice
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 rounded-xl border border-gray-200 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-y-0 dark:divide-gray-800 dark:border-gray-800">
        <div className="border-b p-5 sm:border-r lg:border-b-0">
          <p className="mb-1.5 text-sm text-gray-400 dark:text-gray-500">
            Total Transactions Value
          </p>
          <h3 className="text-3xl text-gray-800 dark:text-white/90">{formatIDR(merchantData?.total_invoices_amount)}</h3>
        </div>
        <div className="border-b p-5 lg:border-b-0">
          <p className="mb-1.5 text-sm text-gray-400 dark:text-gray-500">
            Total Invoices
          </p>
          <h3 className="text-3xl text-gray-800 dark:text-white/90">{merchantData?.total_invoices}</h3>
        </div>
        <div className="border-b p-5 sm:border-r sm:border-b-0">
          <p className="mb-1.5 text-sm text-gray-400 dark:text-gray-500">
            Employess
          </p>
          <h3 className="text-3xl text-gray-800 dark:text-white/90">{merchantData?.total_employees}</h3>
        </div>
        <div className="p-5">
          <p className="mb-1.5 text-sm text-gray-400 dark:text-gray-500">
            Branches
          </p>
          <h3 className="text-3xl text-gray-800 dark:text-white/90">
            {merchantData?.total_sites}
          </h3>
        </div>
      </div>
    </div>
  );
}
