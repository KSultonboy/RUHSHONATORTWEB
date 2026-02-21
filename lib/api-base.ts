const productionBaseUrl = "https://api.ruhshonatort.com/api";
const localBaseUrl = "http://localhost:8090/api";
const localFallbackBaseUrls = ["http://localhost:8091/api", "http://localhost:8092/api"];

function resolveApiBaseUrls() {
  const envBase = (process.env.NEXT_PUBLIC_API_BASE_URL || "").trim().replace(/\/$/, "");
  if (envBase) return [envBase];

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
      throw new Error(text || `API ${response.status}`);
    }

    return (await response.json()) as T;
  }

  if (lastNetworkError) {
    throw new Error(`API bilan bog'lanib bo'lmadi (${apiBaseUrls.join(", ")}). Backend va URL ni tekshiring.`);
  }

  throw new Error("API request failed");
}
