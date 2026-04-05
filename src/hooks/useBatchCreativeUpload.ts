"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { autoTagAndFolder } from "@/lib/creative/autoTagAndFolder";
import type { PlatformId } from "@/lib/creative/platformSpecs";
import { probeFileWithObjectUrl } from "@/lib/creative/probeFile";
import type { CreativeJobStatus, ProbedFileMeta, RepairJobConfig } from "@/lib/creative/types";
import {
  buildRepairPlanForPlatform,
  validateCreativeForPlatform,
} from "@/lib/creative/validateAndRepairPlan";
import {
  notifyUploadComplete,
  publishCreative,
  putToSignedUrl,
  requestBatchPresign,
} from "@/lib/api/creativeBatchUpload";
import type { CreativeJobSocketMessage } from "@/hooks/useCreativeJobSocket";

const MAX_ITEMS = 100;
const MAX_VIDEOS = 30;

export type QueueItem = {
  clientItemId: string;
  file: File;
  localPreviewUrl: string;
  remoteUrl: string | null;
  coverUrl: string | null;
  kind: ProbedFileMeta["kind"];
  meta: ProbedFileMeta;
  tags: string[];
  folder: string;
  validation: ReturnType<typeof validateCreativeForPlatform>;
  repairPlan: ReturnType<typeof buildRepairPlanForPlatform>;
  repairConfig: RepairJobConfig | null;
  status: CreativeJobStatus;
  uploadProgress: number;
  processProgress: number;
  etaSeconds: number | null;
  error: string | null;
  jobId: string | null;
  publishedId: string | null;
};

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function isMockMode() {
  return process.env.NEXT_PUBLIC_CREATIVE_UPLOAD_MOCK !== "false";
}

