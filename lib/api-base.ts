const productionBaseUrl = "https://api.ruhshonatort.com/api";
const localBaseUrl = "http://localhost:8090/api";
const localFallbackBaseUrls = ["http://localhost:8091/api", "http://localhost:8092/api"];

function normalizeBase(base: string) {
  return base.trim().replace(/\/$/, "");
}

function resolveApiBaseUrls() {
  if (typeof window !== "undefined") {
    const host = window.location.hostname.toLowerCase();
    // Production storefront should always hit production API directly.
    if (host === "ruhshonatort.com" || host === "www.ruhshonatort.com") {
      return [productionBaseUrl];
    }
  }

  const envBase = normalizeBase(process.env.NEXT_PUBLIC_API_BASE_URL || "");
  if (envBase) {
    if (/^https?:\/\//i.test(envBase)) {
      return [envBase, productionBaseUrl];
    }
    if (typeof window !== "undefined" && envBase.startsWith("/")) {
      return [normalizeBase(`${window.location.origin}${envBase}`), productionBaseUrl];
    }
    return [envBase, productionBaseUrl];
  }

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      return [localBaseUrl, ...localFallbackBaseUrls];
    }
  }

  return [productionBaseUrl];
}

const apiBaseUrls = resolveApiBaseUrls();
export const apiBaseUrl = apiBaseUrls[0];
export const apiOrigin = apiBaseUrl.replace(/\/api$/, "");

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  let lastNetworkError = false;
  let lastHttpError: Error | null = null;

  for (const baseUrl of apiBaseUrls) {
    let response: Response;

    try {
      response = await fetch(`${baseUrl}${path}`, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          ...(init?.headers || {}),
        },
        cache: "no-store",
      });
    } catch {
      lastNetworkError = true;
      continue;
    }

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      lastHttpError = new Error(text || `API ${response.status}`);
      continue;
    }

    return (await response.json()) as T;
  }

  if (lastNetworkError) {
    throw new Error(`API bilan bog'lanib bo'lmadi (${apiBaseUrls.join(", ")}). Backend va URL ni tekshiring.`);
  }

  if (lastHttpError) {
    throw lastHttpError;
  }

  throw new Error("API request failed");
}
