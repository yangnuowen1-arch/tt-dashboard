"use client";

import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import { PromotionShell } from "@/components/xmp/PromotionShell";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f5f6f8] dark:bg-gray-950">
      <AppHeader />
      <div className="flex min-h-0 flex-1">
        <AppSidebar />
        <Backdrop />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <PromotionShell>{children}</PromotionShell>
        </div>
      </div>
    </div>
  );
}
