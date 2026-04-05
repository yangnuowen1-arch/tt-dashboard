"use client";

import React, { useCallback, useState } from "react";

type Props = {
  disabled?: boolean;
  onFiles: (files: FileList | File[]) => void | Promise<void>;
  maxItems: number;
  maxVideos: number;
};

export function BatchUploadDropzone({
  disabled,
  onFiles,
  maxItems,
  maxVideos,
}: Props) {
  const [hint, setHint] = useState<string | null>(null);
  const [active, setActive] = useState(false);

  const handleFiles = useCallback(
    (list: FileList | null) => {
      if (!list || !list.length) return;
      setHint(null);
      void (async () => {
        try {
          await onFiles(list);
        } catch (e) {
          setHint(e instanceof Error ? e.message : "添加失败");
        }
      })();
    },
    [onFiles]
  );

  return (
    <div
      className={`rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors ${
        active ? "border-[#1677ff] bg-[#e6f4ff]/40" : "border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900"
      } ${disabled ? "pointer-events-none opacity-60" : ""}`}
      onDragEnter={(e) => {
        e.preventDefault();
        setActive(true);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setActive(true);
      }}
      onDragLeave={() => setActive(false)}
      onDrop={(e) => {
        e.preventDefault();
        setActive(false);
        if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
      }}
    >
      <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
        拖拽文件到此处，或
        <label className="mx-1 cursor-pointer text-[#1677ff] hover:underline">
          选择文件
          <input
            type="file"
            className="sr-only"
            multiple
            accept="video/*,image/*"
            disabled={disabled}
            onChange={(e) => handleFiles(e.target.files)}
          />
        </label>
      </p>
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        最多 {maxItems} 个文件，其中视频 ≤ {maxVideos} 条；将自动识别类型、生成标签与文件夹建议。
      </p>
      {hint && <p className="mt-3 text-sm text-error-600 dark:text-error-400">{hint}</p>}
    </div>
  );
}
