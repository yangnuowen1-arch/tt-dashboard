import type { Metadata } from "next";
import { AdsManageToolbar } from "@/components/xmp/AdsManageToolbar";
import { PromotionTableCard } from "@/components/xmp/PromotionTableCard";
import { AdsTable } from "@/components/xmp/tables/AdsTable";
import React from "react";

export const metadata: Metadata = {
  title: "广告 | TT 投放台",
  description: "TikTok 广告管理（示例布局）",
};

export default function AdsPage() {
  return (
    <PromotionTableCard>
      <AdsManageToolbar title="广告" />
      <AdsTable />
    </PromotionTableCard>
  );
}
