import type { PlatformId, TikTokPlacementAspect } from "./platformSpecs";
import { PLATFORM_VIDEO_SPECS } from "./platformSpecs";
import { pickNearestTikTokPlacement } from "./geometry";
import type {
  LetterboxMode,
  ProbedFileMeta,
  RepairJobConfig,
  RepairPlanResult,
  ValidationIssue,
  ValidationResult,
} from "./types";

export type ValidateOptions = {
  platformId: PlatformId;
  /** 默认目标画幅：广告常用竖屏；也可显式指定 */
  targetPlacement?: TikTokPlacementAspect;
  letterbox?: LetterboxMode;
  allowUpscale?: boolean;
};

function extOf(name: string) {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i + 1).toLowerCase() : "";
}

/**
 * 纯函数：基于探测元数据做 TikTok（可扩展到其他 platformId）校验。
 * 不涉及 DOM / IO。
 */
export function validateCreativeForPlatform(
  meta: ProbedFileMeta,
  fileName: string,
  options: ValidateOptions
): ValidationResult {
  const spec = PLATFORM_VIDEO_SPECS[options.platformId];
  const issues: ValidationIssue[] = [];

  if (meta.kind === "image") {
    issues.push({
      code: "IMAGE_OK",
      severity: "warn",
      message: "图片素材将跳过视频时长/编码校验；发布前请确认版位要求。",
    });
    return { ok: true, issues, blocking: false };
  }

  const ext = meta.ext || extOf(fileName);
  if (!["mp4", "mov", "mpeg", "mpg", "3gp", "avi"].includes(ext)) {
    issues.push({
      code: "FORMAT_WARN",
      severity: "warn",
      message: `扩展名 .${ext} 可能需转封装为 MP4（H.264）以满足 ${spec.label}。`,
    });
  }

  if (meta.mime && meta.mime !== spec.preferred.containerMime) {
    issues.push({
      code: "MIME_WARN",
      severity: "warn",
      message: `当前 MIME 为 ${meta.mime}，推荐 ${spec.preferred.containerMime}+${spec.preferred.videoCodec.toUpperCase()}。`,
    });
  }

  if (meta.sizeBytes > spec.maxBytes) {
    issues.push({
      code: "SIZE_HARD",
      severity: "error",
      message: `文件超过 ${spec.maxBytes / 1024 / 1024}MB 上限。`,
    });
  } else if (spec.softMaxBytes && meta.sizeBytes > spec.softMaxBytes) {
    issues.push({
      code: "SIZE_SOFT",
      severity: "warn",
      message: `大于 ${spec.softMaxBytes / 1024 / 1024}MB，上传与处理可能较慢。`,
    });
  }

  const dur = meta.durationSec;
  if (dur == null || Number.isNaN(dur)) {
    issues.push({
      code: "DURATION_UNKNOWN",
      severity: "warn",
      message: "未能读取时长，将在服务端二次校验。",
    });
  } else {
    if (dur < spec.durationSec.min || dur > spec.durationSec.max) {
      issues.push({
        code: "DURATION_POLICY",
        severity: "error",
        message: `时长需在 ${spec.durationSec.min}–${spec.durationSec.max} 秒（广告政策常用范围）。`,
      });
    }
  }

  const placement =
    options.targetPlacement ?? pickNearestTikTokPlacement(meta.width, meta.height);
  const p = spec.placements[placement];
  const shortSide = Math.min(meta.width, meta.height);

  /** 简单规则：短边低于 placement 最低要求且不允许放大 → 阻断 */
  const minShort = Math.min(p.minWidth, p.minHeight);
  const allowUpscale = options.allowUpscale !== false;
  if (shortSide < minShort && !allowUpscale) {
    issues.push({
      code: "RES_TOO_LOW",
      severity: "error",
      message: `分辨率过低，短边 ${shortSide}px < 建议最小 ${minShort}px，且未允许放大。`,
    });
  } else if (shortSide < minShort) {
    issues.push({
      code: "RES_UPSCALE",
      severity: "warn",
      message: `分辨率偏低，将尝试 upscale 至目标 ${p.recWidth}×${p.recHeight}（以 Worker 实际能力为准）。`,
    });
  }

  const blocking = issues.some((i) => i.severity === "error");
  return { ok: !blocking, issues, blocking };
}

/**
 * 纯函数：生成异步修复任务配置（中心裁切 + 黑边/模糊填充、转码、首帧封面等）
 */
export function buildRepairPlanForPlatform(
  meta: ProbedFileMeta,
  _fileName: string,
  options: ValidateOptions
): RepairPlanResult {
  if (meta.kind !== "video") {
    return {
      needed: false,
      config: null,
      summary: ["图片素材：无需视频转码流水线。"],
    };
  }

  const spec = PLATFORM_VIDEO_SPECS[options.platformId];
  const letterbox: LetterboxMode = options.letterbox ?? "blur";
  const placement =
    options.targetPlacement ?? pickNearestTikTokPlacement(meta.width, meta.height);
  const p = spec.placements[placement];
  const bucket = pickNearestTikTokPlacement(meta.width, meta.height);
  const aspectMismatch = bucket !== placement;

  const summary: string[] = [];
  if (aspectMismatch) {
    summary.push(`画幅将适配为 ${placement}（中心裁切 + ${letterbox === "blur" ? "模糊" : "黑边"}填充）。`);
  }
  summary.push(`目标分辨率 ${p.recWidth}×${p.recHeight}，封装 MP4/H.264。`);
  summary.push("封面：默认抽取第一帧。");

  const config: RepairJobConfig = {
    platformId: spec.id,
    target: {
      width: p.recWidth,
      height: p.recHeight,
      aspectLabel: placement,
    },
    video: {
      transcodeTo: { container: "mp4", videoCodec: "h264", audioCodec: "aac" },
      /** 超出比例：先 cover 再 letterbox */
      scaleMode: "cover",
      letterbox,
      allowUpscale: options.allowUpscale !== false,
      minShortSidePx: Math.min(p.minWidth, p.minHeight),
      clampDurationSec: {
        min: spec.durationSec.min,
        max: spec.durationSec.max,
      },
    },
    thumbnail: { source: "first_frame", format: "jpeg", width: 720 },
  };

  return {
    needed: true,
    config,
    summary,
  };
}
