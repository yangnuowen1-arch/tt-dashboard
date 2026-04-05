"use client";

import NotificationDropdown from "@/components/header/NotificationDropdown";
import UserDropdown from "@/components/header/UserDropdown";
import { useSidebar } from "@/context/SidebarContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

const topNav: { href: string; label: string }[] = [
  { href: "/dashboard", label: "看板" },
  { href: "/", label: "推广" },
  { href: "/creatives", label: "素材" },
  { href: "#", label: "流量池" },
  { href: "#", label: "管理" },
  { href: "#", label: "工具" },
  { href: "#", label: "自动助手" },
  { href: "#", label: "投放诊断" },
];

const AppHeader: React.FC = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const pathname = usePathname();

  const promotionModulePaths = ["/", "/campaigns", "/ad-groups", "/ads"];
  const isPromotionModule = promotionModulePaths.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
  const isCreativesModule =
    pathname === "/creatives" || pathname.startsWith("/creatives/");

  const handleToggle = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };

  return (
    <header className="sticky top-0 z-100 flex w-full shrink-0 flex-col border-b border-black/10 bg-[#141414] text-white">
      <div className="flex h-14 items-center justify-between gap-3 px-3 lg:px-5">
        <div className="flex min-w-0 items-center gap-2 lg:gap-4">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-gray-200 hover:bg-white/5 lg:hidden"
            onClick={handleToggle}
            aria-label="打开菜单"
          >
            <HamburgerIcon open={isMobileOpen} />
          </button>

          <Link href="/" className="hidden shrink-0 items-center gap-2 lg:flex">
            <span className="text-lg font-semibold tracking-tight text-white">
              TT 投放台
            </span>
            <span className="rounded border border-white/15 px-1.5 py-0.5 text-[10px] font-medium text-white/70">
              TikTok
            </span>
          </Link>

          <Link href="/" className="shrink-0 text-base font-semibold lg:hidden">
            TT 投放台
          </Link>

          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 xl:flex">
            {topNav.map((item) => {
              const active =
                item.href !== "#" &&
                (item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : item.href === "/"
                    ? isPromotionModule
                    : item.href === "/creatives"
                      ? isCreativesModule
                      : pathname === item.href ||
                        pathname.startsWith(`${item.href}/`));
              if (item.href === "#") {
                return (
                  <span
                    key={item.label}
                    className="cursor-default px-2.5 py-2 text-sm text-white/35"
                  >
                    {item.label}
                  </span>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-md px-2.5 py-2 text-sm transition-colors ${
                    active
                      ? "bg-white/10 font-medium text-white"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={toggleApplicationMenu}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-white/80 hover:bg-white/5 xl:hidden"
            aria-label="更多菜单"
          >
            <DotsIcon />
          </button>

          <div className="hidden items-center gap-1 sm:flex">
            <NotificationDropdown variant="dark" />
            <button
              type="button"
              title="帮助"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-white/80 hover:bg-white/5"
            >
              <HelpIcon />
            </button>
            <button
              type="button"
              className="rounded-md px-2 py-1.5 text-sm text-white/80 hover:bg-white/5"
            >
              中文
            </button>
          </div>
          <UserDropdown variant="dark" />
        </div>
      </div>

      {isApplicationMenuOpen && (
        <div className="border-t border-white/10 px-3 py-3 xl:hidden">
          <nav className="flex flex-wrap gap-1">
            {topNav.map((item) =>
              item.href === "#" ? (
                <span
                  key={item.label}
                  className="cursor-default rounded-md px-2 py-1.5 text-sm text-white/35"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setApplicationMenuOpen(false)}
                  className="rounded-md px-2 py-1.5 text-sm text-white/85 hover:bg-white/10"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

function HamburgerIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M6 6l12 12M18 6L6 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
      <path
        d="M0 1h20M0 8h20M0 15h14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DotsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 18h.01M9.09 9a3 3 0 115.83 1c0 2-3 2-3 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default AppHeader;
