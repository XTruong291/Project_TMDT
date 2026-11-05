export type ContactStatus = "unread" | "read" | "responded";

export type Contact = {
  id: number;
  fullName: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  subject?: string | null;
  message: string;
  status: ContactStatus;
  createdAt: string;
};

export type ContactCreatePayload = {
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  subject?: string;
  message: string;
};

