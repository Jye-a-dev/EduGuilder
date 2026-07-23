/**
 * Central API client - reads base URL from NEXT_PUBLIC_API_URL env var.
 * All hooks should use this instead of hardcoding http://localhost:3000.
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:3000";

type FetchOptions = Omit<RequestInit, "headers"> & {
  token?: string | null;
  params?: Record<string, string | number | boolean | undefined | null>;
};

function buildUrl(
  path: string,
  params?: Record<string, string | number | boolean | undefined | null>
): string {
  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

async function request<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { token, params, ...init } = options;

  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (init.body && typeof init.body === "string") {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(buildUrl(path, params), {
    ...init,
    headers,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    const msg =
      Array.isArray(errData?.message)
        ? errData.message.join(", ")
        : errData?.message || `HTTP ${res.status}`;

    if (res.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        window.location.href = "/login";
      }
    }

    throw new Error(msg);
  }

  // Handle 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(path: string, opts?: FetchOptions) =>
    request<T>(path, { ...opts, method: "GET" }),

  post: <T>(path: string, body: unknown, opts?: FetchOptions) =>
    request<T>(path, {
      ...opts,
      method: "POST",
      body: JSON.stringify(body),
    }),

  patch: <T>(path: string, body: unknown, opts?: FetchOptions) =>
    request<T>(path, {
      ...opts,
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: <T>(path: string, opts?: FetchOptions) =>
    request<T>(path, { ...opts, method: "DELETE" }),
};
