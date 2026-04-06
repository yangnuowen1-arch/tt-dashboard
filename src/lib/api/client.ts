/**
 * 统一 HTTP 请求客户端
 * - 环境变量驱动 base URL（NEXT_PUBLIC_API_BASE_URL）
 * - 自动注入 Bearer Token
 * - 超时控制
 * - 网络级自动重试（指数退避）
 * - 统一错误类型
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const DEFAULT_TIMEOUT_MS = 15_000;
const DEFAULT_RETRIES = 2;

// ─── 错误类型 ───────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class NetworkError extends Error {
  constructor(message = "网络错误，请检查连接") {
    super(message);
    this.name = "NetworkError";
  }
}

export class TimeoutError extends Error {
  constructor(ms: number) {
    super(`请求超时（${ms}ms）`);
    this.name = "TimeoutError";
  }
}

// ─── 后端信封结构 ────────────────────────────────────────────

/** 后端统一返回格式 { success, data, message } */
type ApiEnvelope<T = unknown> = {
  success: boolean;
  data: T;
  message: string;
};

function isEnvelope(val: unknown): val is ApiEnvelope {
  return (
    typeof val === "object" &&
    val !== null &&
    "success" in val &&
    "data" in val &&
    "message" in val
  );
}

// ─── 请求配置 ───────────────────────────────────────────────

export type RequestOptions = Omit<RequestInit, "body"> & {
  /** 超时毫秒数，默认 15s */
  timeout?: number;
  /** 网络错误 / 5xx 自动重试次数，默认 2 */
  retries?: number;
  /** 是否跳过自动注入 Authorization，默认 false */
  skipAuth?: boolean;
  /** 查询参数，自动拼接到 URL */
  params?: Record<string, string | number | boolean | undefined>;
  /** 请求体，自动 JSON.stringify */
  body?: unknown;
};

// ─── 内部工具 ───────────────────────────────────────────────

function buildUrl(endpoint: string, params?: RequestOptions["params"]): string {
  const url = new URL(endpoint, BASE_URL || undefined);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined) url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// ─── 核心请求函数 ────────────────────────────────────────────

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    timeout = DEFAULT_TIMEOUT_MS,
    retries = DEFAULT_RETRIES,
    skipAuth = false,
    params,
    body,
    headers: customHeaders,
    ...fetchInit
  } = options;

  const url = buildUrl(endpoint, params);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(customHeaders as Record<string, string>),
  };

  if (!skipAuth) {
    const token = getAuthToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const init: RequestInit = {
    ...fetchInit,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  };

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    if (attempt > 0) {
      await sleep(Math.min(1000 * 2 ** (attempt - 1), 5000));
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
      const res = await fetch(url, { ...init, signal: controller.signal });
      clearTimeout(timer);

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        const err = new ApiError(
          text || `请求失败 HTTP ${res.status}`,
          res.status,
          text
        );
        // 5xx 可重试，4xx 直接抛出
        if (res.status >= 500 && attempt < retries) {
          lastError = err;
          continue;
        }
        throw err;
      }

      // 204 No Content 或空响应
      const contentLength = res.headers.get("content-length");
      if (res.status === 204 || contentLength === "0") {
        return undefined as T;
      }

      const json = await res.json();

      // 自动解包后端 { success, data, message } 信封
      if (isEnvelope(json)) {
        if (!json.success) {
          throw new ApiError(json.message || "业务错误", res.status, json);
        }
        return json.data as T;
      }

      return json as T;
    } catch (e) {
      clearTimeout(timer);

      if (e instanceof ApiError) throw e;

      if (e instanceof DOMException && e.name === "AbortError") {
        lastError = new TimeoutError(timeout);
        if (attempt < retries) continue;
        throw lastError;
      }

      lastError = new NetworkError(
        e instanceof Error ? e.message : "网络错误"
      );
      if (attempt < retries) continue;
      throw lastError;
    }
  }

  throw lastError ?? new NetworkError();
}

// ─── 便捷方法 ───────────────────────────────────────────────

function get<T>(endpoint: string, options?: RequestOptions) {
  return request<T>(endpoint, { ...options, method: "GET" });
}

function post<T>(endpoint: string, body?: unknown, options?: RequestOptions) {
  return request<T>(endpoint, { ...options, method: "POST", body });
}

function put<T>(endpoint: string, body?: unknown, options?: RequestOptions) {
  return request<T>(endpoint, { ...options, method: "PUT", body });
}

function patch<T>(endpoint: string, body?: unknown, options?: RequestOptions) {
  return request<T>(endpoint, { ...options, method: "PATCH", body });
}

function del<T>(endpoint: string, options?: RequestOptions) {
  return request<T>(endpoint, { ...options, method: "DELETE" });
}

// ─── 导出 ───────────────────────────────────────────────────

export const api = { request, get, post, put, patch, del } as const;
