export type ArticleCategory =
  | "tin-tuc"
  | "su-kien"
  | "cong-nghe-am-thanh"
  | "khuyen-mai"
  | string;

export type Article = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  content: string;
  thumbnail?: string | null;
  category: ArticleCategory;
  author: string;
  views: number;
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type ArticleCreatePayload = {
  title: string;
  slug?: string;
  summary: string;
  content: string;
  thumbnail?: string | null;
  category: string;
  isPublished?: boolean;
};

export type ArticleUpdatePayload = Partial<ArticleCreatePayload>;

