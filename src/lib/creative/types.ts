/** 与后端 / Worker 约定的任务状态（前端展示与 WS 推送对齐） */
export type CreativeJobStatus =
  | "pending_upload"
  | "uploading"
  | "upload_success"
  | "queued"
  | "processing"
  | "ready"
  | "published"
  | "failed";

export type CreativeAssetKind = "video" | "image";

export type AspectBucket = "9:16" | "1:1" | "16:9" | "other";

export type LetterboxMode = "black" | "blur";

/** 浏览器侧探测到的文件元信息（上传前可得） */
export type ProbedFileMeta = {
  kind: CreativeAssetKind;
  mime: string;
  ext: string;
  sizeBytes: number;
  width: number;
  height: number;
  durationSec?: number;
};

/** 交给转码 Worker 的修复配置（由纯函数生成，后端可原样消费） */
export type RepairJobConfig = {
  platformId: string;
  target: {
    width: number;
    height: number;
    aspectLabel: AspectBucket;
  };
  video?: {
    transcodeTo: { container: "mp4"; videoCodec: "h264"; audioCodec: "aac" };
    scaleMode: "cover" | "contain";
    letterbox: LetterboxMode;
    allowUpscale: boolean;
    minShortSidePx?: number;
    /** 超出策略：广告场景常用 5–60s */
    clampDurationSec?: { min: number; max: number };
  };
  thumbnail: { source: "first_frame"; format: "jpeg"; width?: number };
};

export type ValidationIssue = {
  code: string;
  severity: "error" | "warn";
  message: string;
};

export type ValidationResult = {
  ok: boolean;
  issues: ValidationIssue[];
  /** 不可自动修复的硬错误（如低于最小分辨率且禁止放大） */
  blocking: boolean;
};

export type RepairPlanResult = {
  needed: boolean;
  config: RepairJobConfig | null;
  summary: string[];
};
