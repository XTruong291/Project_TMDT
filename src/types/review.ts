export type ProductReview = {
  id: number;
  productId: string;
  authorName: string;
  authorEmail: string;
  rating: number;
  title?: string | null;
  comment: string;
  createdAt: string;
};

export type ReviewCreatePayload = {
  authorName?: string;
  authorEmail?: string;
  rating: number;
  title?: string;
  comment: string;
};

