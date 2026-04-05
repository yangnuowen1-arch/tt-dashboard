import type { Metadata } from "next";
import { AdsManageToolbar } from "@/components/xmp/AdsManageToolbar";
import { PromotionTableCard } from "@/components/xmp/PromotionTableCard";
import { CreativesTable } from "@/components/xmp/tables/CreativesTable";
import { CreativesSecondaryTabs } from "@/components/xmp/CreativesSecondaryTabs";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "素材 | TT 投放台",
  description: "TikTok 素材管理（示例布局）",
};

export default function CreativesPage() {
  return (
    <PromotionTableCard>
      <CreativesSecondaryTabs />
      <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
        <Link
          href="/creatives/upload"
          className="rounded-md border border-[#1677ff] bg-[#e6f4ff] px-3 py-1.5 text-sm font-medium text-[#0958d9] shadow-sm hover:bg-[#bae0ff] dark:border-[#4096ff] dark:bg-[#1677ff]/20 dark:text-[#69b1ff] dark:hover:bg-[#1677ff]/30"
        >
          批量上传素材
        </Link>
      </div>
      <div className="mt-4">
        <AdsManageToolbar title="素材库" />
        <CreativesTable />
      </div>
    </PromotionTableCard>
  );
}
