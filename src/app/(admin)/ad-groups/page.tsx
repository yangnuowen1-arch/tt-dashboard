import type { Metadata } from "next";
import { AdsManageToolbar } from "@/components/xmp/AdsManageToolbar";
import { PromotionTableCard } from "@/components/xmp/PromotionTableCard";
import { AdGroupsTable } from "@/components/xmp/tables/AdGroupsTable";
import React from "react";

export const metadata: Metadata = {
  title: "广告组 | TT 投放台",
  description: "TikTok 广告组管理（示例布局）",
};

export default function AdGroupsPage() {
  return (
    <PromotionTableCard>
      <AdsManageToolbar title="广告组" />
      <AdGroupsTable />
    </PromotionTableCard>
  );
}
