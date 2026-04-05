import { detectAspectBucket } from "./geometry";
import type { CreativeAssetKind, ProbedFileMeta } from "./types";

export type AutoOrganizeResult = {
  tags: string[];
  folder: string;
};

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

/**
 * 纯函数：根据类型/比例/日期生成标签与「虚拟文件夹」路径（后端可映射为 S3 前缀）
 */
export function autoTagAndFolder(
  meta: ProbedFileMeta,
  fileName: string,
  now: Date = new Date()
): AutoOrganizeResult {
  const y = now.getFullYear();
  const m = pad2(now.getMonth() + 1);
  const d = pad2(now.getDate());
  const datePart = `${y}-${m}-${d}`;

  const kindLabel = meta.kind === "video" ? "视频" : "图片";
  const aspect = detectAspectBucket(meta.width, meta.height);
  const aspectLabel =
    aspect === "other" ? "比例未识别" : aspect === "9:16" ? "竖屏9x16" : aspect === "1:1" ? "方形1x1" : "横屏16x9";

  const ext = (fileName.split(".").pop() || "").toLowerCase();
  const tags = [
    kindLabel,
    aspectLabel,
    ext ? ext.toUpperCase() : "未知格式",
    meta.kind === "video" && meta.durationSec
      ? `${Math.round(meta.durationSec)}s`
      : meta.kind === "video"
        ? "时长待解析"
        : `${meta.width}x${meta.height}`,
  ];

  const folder = `${datePart}/${kindLabel}/${aspectLabel.replace(/[/:]/g, "_")}`;

  return { tags, folder };
}
