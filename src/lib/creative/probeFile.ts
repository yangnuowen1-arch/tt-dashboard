import type { CreativeAssetKind, ProbedFileMeta } from "./types";

function extOf(name: string) {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i + 1).toLowerCase() : "";
}

function guessKind(mime: string, name: string): CreativeAssetKind {
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("image/")) return "image";
  const e = extOf(name);
  if (["mp4", "mov", "mpeg", "mpg", "3gp", "avi", "webm", "mkv"].includes(e)) return "video";
  return "image";
}

export async function probeVideo(file: File, objectUrl: string): Promise<ProbedFileMeta> {
  const video = document.createElement("video");
  video.preload = "metadata";
  video.muted = true;
  video.playsInline = true;
  const cleanup = () => {
    video.removeAttribute("src");
    video.load();
  };
  return await new Promise((resolve, reject) => {
    const onDone = () => {
      cleanup();
    };
    video.onloadedmetadata = () => {
      const meta: ProbedFileMeta = {
        kind: "video",
        mime: file.type || "video/*",
        ext: extOf(file.name),
        sizeBytes: file.size,
        width: video.videoWidth,
        height: video.videoHeight,
        durationSec: Number.isFinite(video.duration) ? video.duration : undefined,
      };
      onDone();
      resolve(meta);
    };
    video.onerror = () => {
      onDone();
      reject(new Error("无法读取视频元数据"));
    };
    video.src = objectUrl;
  });
}

export async function probeImage(file: File, objectUrl: string): Promise<ProbedFileMeta> {
  const img = new Image();
  return await new Promise((resolve, reject) => {
    img.onload = () => {
      const meta: ProbedFileMeta = {
        kind: "image",
        mime: file.type || "image/*",
        ext: extOf(file.name),
        sizeBytes: file.size,
        width: img.naturalWidth,
        height: img.naturalHeight,
      };
      resolve(meta);
    };
    img.onerror = () => reject(new Error("无法读取图片元数据"));
    img.src = objectUrl;
  });
}

/**
 * 浏览器侧：创建 objectURL 并探测；调用方负责 revoke（或在替换为远程 URL 后 revoke）。
 */
export async function probeFileWithObjectUrl(file: File): Promise<{
  objectUrl: string;
  meta: ProbedFileMeta;
}> {
  const objectUrl = URL.createObjectURL(file);
  const kind = guessKind(file.type, file.name);
  try {
    const meta =
      kind === "video"
        ? await probeVideo(file, objectUrl)
        : await probeImage(file, objectUrl);
    return { objectUrl, meta };
  } catch (e) {
    URL.revokeObjectURL(objectUrl);
    throw e;
  }
}
