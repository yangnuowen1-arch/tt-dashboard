import type { TikTokPlacementAspect } from "./platformSpecs";
import type { AspectBucket } from "./types";

const RATIO_TOL = 0.03;

export function detectAspectBucket(width: number, height: number): AspectBucket {
  if (width <= 0 || height <= 0) return "other";
  const r = width / height;
  const targets: Array<{ k: AspectBucket; v: number }> = [
    { k: "9:16", v: 9 / 16 },
    { k: "1:1", v: 1 },
    { k: "16:9", v: 16 / 9 },
  ];
  let best: AspectBucket = "other";
  let bestDiff = Infinity;
  for (const t of targets) {
    const d = Math.abs(r - t.v);
    if (d < bestDiff) {
      bestDiff = d;
      best = t.k;
    }
  }
  return bestDiff <= RATIO_TOL ? best : "other";
}

export function pickNearestTikTokPlacement(
  width: number,
  height: number
): TikTokPlacementAspect {
  const b = detectAspectBucket(width, height);
  if (b === "9:16" || b === "1:1" || b === "16:9") return b;
  /** 默认按 XMP/性能习惯落到竖屏 9:16 */
  return "9:16";
}
