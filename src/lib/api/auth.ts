import { api } from "./client";

// ─── 类型 ───────────────────────────────────────────────────

export type AuthUser = {
  id: number;
  email: string;
  username: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

// ─── API ────────────────────────────────────────────────────

// 登录接口
export function loginApi(email: string, password: string) {
  return api.post<{ token: string; user: AuthUser }>(
    "/auth/login",
    { email, password },
    { skipAuth: true }
  );
}

// 注册接口
export function registerApi(email: string, password: string, username: string) {
  return api.post<AuthUser>(
    "/auth/register",
    { email, password, username },
    { skipAuth: true }
  );
}