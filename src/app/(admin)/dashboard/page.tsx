import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import React from "react";

export const metadata: Metadata = {
  title: "看板 | TT 投放台",
  description: "投放数据总览",
};

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-(--breakpoint-2xl) space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-gray-800 dark:text-white/90">看板</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          TikTok 账户汇总指标（示例数据，可替换为真实报表接口）。
        </p>
      </div>
      <EcommerceMetrics />
      <MonthlySalesChart />
    </div>
  );
}
