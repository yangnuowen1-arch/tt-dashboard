// API 配置
const API_BASE_URL = 'http://localhost:3001';

// API 请求封装
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data: T | null; message: string }> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // 如果有 token，添加到请求头
  const token = localStorage.getItem('token');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  const data = await response.json();
  return data;
}

// 登录接口
export async function loginApi(email: string, password: string) {
  return apiRequest<{
    token: string;
    user: {
      id: number;
      email: string;
      username: string;
      role: string;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    };
  }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

// 注册接口
export async function registerApi(email: string, password: string, username: string) {
  return apiRequest<{
    id: number;
    email: string;
    username: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, username }),
  });
}