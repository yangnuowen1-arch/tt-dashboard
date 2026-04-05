"use client";

import { usePathname } from "next/navigation";
import { PromotionLevelTabs } from "./PromotionLevelTabs";

const PROMOTION_PREFIXES = ["/", "/campaigns", "/ad-groups", "/ads", "/creatives"];

function isPromotionView(pathname: string) {
  if (pathname === "/") return true;
  return PROMOTION_PREFIXES.slice(1).some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

export function PromotionShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showPromotion = isPromotionView(pathname);

  if (!showPromotion) {
    return <div className="min-h-0 flex-1 bg-gray-50 p-4 md:p-6">{children}</div>;
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-[#f5f6f8]">
      <PromotionLevelTabs />
      <div className="min-h-0 min-w-0 flex-1 overflow-auto p-4 lg:p-5">{children}</div>
    </div>
  );
}