export function useBatchCreativeUpload(platformId: PlatformId = "tiktok_infeed") {
  const [items, setItems] = useState<QueueItem[]>([]);
  const itemsRef = useRef(items);
  useEffect(() => { itemsRef.current = items; }, [items]);
  const mockTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>[]>>(new Map());

  const mockMode = useMemo(() => isMockMode(), []);

  const clearMockTimers = useCallback((id: string) => {
    const list = mockTimersRef.current.get(id);
    if (list) list.forEach(clearTimeout);
    mockTimersRef.current.delete(id);
  }, []);

  const patchItem = useCallback((id: string, patch: Partial<QueueItem>) => {
    setItems((prev) => prev.map((it) => (it.clientItemId === id ? { ...it, ...patch } : it)));
  }, []);

  const removeItem = useCallback(
    (id: string) => {
      clearMockTimers(id);
      setItems((prev) => {
        const t = prev.find((x) => x.clientItemId === id);
        if (t?.localPreviewUrl) URL.revokeObjectURL(t.localPreviewUrl);
        return prev.filter((x) => x.clientItemId !== id);
      });
    },
    [clearMockTimers]
  );

  const addFiles = useCallback(
    async (files: FileList | File[]) => {
      const arr = Array.from(files);
      const existing = itemsRef.current;
      const videoCount = existing.filter((i) => i.kind === "video").length;
      const videoExt = new Set(["mp4", "mov", "mpeg", "mpg", "3gp", "avi", "webm", "mkv"]);
      const newVideos = arr.filter((f) => {
        if (f.type.startsWith("video/")) return true;
        const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
        return videoExt.has(ext);
      }).length;

      if (existing.length + arr.length > MAX_ITEMS) {
        throw new Error(`单次队列最多 ${MAX_ITEMS} 个文件`);
      }
      if (videoCount + newVideos > MAX_VIDEOS) {
        throw new Error(`视频最多 ${MAX_VIDEOS} 条，请减少视频数量`);
      }

      const created: QueueItem[] = [];
      for (const file of arr) {
        const { objectUrl, meta } = await probeFileWithObjectUrl(file);
        const { tags, folder } = autoTagAndFolder(meta, file.name);
        const validation = validateCreativeForPlatform(meta, file.name, { platformId });
        const repairPlan = buildRepairPlanForPlatform(meta, file.name, { platformId });
        created.push({
          clientItemId: uid(),
          file,
          localPreviewUrl: objectUrl,
          remoteUrl: null,
          coverUrl: null,
          kind: meta.kind,
          meta,
          tags,
          folder,
          validation,
          repairPlan,
          repairConfig: repairPlan.config,
          status: "pending_upload",
          uploadProgress: 0,
          processProgress: 0,
          etaSeconds: null,
          error: null,
          jobId: null,
          publishedId: null,
        });
      }
      setItems((prev) => [...prev, ...created]);
    },
    [platformId]
  );

  const applySocketMessage = useCallback(
    (msg: CreativeJobSocketMessage) => {
      const id = msg.clientItemId;
      const allowed: CreativeJobStatus[] = [
        "upload_success",
        "queued",
        "processing",
        "ready",
        "published",
        "failed",
      ];
      const next = allowed.includes(msg.status as CreativeJobStatus)
        ? (msg.status as CreativeJobStatus)
        : null;
      const cur = itemsRef.current.find((i) => i.clientItemId === id);
      if (!cur) return;
      patchItem(id, {
        ...(next ? { status: next } : {}),
        processProgress: msg.progress ?? cur.processProgress,
        remoteUrl: msg.assetUrl ?? cur.remoteUrl,
        coverUrl: msg.coverUrl ?? cur.coverUrl,
        error: msg.error ?? null,
      });
    },
    [patchItem]
  );

  const simulatePostUploadPipeline = useCallback(
    (id: string) => {
      if (!mockMode) return;
      const timers: ReturnType<typeof setTimeout>[] = [];
      const schedule = (fn: () => void, ms: number) => {
        const t = setTimeout(fn, ms);
        timers.push(t);
      };

      patchItem(id, { status: "queued", processProgress: 0, etaSeconds: 25 });
      schedule(() => patchItem(id, { status: "processing", processProgress: 15, etaSeconds: 18 }), 900);
      schedule(() => patchItem(id, { processProgress: 55, etaSeconds: 9 }), 2400);
      schedule(() => patchItem(id, { processProgress: 92, etaSeconds: 2 }), 4200);
      schedule(() => {
        const it = itemsRef.current.find((x) => x.clientItemId === id);
        const url =
          it?.remoteUrl ||
          `https://example.com/mock-assets/${id}.${it?.kind === "video" ? "mp4" : "jpg"}`;
        patchItem(id, {
          status: "ready",
          processProgress: 100,
          etaSeconds: 0,
          remoteUrl: url,
          coverUrl: it?.kind === "video" ? `${url}?thumb=1` : url,
        });
      }, 6000);

      mockTimersRef.current.set(id, timers);
    },
    [mockMode, patchItem]
  );

  const uploadOne = useCallback(
    async (id: string) => {
      const it = itemsRef.current.find((x) => x.clientItemId === id);
      if (!it) return;
      if (it.validation.blocking) {
        patchItem(id, { status: "failed", error: "规格校验未通过，请更换素材或调整策略" });
        return;
      }

      patchItem(id, { status: "uploading", uploadProgress: 0, error: null });

      try {
        if (mockMode) {
          await new Promise((r) => setTimeout(r, 400 + Math.random() * 600));
          for (let p = 0; p <= 100; p += 20) {
            patchItem(id, { uploadProgress: p });
            await new Promise((r) => setTimeout(r, 120));
          }
          const remote = `https://mock.cdn.example/${id}/${encodeURIComponent(it.file.name)}`;
          patchItem(id, {
            status: "upload_success",
            uploadProgress: 100,
            remoteUrl: remote,
          });
          simulatePostUploadPipeline(id);
          return;
        }

        const [presign] = await requestBatchPresign([
          {
            clientItemId: id,
            fileName: it.file.name,
            mime: it.file.type || "application/octet-stream",
            sizeBytes: it.file.size,
            kind: it.kind,
          },
        ]);
        await putToSignedUrl(presign.uploadUrl, it.file, (pct) => patchItem(id, { uploadProgress: pct }));
        await notifyUploadComplete({
          jobId: presign.jobId,
          clientItemId: id,
          assetUrl: presign.assetUrl,
        });
        patchItem(id, {
          status: "upload_success",
          uploadProgress: 100,
          remoteUrl: presign.assetUrl,
          jobId: presign.jobId,
        });
      } catch (e) {
        patchItem(id, {
          status: "failed",
          error: e instanceof Error ? e.message : "上传失败",
        });
      }
    },
    [mockMode, patchItem, simulatePostUploadPipeline]
  );

  const uploadAllPending = useCallback(async () => {
    const pending = itemsRef.current.filter((i) => i.status === "pending_upload");
    for (const p of pending) {
      await uploadOne(p.clientItemId);
    }
  }, [uploadOne]);

  const retry = useCallback(
    async (id: string) => {
      clearMockTimers(id);
      patchItem(id, {
        status: "pending_upload",
        error: null,
        uploadProgress: 0,
        processProgress: 0,
        etaSeconds: null,
        jobId: null,
      });
      await uploadOne(id);
    },
    [clearMockTimers, patchItem, uploadOne]
  );

  const publish = useCallback(
    async (id: string) => {
      const it = itemsRef.current.find((x) => x.clientItemId === id);
      if (!it || it.status !== "ready") return;
      try {
        if (mockMode) {
          await new Promise((r) => setTimeout(r, 400));
          patchItem(id, { status: "published", publishedId: `pub_${id}` });
          return;
        }
        const res = await publishCreative({
          clientItemId: id,
          assetUrl: it.remoteUrl || "",
          coverUrl: it.coverUrl || undefined,
        });
        patchItem(id, { status: "published", publishedId: res.publishedId });
      } catch (e) {
        patchItem(id, {
          status: "failed",
          error: e instanceof Error ? e.message : "发布失败",
        });
      }
    },
    [mockMode, patchItem]
  );

  const secondaryAction = useCallback(
    (id: string, action: "replace_cover" | "batch_replace" | "readapt") => {
      /** 占位：对接后端二次操作接口 */
      console.info("[creative] secondary", action, id);
      patchItem(id, { error: null });
    },
    [patchItem]
  );

  return {
    items,
    maxItems: MAX_ITEMS,
    maxVideos: MAX_VIDEOS,
    mockMode,
    addFiles,
    removeItem,
    uploadAllPending,
    uploadOne,
    retry,
    publish,
    applySocketMessage,
    secondaryAction,
  };
}
