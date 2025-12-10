"use client";

import DashboardSuperAdmin from "@/components/dashboard/DashboardSuperAdmin";
import { useAuth } from "@/context/AuthContext";
import DashboardOwner from "./DashboardOwner";

export default function DashboardMain() {
    const { profile } = useAuth();
    if (profile?.role.id == 1) {
        return (
            <div>
                <DashboardSuperAdmin />
            </div>
        );
    } else {
        return (
            <div>
                <DashboardOwner />
            </div>
        );
    }
}
