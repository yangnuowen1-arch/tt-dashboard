import type { Metadata } from "next";
import { AdsManageToolbar } from "@/components/xmp/AdsManageToolbar";
import { PromotionTableCard } from "@/components/xmp/PromotionTableCard";
import { CreativesTable } from "@/components/xmp/tables/CreativesTable";
import { CreativesSecondaryTabs } from "@/components/xmp/CreativesSecondaryTabs";
import React from "react";

export const metadata: Metadata = {
  title: "素材 | TT 投放台",
  description: "TikTok 素材管理（示例布局）",
};

export default function CreativesPage() {
  return (
    <PromotionTableCard>
      <CreativesSecondaryTabs />
      <div className="mt-4">
        <AdsManageToolbar title="素材库" />
        <CreativesTable />
      </div>
    </PromotionTableCard>
  );
}
