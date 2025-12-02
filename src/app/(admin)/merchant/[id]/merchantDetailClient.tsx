'use client';

import DetailMerchantMetrics from "@/components/merchant/detail/DetailMerchantMetrics";
import React, { useEffect } from "react";
import BranchList from "@/components/merchant/detail/BranchList";

export default function MerchantDetailClient({ merchantId }: { merchantId: number }) {

    useEffect(() => {
        if (merchantId === null) {
            console.error("Invalid Merchant ID");
            return;
        }
        console.log("Merchant ID:", merchantId);
    }, [merchantId]);

    return (
        <div>
            <DetailMerchantMetrics merchantId={merchantId} />
            <BranchList merchantId={merchantId} />
        </div>
    );
}
