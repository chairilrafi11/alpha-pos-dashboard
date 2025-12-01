'use client';

import InvoiceListTable from "@/components/invoice/InvoiceList";
import DetailMerchantMetrics from "@/components/merchant/detail/DetailMerchantMetrics";
import SiteList from "@/components/merchant/detail/SiteLits";
import React, { useEffect } from "react";

export default function MerchantDetailClient({ merchantId }: { merchantId: number}) {

    useEffect(() => {
        if (merchantId === null) {
            console.error("Invalid Merchant ID");
            return;
        }
        console.log("Merchant ID:", merchantId);
    }, [merchantId]);

    return (
        <div>
            <DetailMerchantMetrics id={merchantId} />
            <SiteList id={merchantId} />
        </div>
    );
}
