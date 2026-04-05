"use client";

import type { QueueItem } from "@/hooks/useBatchCreativeUpload";
import React, { useEffect } from "react";

type Props = {
  item: QueueItem | null;
  mockMode: boolean;
  onClose: () => void;
  onPublish: (id: string) => void;
};

function previewSrc(item: QueueItem, mockMode: boolean) {
  if (!mockMode && item.remoteUrl) return item.remoteUrl;
  return item.localPreviewUrl;
}

export function CreativePreviewModal({ item, mockMode, onClose, onPublish }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!item) return null;

  const src = previewSrc(item, mockMode);
  const canPublish = item.status === "ready";

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="素材预览"
    >
      <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-theme-lg dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-800">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">{item.file.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {item.kind === "video" ? "视频" : "图片"} · {item.meta.width}×{item.meta.height}
              {item.meta.durationSec != null ? ` · ${item.meta.durationSec.toFixed(1)}s` : ""}
            </p>
          </div>
          <button
            type="button"
            className="rounded-lg px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10"
            onClick={onClose}
          >
            关闭
          </button>
        </div>
        <div className="flex max-h-[calc(90vh-56px)] flex-col lg:flex-row">
          <div className="flex flex-1 items-center justify-center bg-black p-4">
            {item.kind === "video" ? (
              <video
                key={src}
                className="max-h-[55vh] w-full max-w-full rounded-md"
                src={src}
                controls
                playsInline
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt="" className="max-h-[55vh] max-w-full object-contain" />
            )}
          </div>
          <div className="w-full shrink-0 border-t border-gray-200 p-4 text-sm dark:border-gray-800 lg:w-[280px] lg:border-l lg:border-t-0">
            <p className="font-medium text-gray-800 dark:text-gray-100">自动标签</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {item.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700 dark:bg-white/10 dark:text-gray-200"
                >
                  {t}
                </span>
              ))}
            </div>
            <p className="mt-4 font-medium text-gray-800 dark:text-gray-100">目标文件夹</p>
            <p className="mt-1 break-all text-xs text-gray-600 dark:text-gray-400">{item.folder}</p>
            <p className="mt-4 font-medium text-gray-800 dark:text-gray-100">修复计划（Worker）</p>
            <ul className="mt-2 list-inside list-disc text-xs text-gray-600 dark:text-gray-400">
              {item.repairPlan.summary.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col gap-2">
              <button
                type="button"
                disabled={!canPublish}
                onClick={() => canPublish && onPublish(item.clientItemId)}
                className="rounded-md bg-[#1677ff] px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#4096ff] disabled:cursor-not-allowed disabled:bg-gray-300 dark:disabled:bg-gray-700"
              >
                发布
              </button>
              {!canPublish && (
                <p className="text-xs text-gray-500 dark:text-gray-400">需状态为「已就绪」后可发布。</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
