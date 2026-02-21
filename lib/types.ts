export type Category = {
  id: string;
  name: string;
};

export type PublicProduct = {
  id: string;
  name: string;
  barcode?: string | null;
  images: string[];
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
  items: CreatePublicOrderItem[];
};

export type CreatePublicOrderResult = {
  id: string;
  trackCode?: string;
  total: number;
  status: "NEW" | "IN_DELIVERY" | "DELIVERED" | "CANCELED";
  createdAt: string;
};
