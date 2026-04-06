/**
 * 批量上传 / 发布 API
 * 通过 src/lib/api/client.ts 统一处理 base URL、鉴权、超时、重试。
 */

import { api } from "./client";

// ─── 类型 ───────────────────────────────────────────────────

export type BatchPresignItem = {
  clientItemId: string;
  fileName: string;
  mime: string;
  sizeBytes: number;
  kind: "video" | "image";
};

export type BatchPresignResult = {
  clientItemId: string;
  uploadUrl: string;
  /** 上传完成后的访问地址（或经 CDN） */
  assetUrl: string;
  /** 后端任务 id，用于 WS 订阅 */
  jobId: string;
};

export type PublishPayload = {
  clientItemId: string;
  assetUrl: string;
  coverUrl?: string;
};

// ─── API ────────────────────────────────────────────────────

/** Step1：批量申请预签名 URL */
export function requestBatchPresign(items: BatchPresignItem[]) {
  return api.post<BatchPresignResult[]>("/api/creatives/batch-presign", { items });
}

/** Step2：通知后端「对象已落地」，触发入队处理 */
export function notifyUploadComplete(payload: {
  jobId: string;
  clientItemId: string;
  assetUrl: string;
}) {
  return api.post<void>("/api/creatives/upload-complete", payload);
}

/** Step3：发布到广告账户 / 素材库 */
export function publishCreative(body: PublishPayload) {
  return api.post<{ publishedId: string }>("/api/creatives/publish", body);
}

// ─── 直传（XHR，需要上传进度回调） ─────────────────────────────

/** 直传 S3 / OSS，使用 XHR 以支持 onProgress */
export function putToSignedUrl(
  uploadUrl: string,
  file: File,
  onProgress?: (pct: number) => void
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);
    xhr.upload.onprogress = (evt) => {
      if (!evt.lengthComputable || !onProgress) return;
      onProgress(Math.round((evt.loaded / evt.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`上传失败 HTTP ${xhr.status}`));
    };
    xhr.onerror = () => reject(new Error("网络错误"));
    xhr.send(file);
  });
}
