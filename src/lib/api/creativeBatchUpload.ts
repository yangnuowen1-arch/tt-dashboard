/**
 * 批量上传 / 发布 API 占位：接入后端时实现下列方法即可与前端闭环。
 * 默认走 Mock（由 hook 内判断 env）。
 */

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

/** Step1：批量申请预签名 URL（示例签名路径，后端替换） */
export async function requestBatchPresign(
  _items: BatchPresignItem[]
): Promise<BatchPresignResult[]> {
  const res = await fetch("/api/creatives/batch-presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items: _items }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(t || `presign failed: ${res.status}`);
  }
  return (await res.json()) as BatchPresignResult[];
}

/** 直传 S3 / OSS */
export async function putToSignedUrl(
  uploadUrl: string,
  file: File,
  onProgress?: (pct: number) => void
): Promise<void> {
  await new Promise<void>((resolve, reject) => {
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

/** Step2：通知后端「对象已落地」，触发入队修复 */
export async function notifyUploadComplete(_payload: {
  jobId: string;
  clientItemId: string;
  assetUrl: string;
}): Promise<void> {
  const res = await fetch("/api/creatives/upload-complete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(_payload),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(t || `upload-complete failed: ${res.status}`);
  }
}

/** 发布到广告账户 / 素材库（示例） */
export async function publishCreative(_body: PublishPayload): Promise<{ publishedId: string }> {
  const res = await fetch("/api/creatives/publish", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(_body),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(t || `publish failed: ${res.status}`);
  }
  return (await res.json()) as { publishedId: string };
}
