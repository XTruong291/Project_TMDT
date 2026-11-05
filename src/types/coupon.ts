export type Coupon = {
  id: number;
  code: string;
  discountType: "percent" | "fixed";
  discountValue: number;
  minOrderAmount: number;
  description?: string | null;
  isActive: boolean;
};

export type CouponVerifyResponse = {
  valid: boolean;
  code: string;
  discountType: "percent" | "fixed";
  discountValue: number;
  discountAmount: number;
  minOrderAmount: number;
  description?: string | null;
  message: string;
};

export type AppliedCoupon = {
  code: string;
  discountType: "percent" | "fixed";
  discountValue: number;
  minOrderAmount: number;
  description?: string | null;
};

