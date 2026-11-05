"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Banknote,
  CheckCircle2,
  CreditCard,
  Lock,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Truck,
  User as UserIcon,
} from "lucide-react";

import { AuthModal } from "@/components/sites/raycon/auth-modal";
import { RyvoLogo } from "@/components/sites/raycon/icons";
import { formatUsd } from "@/data/products";
import { createOrder, verifyCoupon } from "@/lib/api";
import { useAuthStore } from "@/store/use-auth-store";
import { useCartStore } from "@/store/use-cart-store";
import type { CartItem } from "@/types/cart";

const emptySubscribe = () => () => {};

export default function CheckoutPage() {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const items = useCartStore((state) => state.items);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const clearCart = useCartStore((state) => state.clearCart);
  const appliedCoupon = useCartStore((state) => state.appliedCoupon);
  const getDiscountAmount = useCartStore((state) => state.getDiscountAmount);
  const applyCoupon = useCartStore((state) => state.applyCoupon);
  const removeCoupon = useCartStore((state) => state.removeCoupon);
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  // Form states (No hardcoded mock demo data)
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    email: user?.email || "",
    address: "",
    district: "",
    city: "",
    notes: "",
    paymentMethod: "cod",
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Discount code state
  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [isVerifyingCoupon, setIsVerifyingCoupon] = useState(false);

  // Order submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<{
    orderId: string;
    items: CartItem[];
    subtotal: number;
    shippingFee: number;
    discount: number;
    total: number;
    customer: typeof formData;
  } | null>(null);

  // Synchronize form details with logged-in user
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.fullName || prev.fullName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  if (!isClient) return null;

  const subtotal = getSubtotal();
  const shippingFee = subtotal >= 500000 || subtotal === 0 ? 0 : 30000;
  const discountAmount = getDiscountAmount();
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);
  const hasOutOfStockItems = items.some((item) => item.product.inStock === false);

  async function handleApplyCoupon(e: React.FormEvent) {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setIsVerifyingCoupon(true);
    setCouponMessage("");

    try {
      const res = await verifyCoupon(couponCode.trim(), subtotal);
      applyCoupon({
        code: res.code,
        discountType: res.discountType,
        discountValue: res.discountValue,
        minOrderAmount: res.minOrderAmount,
        description: res.description,
      });
      setCouponMessage(`🎉 ${res.message}`);
      setCouponCode("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Mã không hợp lệ";
      setCouponMessage(`❌ ${msg}`);
    } finally {
      setIsVerifyingCoupon(false);
    }
  }

  async function handleSubmitOrder(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    if (items.length === 0) return;

    if (!token || !user) {
      setSubmitError("Vui lòng đăng nhập hoặc tạo tài khoản để tiến hành đặt hàng.");
      setIsAuthModalOpen(true);
      return;
    }

    if (hasOutOfStockItems) {
      setSubmitError("Giỏ hàng của bạn chứa sản phẩm đã hết hàng. Vui lòng quay lại giỏ hàng và gỡ sản phẩm đó.");
      return;
    }

    const VN_PHONE_REGEX = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
    if (!VN_PHONE_REGEX.test(formData.phone.trim())) {
      setSubmitError(
        "Số điện thoại không đúng định dạng di động Việt Nam (gồm 10 số, bắt đầu bằng 03, 05, 07, 08, 09 hoặc +84).",
      );
      return;
    }

    setIsSubmitting(true);

    const orderPayload = {
      customerName: formData.fullName.trim(),
      customerEmail: formData.email.trim(),
      customerPhone: formData.phone.trim(),
      shippingAddress: formData.address.trim(),
      shippingCity: formData.city.trim(),
      shippingDistrict: formData.district.trim(),
      paymentMethod: formData.paymentMethod,
      notes: formData.notes.trim() || undefined,
      couponCode: appliedCoupon?.code || undefined,
      items: items.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        colorName: i.selectedColor.name,
        colorImage: i.selectedColor.image,
        unitPrice: i.product.price,
        quantity: i.quantity,
        totalPrice: i.product.price * i.quantity,
      })),
    };

    try {
      const order = await createOrder(orderPayload, token);
      setCompletedOrder({
        orderId: order.orderNumber,
        items: [...items],
        subtotal: order.subtotal,
        shippingFee: order.shippingFee,
        discount: order.discountAmount || discountAmount,
        total: order.totalAmount,
        customer: { ...formData },
      });
      clearCart();
      setOrderComplete(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setSubmitError(err.message);
      } else {
        setSubmitError("Không thể tạo đơn hàng. Vui lòng thử lại sau.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  // Success Screen
  if (orderComplete && completedOrder) {
    return (
      <div className="min-h-screen bg-[#fafbfc] py-12 md:py-16">
        <div className="raycon-container max-w-2xl">
          <div className="rounded-3xl border border-navy/10 bg-white p-8 md:p-12 shadow-sm text-center">
            <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-6">
              <CheckCircle2 className="size-12" />
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-700 uppercase">
              Đặt Hàng Thành Công
            </span>

            <h1 className="mt-3 text-2xl md:text-3xl font-bold text-navy">
              Cảm ơn bạn, {completedOrder.customer.fullName}!
            </h1>
            <p className="mt-2 text-sm text-navy/70">
              Mã đơn hàng: <strong className="text-royal font-mono">{completedOrder.orderId}</strong>
            </p>

            <div className="mt-8 rounded-2xl border border-navy/10 bg-[#f8fbfe] p-6 text-left space-y-4">
              <h2 className="text-base font-bold text-navy flex items-center gap-2">
                <PackageCheck className="size-5 text-royal" />
                Thông tin nhận hàng
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-navy/80">
                <div>
                  <span className="text-xs text-navy/50 block">Người nhận</span>
                  <span className="font-semibold">{completedOrder.customer.fullName}</span>
                </div>
                <div>
                  <span className="text-xs text-navy/50 block">Số điện thoại</span>
                  <span className="font-semibold">{completedOrder.customer.phone}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-xs text-navy/50 block">Địa chỉ giao hàng</span>
                  <span className="font-semibold">
                    {completedOrder.customer.address}, {completedOrder.customer.district}, {completedOrder.customer.city}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-navy/50 block">Phương thức thanh toán</span>
                  <span className="font-semibold uppercase">
                    {completedOrder.customer.paymentMethod === "cod"
                      ? "Thanh toán khi nhận hàng (COD)"
                      : "Chuyển khoản ngân hàng (QR)"}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-navy/50 block">Tổng tiền thanh toán</span>
                  <span className="font-bold text-royal text-base">
                    {formatUsd(completedOrder.total)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={`/orders?track=${completedOrder.orderId}`}
                className="inline-flex h-12 items-center justify-center rounded-full bg-navy px-8 text-sm font-bold text-white transition hover:bg-navy/80"
              >
                Theo dõi & Quản lý đơn hàng này →
              </Link>
              <Link
                href="/"
                className="inline-flex h-12 items-center justify-center rounded-full bg-royal px-8 text-sm font-bold text-white transition hover:bg-[#2827cd]"
              >
                Tiếp tục mua sắm
              </Link>
              <Link
                href="/collections/all"
                className="inline-flex h-12 items-center justify-center rounded-full border border-navy/20 bg-white px-8 text-sm font-bold text-navy hover:bg-navy/5 transition"
              >
                Xem các sản phẩm khác
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart fallback
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#fafbfc] py-16">
        <div className="raycon-container max-w-lg text-center">
          <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-[#e8f7ff] text-royal mb-6">
            <ShoppingBag className="size-10" />
          </div>
          <h1 className="text-2xl font-bold text-navy">Giỏ hàng của bạn đang trống</h1>
          <p className="mt-2 text-sm text-navy/60">
            Vui lòng chọn ít nhất 1 sản phẩm trước khi tiến hành thanh toán.
          </p>
          <Link
            href="/collections/all"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-royal px-8 text-sm font-bold text-white transition hover:bg-[#2827cd]"
          >
            Khám phá sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] py-8 md:py-12">
      <div className="raycon-container max-w-6xl">
        {/* Header Bar */}
        <div className="mb-8 flex items-center justify-between border-b border-navy/10 pb-5">
          <Link href="/" className="inline-block text-navy">
            <RyvoLogo className="h-6 w-[100px]" />
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full">
            <Lock className="size-3.5" />
            <span>Thanh toán bảo mật SSL 256-bit</span>
          </div>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid gap-10 lg:grid-cols-12 items-start">
          {/* Left Column: Form Details (7 cols) */}
          <div className="space-y-6 lg:col-span-7">
            {/* Customer Information */}
            <div className="rounded-3xl border border-navy/10 bg-white p-6 sm:p-8 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <h2 className="text-lg font-bold text-navy">1. Thông tin liên hệ</h2>
                {user ? (
                  <span className="text-xs bg-royal/10 text-royal px-2.5 py-1 rounded-full font-medium">
                    Tài khoản: {user.fullName} ({user.email})
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsAuthModalOpen(true)}
                    className="inline-flex items-center gap-1.5 text-xs bg-royal text-white px-3 py-1.5 rounded-full font-bold hover:bg-[#2827cd] transition cursor-pointer"
                  >
                    <UserIcon className="size-3" />
                    Đăng nhập / Đăng ký
                  </button>
                )}
              </div>

              {!user && (
                <div className="mb-4 flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                  <AlertTriangle className="size-4 shrink-0 text-amber-600" />
                  <span>
                    Bạn cần đăng nhập để đặt hàng và bảo vệ quyền lợi bảo hành.{" "}
                    <button
                      type="button"
                      onClick={() => setIsAuthModalOpen(true)}
                      className="font-bold underline cursor-pointer hover:text-amber-950"
                    >
                      Bấm vào đây để đăng nhập
                    </button>
                  </span>
                </div>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="fullname" className="block text-xs font-bold text-navy/70 uppercase mb-1.5">
                    Họ và tên *
                  </label>
                  <input
                    id="fullname"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="h-11 w-full rounded-xl border border-navy/15 px-3.5 text-sm text-navy focus:border-royal focus:outline-hidden"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-xs font-bold text-navy/70 uppercase mb-1.5">
                    Số điện thoại *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="h-11 w-full rounded-xl border border-navy/15 px-3.5 text-sm text-navy focus:border-royal focus:outline-hidden"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="email" className="block text-xs font-bold text-navy/70 uppercase mb-1.5">
                    Địa chỉ Email nhận hóa đơn *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-11 w-full rounded-xl border border-navy/15 px-3.5 text-sm text-navy focus:border-royal focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="rounded-3xl border border-navy/10 bg-white p-6 sm:p-8 shadow-xs">
              <h2 className="text-lg font-bold text-navy mb-4">2. Địa chỉ giao hàng tại Việt Nam</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-xs font-bold text-navy/70 uppercase mb-1.5">
                    Địa chỉ cụ thể (Số nhà, Tên đường, Tòa nhà) *
                  </label>
                  <input
                    id="address"
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="h-11 w-full rounded-xl border border-navy/15 px-3.5 text-sm text-navy focus:border-royal focus:outline-hidden"
                  />
                </div>
                <div>
                  <label htmlFor="district" className="block text-xs font-bold text-navy/70 uppercase mb-1.5">
                    Quận / Huyện *
                  </label>
                  <input
                    id="district"
                    type="text"
                    required
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="h-11 w-full rounded-xl border border-navy/15 px-3.5 text-sm text-navy focus:border-royal focus:outline-hidden"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-xs font-bold text-navy/70 uppercase mb-1.5">
                    Tỉnh / Thành phố *
                  </label>
                  <input
                    id="city"
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="h-11 w-full rounded-xl border border-navy/15 px-3.5 text-sm text-navy focus:border-royal focus:outline-hidden"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="notes" className="block text-xs font-bold text-navy/70 uppercase mb-1.5">
                    Ghi chú đơn hàng (Tùy chọn)
                  </label>
                  <textarea
                    id="notes"
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full rounded-xl border border-navy/15 p-3 text-sm text-navy focus:border-royal focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="rounded-3xl border border-navy/10 bg-white p-6 sm:p-8 shadow-xs">
              <h2 className="text-lg font-bold text-navy mb-4">3. Phương thức thanh toán</h2>
              <div className="space-y-3">
                <label className={`flex items-center gap-3.5 rounded-2xl border-2 p-4 cursor-pointer transition ${
                  formData.paymentMethod === "cod"
                    ? "border-royal bg-royal/5"
                    : "border-navy/15 hover:border-navy/30"
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="size-4 text-royal"
                  />
                  <Banknote className="size-5 text-royal" />
                  <div>
                    <span className="block text-sm font-bold text-navy">Thanh toán khi nhận hàng (COD)</span>
                    <span className="block text-xs text-navy/60">Kiểm tra sản phẩm thoải mái trước khi thanh toán tiền mặt</span>
                  </div>
                </label>

                <label className={`flex items-center gap-3.5 rounded-2xl border-2 p-4 cursor-pointer transition ${
                  formData.paymentMethod === "bank"
                    ? "border-royal bg-royal/5"
                    : "border-navy/15 hover:border-navy/30"
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank"
                    checked={formData.paymentMethod === "bank"}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="size-4 text-royal"
                  />
                  <CreditCard className="size-5 text-royal" />
                  <div>
                    <span className="block text-sm font-bold text-navy">Chuyển khoản QR ngân hàng / Ví điện tử</span>
                    <span className="block text-xs text-navy/60">Quét mã QR VietQR / MoMo chuyển khoản nhanh 24/7</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary (5 cols) */}
          <div className="lg:col-span-5 sticky top-8">
            <div className="rounded-3xl border border-navy/10 bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-navy mb-4 flex items-center justify-between">
                <span>Tóm tắt đơn hàng</span>
                <span className="text-sm font-medium text-navy/60">({items.length} mặt hàng)</span>
              </h2>

              {/* Items list */}
              <div className="divide-y divide-navy/10 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.selectedColor.name}`} className="flex gap-3.5 py-3">
                    <div className="size-16 shrink-0 rounded-xl bg-[#e8f7ff] p-1.5 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.selectedColor.image || item.product.image}
                        alt=""
                        className="size-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-navy truncate">{item.product.name}</p>
                      <p className="text-xs text-navy/60 mt-0.5">Màu: {item.selectedColor.name}</p>
                      <p className="text-xs text-navy/60">Số lượng: x{item.quantity}</p>
                    </div>
                    <span className="text-xs font-bold text-royal">
                      {formatUsd(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Discount Code Input */}
              <div className="mt-5 border-t border-navy/10 pt-4">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 px-3.5 py-2">
                    <div className="flex items-center gap-2">
                      <Tag className="size-4 text-emerald-600" />
                      <div>
                        <p className="text-xs font-bold text-emerald-800">
                          {appliedCoupon.code}
                        </p>
                        <p className="text-[10px] text-emerald-600">
                          {appliedCoupon.description || "Đã áp dụng mã giảm giá"}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-xs font-semibold text-emerald-700 hover:text-red-600 transition"
                    >
                      Gỡ mã
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Mã giảm giá (ví dụ: RYVO10)"
                      className="h-10 flex-1 rounded-xl border border-navy/15 px-3 text-xs uppercase text-navy focus:border-royal focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={isVerifyingCoupon || !couponCode.trim()}
                      className="h-10 rounded-xl bg-navy px-4 text-xs font-bold text-white hover:bg-royal transition disabled:opacity-50 cursor-pointer"
                    >
                      {isVerifyingCoupon ? "..." : "Áp dụng"}
                    </button>
                  </div>
                )}
                {couponMessage ? (
                  <p className="mt-2 text-xs font-medium text-emerald-600">
                    {couponMessage}
                  </p>
                ) : null}
              </div>

              {/* Cost Calculations */}
              <div className="mt-5 space-y-2 border-t border-navy/10 pt-4 text-sm">
                <div className="flex justify-between text-navy/70">
                  <span>Tạm tính (Subtotal)</span>
                  <span className="font-semibold text-navy">{formatUsd(subtotal)}</span>
                </div>
                {appliedCoupon && discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Khuyến mại ({appliedCoupon.code})</span>
                    <span>-{formatUsd(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-navy/70">
                  <span className="flex items-center gap-1">
                    <Truck className="size-3.5 text-royal" /> Phí vận chuyển
                  </span>
                  <span className="font-semibold text-navy">
                    {shippingFee === 0 ? (
                      <strong className="text-emerald-600 uppercase text-xs">Miễn phí</strong>
                    ) : (
                      formatUsd(shippingFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between border-t border-navy/10 pt-3 text-base font-bold text-navy">
                  <span>Tổng thanh toán</span>
                  <span className="text-2xl font-bold text-royal">{formatUsd(finalTotal)}</span>
                </div>
              </div>

              {/* Out of Stock Warning */}
              {hasOutOfStockItems && (
                <div className="mt-4 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                  <AlertCircle className="size-4 shrink-0 text-red-600" />
                  <span>Một số sản phẩm trong giỏ đã hết hàng. Vui lòng quay lại giỏ hàng gỡ bỏ trước khi tiếp tục.</span>
                </div>
              )}

              {/* Submit Error Message */}
              {submitError && (
                <div className="mt-4 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                  <AlertCircle className="size-4 shrink-0 text-red-600" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || hasOutOfStockItems}
                className="mt-6 flex h-13 w-full items-center justify-center gap-2 rounded-full bg-royal px-8 text-sm font-bold tracking-wider text-white uppercase transition hover:bg-[#2827cd] shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Đang xử lý đơn hàng...</span>
                ) : hasOutOfStockItems ? (
                  <span>Có sản phẩm hết hàng</span>
                ) : !user ? (
                  <span>Đăng Nhập Để Đặt Hàng ({formatUsd(finalTotal)})</span>
                ) : (
                  <span>Xác Nhận Đặt Hàng ({formatUsd(finalTotal)})</span>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-navy/50">
                <ShieldCheck className="size-4 text-emerald-600" />
                <span>Cam kết chính hãng · Đổi trả trong 30 ngày</span>
              </div>
            </div>
          </div>
        </form>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}
