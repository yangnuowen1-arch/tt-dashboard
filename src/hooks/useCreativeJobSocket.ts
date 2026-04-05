"use client";

import { useEffect, useRef } from "react";

/**
 * 后端 WS 推送示例：
 * { "type":"creative_job","clientItemId":"...","jobId":"...","status":"processing","progress":42,"assetUrl":"...","coverUrl":"...","error":null }
 */
export type CreativeJobSocketMessage = {
  type: "creative_job";
  clientItemId: string;
  jobId?: string;
  status: string;
  progress?: number;
  assetUrl?: string;
  coverUrl?: string;
  error?: string | null;
};

type Options = {
  url: string | null;
  onMessage: (msg: CreativeJobSocketMessage) => void;
  enabled?: boolean;
};

/**
 * WebSocket：有 NEXT_PUBLIC_CREATIVE_JOBS_WS 则连接；否则不建立连接（由业务层走 Mock 进度）。
 */
export function useCreativeJobSocket({ url, onMessage, enabled = true }: Options) {
  const onMessageRef = useRef(onMessage);
  useEffect(() => { onMessageRef.current = onMessage; }, [onMessage]);

  useEffect(() => {
    if (!enabled || !url) return;

    let ws: WebSocket | null = null;
    let closed = false;
    let attempt = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const connect = () => {
      if (closed) return;
      try {
        ws = new WebSocket(url);
      } catch {
        scheduleReconnect();
        return;
      }

      ws.onmessage = (evt) => {
        try {
          const data = JSON.parse(String(evt.data)) as CreativeJobSocketMessage;
          if (data?.type === "creative_job" && data.clientItemId) {
            onMessageRef.current(data);
          }
        } catch {
          /* ignore */
        }
      };

      ws.onclose = () => {
        if (!closed) scheduleReconnect();
      };

      ws.onerror = () => {
        ws?.close();
      };
    };

    const scheduleReconnect = () => {
      if (closed) return;
      attempt += 1;
      const delay = Math.min(30_000, 800 * 2 ** Math.min(attempt, 6));
      timer = setTimeout(connect, delay);
    };

    connect();

    return () => {
      closed = true;
      if (timer) clearTimeout(timer);
      ws?.close();
    };
  }, [url, enabled]);
}
