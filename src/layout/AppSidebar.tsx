"use client";

import { useSidebar } from "@/context/SidebarContext";
import React from "react";

function TikTokGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="currentColor"
      aria-hidden
    >
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.14-5.1v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.12z" />
    </svg>
  );
}

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, toggleSidebar } = useSidebar();
  const showLabels = isMobileOpen || isExpanded;

  const railWidth = isExpanded ? "lg:w-[168px]" : "lg:w-[72px]";

  return (
      <aside
        className={`
          fixed left-0 top-14 z-50 flex h-[calc(100dvh-3.5rem)] flex-col border-r border-gray-200 bg-[#f3f4f6] text-gray-800 transition-transform duration-300 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100
          ${railWidth}
          ${isMobileOpen ? "w-[220px] translate-x-0" : "w-[220px] -translate-x-full"}
          lg:static lg:top-auto lg:z-0 lg:h-auto lg:min-h-0 lg:translate-x-0 lg:self-stretch
        `}
      >
        <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 py-4">
          <div
            className={`flex items-center rounded-lg border-l-[3px] border-[#1677ff] bg-[#e6f4ff] px-2 py-2.5 text-sm font-medium text-[#0958d9] dark:border-[#4096ff] dark:bg-[#1677ff]/15 dark:text-[#69b1ff] ${
              showLabels ? "gap-2" : "justify-center"
            }`}
            title="TikTok"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-black text-white">
              <TikTokGlyph className="h-5 w-5" />
            </span>
            <span className={`truncate ${showLabels ? "inline" : "hidden"}`}>
              TikTok
            </span>
          </div>
          <p
            className={`mt-2 px-2 text-[11px] leading-4 text-gray-500 dark:text-gray-400 ${
              showLabels ? "" : "hidden"
            }`}
          >
            当前工作台仅对接 TikTok Marketing API，多平台入口已隐藏。
          </p>
        </div>

        <div className="hidden border-t border-gray-200 p-2 dark:border-gray-800 lg:block">
          <button
            type="button"
            onClick={toggleSidebar}
            className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs text-gray-500 hover:bg-gray-200/80 dark:text-gray-400 dark:hover:bg-white/5"
            title={isExpanded ? "收起侧栏" : "展开侧栏"}
          >
            <span className="text-base">{isExpanded ? "«" : "»"}</span>
            {isExpanded && <span>收起</span>}
          </button>
        </div>
      </aside>
  );
};

export default AppSidebar;
