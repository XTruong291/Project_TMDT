export type AboutCategory =
  | "company_overview"
  | "products_services"
  | "mission_vision";

export type AboutSection = {
  id: number;
  title: string;
  category: AboutCategory | string;
  content: string;
  imageUrl?: string | null;
  isVisible: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type AboutSectionCreatePayload = {
  title: string;
  category: string;
  content: string;
  imageUrl?: string | null;
  isVisible?: boolean;
  sortOrder?: number;
};

export type AboutSectionUpdatePayload = Partial<AboutSectionCreatePayload>;

