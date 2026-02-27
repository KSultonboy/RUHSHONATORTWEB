import { apiFetch } from "./api-base";
import type {
  Category,
  CreatePublicOrderDto,
  CreatePublicOrderResult,
  PublicProduct,
  Customer,
  CustomerMessage,
  LoginCustomerDto,
  RegisterCustomerDto,
  CustomerAuthResult,
  ProductReview,
  CreateReviewDto,
  CustomRequest,
  CreateCustomRequestDto,
  Coupon,
  Post
} from "./types";
// ... existing code ...
export function validateCoupon(token: string, code: string, total: number) {
  return apiFetch<Coupon>(`/coupons/validate?code=${code}&total=${total}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function getCategories() {
  return apiFetch<Category[]>("/public/categories", { method: "GET" });
}

export function getProducts(filters?: { categoryId?: string; q?: string; minPrice?: number; maxPrice?: number }) {
  const params = new URLSearchParams();
  if (filters?.categoryId) params.set("categoryId", filters.categoryId);
  if (filters?.q) params.set("q", filters.q);
  if (filters?.minPrice !== undefined) params.set("minPrice", filters.minPrice.toString());
  if (filters?.maxPrice !== undefined) params.set("maxPrice", filters.maxPrice.toString());
  const query = params.toString() ? `?${params.toString()}` : "";
  return apiFetch<PublicProduct[]>(`/public/products${query}`, { method: "GET" });
}

export function createPublicOrder(payload: CreatePublicOrderDto) {
  return apiFetch<CreatePublicOrderResult>("/public/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// Customer Auth
export function registerCustomer(dto: RegisterCustomerDto) {
  return apiFetch<Customer>("/customer-auth/register", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export function loginCustomer(dto: LoginCustomerDto) {
  return apiFetch<CustomerAuthResult>("/customer-auth/login", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export function getCustomerMe(token: string) {
  return apiFetch<Customer>("/customer-auth/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function updateCustomerMe(
  token: string,
  dto: { name?: string; address?: string; birthday?: string }
) {
  return apiFetch<Customer>("/customer-auth/me", {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(dto),
  });
}

// Customer Orders
export function getCustomerOrders(token: string) {
  return apiFetch<any[]>("/customers/orders", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function getCustomerMessages(token: string) {
  return apiFetch<CustomerMessage[]>("/customers/messages", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function getProductReviews(productId: string) {
  return apiFetch<ProductReview[]>(`/reviews/product/${productId}`, {
    method: "GET",
  });
}

export function postReview(token: string, dto: CreateReviewDto) {
  return apiFetch<ProductReview>("/reviews", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(dto),
  });
}

export function getMyCustomRequests(token: string) {
  return apiFetch<CustomRequest[]>("/custom-requests/my", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function postCustomRequest(token: string, dto: CreateCustomRequestDto) {
  return apiFetch<CustomRequest>("/custom-requests", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(dto),
  });
}

export function getPosts() {
  return apiFetch<Post[]>("/public/posts", { method: "GET" });
}

export function getPostBySlug(slug: string) {
  return apiFetch<Post>(`/public/posts/${slug}`, { method: "GET" });
}
