import { apiFetch } from "./api-base";
import type { Category, CreatePublicOrderDto, CreatePublicOrderResult, PublicProduct } from "./types";

export function getCategories() {
  return apiFetch<Category[]>("/public/categories", { method: "GET" });
}

export function getProducts(filters?: { categoryId?: string; q?: string }) {
  const params = new URLSearchParams();
  if (filters?.categoryId) params.set("categoryId", filters.categoryId);
  if (filters?.q) params.set("q", filters.q);
  const query = params.toString() ? `?${params.toString()}` : "";
  return apiFetch<PublicProduct[]>(`/public/products${query}`, { method: "GET" });
}

export function createPublicOrder(payload: CreatePublicOrderDto) {
  return apiFetch<CreatePublicOrderResult>("/public/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
