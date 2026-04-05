/**
 * 平台视频规格（可扩展：后续增加 google / meta 条目即可）
 * 数值综合需求说明与 TikTok 帮助中心公开信息，以后端最终校验为准。
 */

export type TikTokPlacementAspect = "9:16" | "1:1" | "16:9";

export type TikTokVideoPlacementSpec = {
  id: "tiktok_infeed";
  label: string;
  /** 广告场景常用 5–60s（信息流拍卖） */
  durationSec: { min: number; max: number };
  maxBytes: number;
  /** 推荐上传 <100MB 以提升速度（非硬性） */
  softMaxBytes?: number;
  placements: Record<
    TikTokPlacementAspect,
    { minWidth: number; minHeight: number; recWidth: number; recHeight: number }
  >;
  preferred: {
    containerMime: string;
    videoCodec: string;
  };
};

export const TIKTOK_INFEED_SPEC: TikTokVideoPlacementSpec = {
  id: "tiktok_infeed",
  label: "TikTok In-Feed（拍卖）",
  durationSec: { min: 5, max: 60 },
  maxBytes: 500 * 1024 * 1024,
  softMaxBytes: 100 * 1024 * 1024,
  placements: {
    "9:16": {
      minWidth: 540,
      minHeight: 960,
      recWidth: 1080,
      recHeight: 1920,
    },
    "1:1": {
      minWidth: 640,
      minHeight: 640,
      recWidth: 1080,
      recHeight: 1080,
    },
    "16:9": {
      minWidth: 1280,
      minHeight: 720,
      recWidth: 1280,
      recHeight: 720,
    },
  },
  preferred: {
    containerMime: "video/mp4",
    videoCodec: "h264",
  },
};

export type PlatformSpecRegistry = {
  tiktok_infeed: TikTokVideoPlacementSpec;
};

export const PLATFORM_VIDEO_SPECS: PlatformSpecRegistry = {
  tiktok_infeed: TIKTOK_INFEED_SPEC,
};

export type PlatformId = keyof PlatformSpecRegistry;
