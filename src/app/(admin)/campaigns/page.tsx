import type { Metadata } from "next";
import { AdsManageToolbar } from "@/components/xmp/AdsManageToolbar";
import { PromotionTableCard } from "@/components/xmp/PromotionTableCard";
import { CampaignsTable } from "@/components/xmp/tables/CampaignsTable";
import React from "react";

export const metadata: Metadata = {
  title: "推广系列 | TT 投放台",
  description: "TikTok 推广系列管理（示例布局）",
};

export default function CampaignsPage() {
  return (
    <PromotionTableCard>
      <AdsManageToolbar title="推广系列" />
      <CampaignsTable />
    </PromotionTableCard>
  );
}
