export type Category = {
  id: string;
  name: string;
};

export type PublicProduct = {
  id: string;
  name: string;
  barcode?: string | null;
  images: string[];
  videos: string[];
  categoryId: string;
  category?: {
    id: string;
    name: string;
  };
  unit?: {
    id: string;
    name: string;
    short: string;
  };
  price?: number | null;
  salePrice?: number | null;
  currentPrice: number;
};

export type CartItem = {
  productId: string;
  name: string;
  image?: string;
  unitPrice: number;
  quantity: number;
};

export type CreatePublicOrderItem = {
  productId: string;
  quantity: number;
};

export type CreatePublicOrderDto = {
  customerName: string;
  phone?: string;
  address?: string;
  note?: string;
  customerId?: string;
  items: CreatePublicOrderItem[];
};

export type ProductReview = {
  id: string;
  rating: number;
  comment?: string;
  productId: string;
  customerId: string;
  customer: {
    name: string;
  };
  createdAt: string;
};

export type CreateReviewDto = {
  rating: number;
  comment?: string;
  productId: string;
};

export type CreatePublicOrderResult = {
  id: string;
  trackCode?: string;
  total: number;
  status: "NEW" | "IN_DELIVERY" | "DELIVERED" | "CANCELED";
  createdAt: string;
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  points: number;
  birthday?: string | null;
  active: boolean;
  createdAt: string;
};

export type LoginCustomerDto = {
  phone: string;
  password: string;
};

export type RegisterCustomerDto = {
  name: string;
  phone: string;
  password?: string;
  address?: string;
  birthday?: string;
};

export type Coupon = {
  id: string;
  code: string;
  discount: number;
  isPercent: boolean;
  minOrder: number;
};

export type CustomerAuthResult = {
  token: string;
  customer: Customer;
};

export type CustomRequestStatus = "PENDING" | "QUOTED" | "ACCEPTED" | "REJECTED" | "CANCELED";

export type CustomRequest = {
  id: string;
  customerId: string;
  description: string;
  referenceImages: string[];
  desiredDate: string;
  status: CustomRequestStatus;
  priceQuote?: number;
  adminNote?: string;
  customer?: {
    name: string;
    phone: string;
  };
  createdAt: string;
};

export type CreateCustomRequestDto = {
  description: string;
  referenceImages?: string[];
  desiredDate: string;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  content: string;
  image?: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};
