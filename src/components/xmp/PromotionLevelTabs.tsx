"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs: { href: string; label: string }[] = [
  { href: "/", label: "广告账户" },
  { href: "/campaigns", label: "推广系列" },
  { href: "/ad-groups", label: "广告组" },
  { href: "/ads", label: "广告" },
  { href: "/creatives", label: "素材" },
];

export function PromotionLevelTabs() {
  const pathname = usePathname();

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-1 border-b border-gray-200 bg-white px-4 lg:px-5">
      {tabs.map((tab) => {
        const active =
          tab.href === "/"
            ? pathname === "/"
            : pathname === tab.href || pathname.startsWith(`${tab.href}/`);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`relative px-3 py-3 text-sm font-medium transition-colors ${
              active
                ? "text-[#1677ff] after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:rounded-full after:bg-[#1677ff]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
