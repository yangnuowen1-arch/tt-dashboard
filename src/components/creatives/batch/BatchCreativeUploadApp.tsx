"use client";

import Link from "next/link";
import { useBatchCreativeUpload } from "@/hooks/useBatchCreativeUpload";
import { useCreativeJobSocket } from "@/hooks/useCreativeJobSocket";
import { getCreativeJobsWsUrl } from "@/lib/creative/wsConfig";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BatchCreativeQueueTable } from "./BatchCreativeQueueTable";
import { BatchUploadDropzone } from "./BatchUploadDropzone";
import { CreativePreviewModal } from "./CreativePreviewModal";

export function BatchCreativeUploadApp() {
  const {
    items,
    maxItems,
    maxVideos,
    mockMode,
    addFiles,
    removeItem,
    uploadAllPending,
    retry,
    publish,
    applySocketMessage,
    secondaryAction,
  } = useBatchCreativeUpload("tiktok_infeed");

  const wsUrl = useMemo(() => getCreativeJobsWsUrl(), []);
  useCreativeJobSocket({
    url: wsUrl,
    enabled: Boolean(wsUrl) && !mockMode,
    onMessage: applySocketMessage,
  });

  useEffect(() => {
    if (!mockMode && !wsUrl) {
      console.warn(
        "[creative] 已关闭 Mock 但未配置 NEXT_PUBLIC_CREATIVE_JOBS_WS，处理进度需 WebSocket 推送或自行轮询接口。"
      );
    }
  }, [mockMode, wsUrl]);

  const [previewId, setPreviewId] = useState<string | null>(null);
  const previewItem = items.find((i) => i.clientItemId === previewId) ?? null;

  const handleAdd = useCallback(
    async (files: FileList | File[]) => {
      await addFiles(files);
    },
    [addFiles]
  );

  const readyCount = items.filter((i) => i.status === "ready").length;

  return (
    <div className="mx-auto max-w-(--breakpoint-2xl) space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Link href="/creatives" className="text-[#1677ff] hover:underline">
              ← 返回素材库
            </Link>
          </div>
          <h1 className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">批量上传素材</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            上传前使用本地 ObjectURL 即时预览；成功后按环境切换为远程 URL。处理进度由 WebSocket 推送（未配置时启用前端
            Mock 流水线）。
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => uploadAllPending()}
            className="rounded-md bg-[#1677ff] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#4096ff]"
          >
            上传全部待传
          </button>
          <button
            type="button"
            disabled={!readyCount}
            onClick={async () => {
              for (const it of items.filter((i) => i.status === "ready")) {
                await publish(it.clientItemId);
              }
            }}
            className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-white/5"
          >
            发布全部就绪 ({readyCount})
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-theme-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-3 flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400">
          <span>
            模式：<strong className="text-gray-900 dark:text-white">{mockMode ? "Mock（默认）" : "真实 API"}</strong>
          </span>
          <span>
            WebSocket：
            <strong className="text-gray-900 dark:text-white">
              {wsUrl ? "已配置 NEXT_PUBLIC_CREATIVE_JOBS_WS" : "未配置（Mock 下不连接）"}
            </strong>
          </span>
          <span>
            关闭 Mock：设置环境变量{" "}
            <code className="rounded bg-gray-100 px-1 dark:bg-white/10">NEXT_PUBLIC_CREATIVE_UPLOAD_MOCK=false</code>
          </span>
        </div>
        <BatchUploadDropzone
          onFiles={handleAdd}
          maxItems={maxItems}
          maxVideos={maxVideos}
          disabled={items.length >= maxItems}
        />
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-theme-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">上传队列</h2>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {items.length}/{maxItems} · 视频 {items.filter((i) => i.kind === "video").length}/{maxVideos}
          </span>
        </div>
        <BatchCreativeQueueTable
          items={items}
          mockMode={mockMode}
          onPreview={setPreviewId}
          onPublish={(id) => publish(id)}
          onRetry={(id) => retry(id)}
          onRemove={(id) => removeItem(id)}
          onSecondary={(id, a) => secondaryAction(id, a)}
        />
      </div>

      <CreativePreviewModal
        item={previewItem}
        mockMode={mockMode}
        onClose={() => setPreviewId(null)}
        onPublish={(id) => publish(id)}
      />
    </div>
  );
}
