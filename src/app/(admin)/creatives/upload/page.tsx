import type { Metadata } from "next";
import { BatchCreativeUploadApp } from "@/components/creatives/batch/BatchCreativeUploadApp";
import React from "react";

export const metadata: Metadata = {
  title: "批量上传素材 | TT 投放台",
  description: "批量素材上传、规格校验与异步处理状态（前端）",
};

export default function CreativeBatchUploadPage() {
  return <BatchCreativeUploadApp />;
}
