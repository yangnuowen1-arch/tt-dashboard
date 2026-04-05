"use client";

import type { CreativeJobStatus } from "@/lib/creative/types";
import type { QueueItem } from "@/hooks/useBatchCreativeUpload";
import React from "react";

const STATUS_LABEL: Record<CreativeJobStatus, string> = {
  pending_upload: "待上传",
  uploading: "上传中",
  upload_success: "上传成功",
  queued: "排队处理",
  processing: "处理中",
  ready: "已就绪",
  published: "已发布",
  failed: "失败",
};

type Props = {
  items: QueueItem[];
  mockMode: boolean;
  onPreview: (id: string) => void;
  onPublish: (id: string) => void;
  onRetry: (id: string) => void;
  onRemove: (id: string) => void;
  onSecondary: (id: string, action: "replace_cover" | "batch_replace" | "readapt") => void;
};

function displayUrl(item: QueueItem, mockMode: boolean) {
  if (!mockMode && item.remoteUrl) return item.remoteUrl;
  return item.localPreviewUrl;
}

export function BatchCreativeQueueTable({
  items,
  mockMode,
  onPreview,
  onPublish,
  onRetry,
  onRemove,
  onSecondary,
}: Props) {
  if (!items.length) {
    return (
      <p className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">
        队列为空，请先添加素材。
      </p>
    );
  }

  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className="min-w-[1100px] w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 dark:border-gray-800 dark:bg-gray-800/40 dark:text-gray-400">
            <th className="px-3 py-2.5">预览</th>
            <th className="px-3 py-2.5">文件名</th>
            <th className="px-3 py-2.5">类型</th>
            <th className="px-3 py-2.5">标签</th>
            <th className="px-3 py-2.5">文件夹</th>
            <th className="px-3 py-2.5">规格</th>
            <th className="px-3 py-2.5">状态</th>
            <th className="px-3 py-2.5">进度</th>
            <th className="px-3 py-2.5">操作</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const thumb = displayUrl(item, mockMode);
            const specOk = item.validation.ok;
            return (
              <tr
                key={item.clientItemId}
                className="border-b border-gray-100 hover:bg-gray-50/80 dark:border-gray-800 dark:hover:bg-white/[0.04]"
              >
                <td className="px-3 py-2">
                  <button
                    type="button"
                    className="relative block h-14 w-14 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800"
                    onClick={() => onPreview(item.clientItemId)}
                  >
                    {item.kind === "video" ? (
                      <video
                        src={thumb}
                        className="h-full w-full object-cover"
                        muted
                        playsInline
                        preload="metadata"
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={thumb} alt="" className="h-full w-full object-cover" />
                    )}
                  </button>
                </td>
                <td className="max-w-[200px] px-3 py-2">
                  <p className="truncate font-medium text-gray-800 dark:text-gray-100">{item.file.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(item.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  {item.error && (
                    <p className="mt-1 text-xs text-error-600 dark:text-error-400">{item.error}</p>
                  )}
                </td>
                <td className="px-3 py-2 text-gray-700 dark:text-gray-200">
                  {item.kind === "video" ? "视频" : "图片"}
                </td>
                <td className="px-3 py-2">
                  <div className="flex max-w-[200px] flex-wrap gap-1">
                    {item.tags.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] text-gray-600 dark:bg-white/10 dark:text-gray-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="max-w-[160px] px-3 py-2 text-xs text-gray-600 break-all dark:text-gray-400">
                  {item.folder}
                </td>
                <td className="px-3 py-2 text-xs">
                  <span
                    className={
                      specOk
                        ? "text-success-600 dark:text-success-400"
                        : "text-error-600 dark:text-error-400"
                    }
                  >
                    {specOk ? "可通过" : "需修复/拦截"}
                  </span>
                  {item.validation.issues.slice(0, 2).map((i) => (
                    <p key={i.code} className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                      {i.message}
                    </p>
                  ))}
                </td>
                <td className="px-3 py-2">
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-800 dark:bg-white/10 dark:text-gray-100">
                    {STATUS_LABEL[item.status]}
                  </span>
                  {item.etaSeconds != null && item.status === "processing" && (
                    <p className="mt-1 text-[11px] text-gray-500">约 {item.etaSeconds}s</p>
                  )}
                </td>
                <td className="px-3 py-2 w-[140px]">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-full rounded-full bg-[#1677ff]"
                      style={{
                        width: `${
                          item.status === "uploading"
                            ? item.uploadProgress
                            : item.status === "processing" || item.status === "queued"
                              ? item.processProgress
                              : item.status === "ready" || item.status === "published"
                                ? 100
                                : 0
                        }%`,
                      }}
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                    {item.status === "uploading"
                      ? `上传 ${item.uploadProgress}%`
                      : item.status === "processing" || item.status === "queued"
                        ? `处理 ${item.processProgress}%`
                        : "—"}
                  </p>
                </td>
                <td className="px-3 py-2 align-top text-xs">
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      className="text-left text-[#1677ff] hover:underline"
                      onClick={() => onPreview(item.clientItemId)}
                    >
                      预览
                    </button>
                    {item.status === "ready" && (
                      <button
                        type="button"
                        className="text-left text-[#1677ff] hover:underline"
                        onClick={() => onPublish(item.clientItemId)}
                      >
                        发布
                      </button>
                    )}
                    {item.status === "failed" && (
                      <button
                        type="button"
                        className="text-left text-error-600 hover:underline dark:text-error-400"
                        onClick={() => onRetry(item.clientItemId)}
                      >
                        重试
                      </button>
                    )}
                    {(item.status === "ready" || item.status === "published") && (
                      <>
                        <button
                          type="button"
                          className="text-left text-gray-700 hover:underline dark:text-gray-300"
                          onClick={() => onSecondary(item.clientItemId, "replace_cover")}
                        >
                          替换封面
                        </button>
                        <button
                          type="button"
                          className="text-left text-gray-700 hover:underline dark:text-gray-300"
                          onClick={() => onSecondary(item.clientItemId, "batch_replace")}
                        >
                          批量替换
                        </button>
                        <button
                          type="button"
                          className="text-left text-gray-700 hover:underline dark:text-gray-300"
                          onClick={() => onSecondary(item.clientItemId, "readapt")}
                        >
                          适配其他平台
                        </button>
                      </>
                    )}
                    {item.status === "pending_upload" && (
                      <button
                        type="button"
                        className="text-left text-gray-600 hover:underline dark:text-gray-400"
                        onClick={() => onRemove(item.clientItemId)}
                      >
                        移除
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
