import type { Metadata } from "next";
import DashboardMain from "@/components/dashboard/DashboardMain";

export const metadata: Metadata = {
  title:
    "Alpha POS Dashboard | Super Admin Home",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function Home() {
  return (
    <div>
      <DashboardMain />
    </div>
  );
}
