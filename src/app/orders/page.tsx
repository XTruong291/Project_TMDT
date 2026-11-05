"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Package,
  PackageCheck,
  RefreshCw,
  Search,
  Truck,
  X,
  XCircle,
} from "lucide-react";

import { RyvoLogo } from "@/components/sites/raycon/icons";
import { formatUsd } from "@/data/products";
import { cancelOrder, getMyOrders, trackOrder } from "@/lib/api";
import { useAuthStore } from "@/store/use-auth-store";
import type { Order, OrderStatus } from "@/types/order";

const CANCEL_REASONS = [
  "Đổi ý, không có nhu cầu mua nữa",
  "Muốn đổi màu sắc hoặc sản phẩm khác",
  "Điền sai địa chỉ nhận hàng hoặc số điện thoại",
  "Tìm thấy giá tốt hơn ở nơi khác",
  "Thời gian giao hàng dự kiến quá lâu",
  "Lý do khác",
];

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; bg: string; text: string; icon: typeof Clock }
> = {
  pending: {
    label: "Chờ xác nhận",
    bg: "bg-amber-50 border-amber-200",
    text: "text-amber-700",
    icon: Clock,
  },
  processing: {
    label: "Đang đóng gói",
    bg: "bg-blue-50 border-blue-200",
    text: "text-blue-700",
    icon: Package,
  },
  shipped: {
    label: "Đang giao hàng",
    bg: "bg-purple-50 border-purple-200",
    text: "text-purple-700",
    icon: Truck,
  },
  delivered: {
    label: "Đã giao hàng",
    bg: "bg-emerald-50 border-emerald-200",
    text: "text-emerald-700",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Đã hủy",
    bg: "bg-rose-50 border-rose-200",
    text: "text-rose-700",
    icon: XCircle,
  },
};

function StatusStepper({ status }: { status: OrderStatus }) {
  if (status === "cancelled") {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-center">
        <div className="inline-flex size-10 items-center justify-center rounded-full bg-rose-100 text-rose-600 mb-2">
          <XCircle className="size-6" />
        </div>
        <h4 className="text-sm font-bold text-rose-800">Đơn hàng này đã bị hủy</h4>
        <p className="mt-1 text-xs text-rose-600">
          Đơn hàng không còn hiệu lực. Quý khách có thể tiến hành đặt lại đơn hàng mới bất cứ lúc nào.
        </p>
      </div>
    );
  }

  const steps: { key: OrderStatus; label: string; icon: typeof Clock }[] = [
    { key: "pending", label: "Đã đặt hàng", icon: Clock },
    { key: "processing", label: "Đang đóng gói", icon: Package },
    { key: "shipped", label: "Đang giao hàng", icon: Truck },
    { key: "delivered", label: "Giao thành công", icon: CheckCircle2 },
  ];

  const stepOrder = ["pending", "processing", "shipped", "delivered"];
  const currentIndex = stepOrder.indexOf(status);

  return (
    <div className="py-4">
      <div className="relative flex items-center justify-between">
        <div className="absolute left-6 right-6 top-5 -z-0 h-1 bg-gray-100" />
        <div
          className="absolute left-6 top-5 -z-0 h-1 bg-royal transition-all duration-500"
          style={{
            width: `${Math.max(0, (currentIndex / (steps.length - 1)) * 100)}%`,
          }}
        />

        {steps.map((step, idx) => {
          const isDone = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          const Icon = step.icon;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center">
              <div
                className={`flex size-10 items-center justify-center rounded-full border-2 transition-all ${
                  isCurrent
                    ? "border-royal bg-royal text-white ring-4 ring-royal/20 scale-110"
                    : isDone
                      ? "border-royal bg-royal text-white"
                      : "border-gray-200 bg-white text-gray-400"
                }`}
              >
                <Icon className="size-4" />
              </div>
              <span
                className={`mt-2 text-[11px] font-bold text-center ${
                  isCurrent ? "text-royal" : isDone ? "text-navy" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OrdersContent() {
  const searchParams = useSearchParams();
  const queryTrack = searchParams.get("track") || "";

  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  // States
  const [searchInput, setSearchInput] = useState(queryTrack);
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [isLoadingMyOrders, setIsLoadingMyOrders] = useState(false);
  const [recentGuestOrders, setRecentGuestOrders] = useState<string[]>([]);

  // Cancellation Modal States
  const [cancellingOrder, setCancellingOrder] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState(CANCEL_REASONS[0]);
  const [guestEmail, setGuestEmail] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");
  const [cancelSuccessMsg, setCancelSuccessMsg] = useState("");

  // Load recent guest orders from localStorage
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("raycon_guest_orders") || "[]");
      if (Array.isArray(stored)) {
        setRecentGuestOrders(stored);
      }
    } catch {
      // Ignore
    }
  }, []);

  // Fetch logged in customer's orders
  useEffect(() => {
    if (token) {
      setIsLoadingMyOrders(true);
      getMyOrders(token)
        .then((orders) => setMyOrders(orders))
        .catch(() => setMyOrders([]))
        .finally(() => setIsLoadingMyOrders(false));
    } else {
      setMyOrders([]);
    }
  }, [token]);

  // If query parameter track is present, auto search
  useEffect(() => {
    if (queryTrack.trim()) {
      handleSearchOrder(queryTrack.trim());
    }
  }, [queryTrack]);

  async function handleSearchOrder(orderNo: string) {
    if (!orderNo.trim()) return;
    setIsSearching(true);
    setSearchError("");
    setCancelSuccessMsg("");

    try {
      const order = await trackOrder(orderNo.trim());
      setTrackedOrder(order);
    } catch {
      setSearchError(`Không tìm thấy đơn hàng với mã "${orderNo}". Vui lòng kiểm tra lại.`);
      setTrackedOrder(null);
    } finally {
      setIsSearching(false);
    }
  }

  function openCancelModal(order: Order) {
    setCancellingOrder(order);
    setCancelReason(CANCEL_REASONS[0]);
    setGuestEmail(order.customerEmail || user?.email || "");
    setCancelError("");
  }

  async function handleConfirmCancel() {
    if (!cancellingOrder) return;
    setIsCancelling(true);
    setCancelError("");

    try {
      const updated = await cancelOrder(
        cancellingOrder.orderNumber,
        {
          guestEmail: guestEmail.trim() || cancellingOrder.customerEmail,
          reason: cancelReason,
        },
        token || undefined,
      );

      // Update in trackedOrder state if matches
      if (trackedOrder && trackedOrder.id === updated.id) {
        setTrackedOrder(updated);
      }

      // Update in myOrders list
      setMyOrders((prev) =>
        prev.map((o) => (o.id === updated.id ? { ...o, status: "cancelled" } : o)),
      );

      setCancelSuccessMsg(`Đơn hàng ${updated.orderNumber} đã được hủy thành công!`);
      setCancellingOrder(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Không thể hủy đơn hàng";
      setCancelError(msg);
    } finally {
      setIsCancelling(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] py-8 md:py-12">
      <div className="raycon-container max-w-5xl">
        {/* Navigation & Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-navy/10 pb-5">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-navy/70 hover:text-royal transition-colors"
            >
              <ArrowLeft className="size-4" />
              <span>Về trang chủ</span>
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/" className="inline-block text-navy">
              <RyvoLogo className="h-6 w-[100px]" />
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-full bg-royal/10 text-royal">
              <PackageCheck className="size-4" />
            </span>
            <span className="text-sm font-bold text-navy">
              Theo dõi & Quản lý Đơn hàng
            </span>
          </div>
        </div>

        {/* Global Notification Banner */}
        {cancelSuccessMsg && (
          <div className="mb-6 flex items-center justify-between rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-sm font-semibold text-emerald-800 animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-emerald-600" />
              <span>{cancelSuccessMsg}</span>
            </div>
            <button
              type="button"
              onClick={() => setCancelSuccessMsg("")}
              className="text-emerald-700 hover:text-emerald-900"
            >
              <X className="size-4" />
            </button>
          </div>
        )}

        {/* Quick Search Card */}
        <div className="mb-8 rounded-3xl border border-navy/10 bg-white p-6 md:p-8 shadow-xs">
          <h2 className="text-lg md:text-xl font-bold text-navy">
            Tra cứu nhanh đơn hàng
          </h2>
          <p className="mt-1 text-xs text-navy/60">
            Dành cho cả khách vãng lai và thành viên. Nhập mã đơn hàng được gửi qua email hoặc lưu trên hóa đơn để kiểm tra tiến trình.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchOrder(searchInput);
            }}
            className="mt-4 flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                required
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Ví dụ: RYVO-20261105-XXXXXX hoặc RAY-..."
                className="h-12 w-full rounded-2xl border border-navy/15 pl-10 pr-4 text-sm text-navy outline-none focus:border-royal focus:ring-2 focus:ring-royal/20 transition-all uppercase"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-royal px-8 text-sm font-bold text-white transition hover:bg-[#2827cd] disabled:opacity-50 cursor-pointer"
            >
              {isSearching ? (
                <>
                  <RefreshCw className="mr-2 size-4 animate-spin" />
                  Đang tìm...
                </>
              ) : (
                "Tra cứu đơn hàng"
              )}
            </button>
          </form>

          {/* Quick Select from Recent Guest Orders */}
          {recentGuestOrders.length > 0 && (
            <div className="mt-4 border-t border-gray-100 pt-3">
              <span className="text-xs font-semibold text-gray-500">
                Đơn hàng vừa đặt trên trình duyệt này:
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {recentGuestOrders.map((no) => (
                  <button
                    key={no}
                    type="button"
                    onClick={() => {
                      setSearchInput(no);
                      handleSearchOrder(no);
                    }}
                    className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-bold text-navy hover:bg-royal/10 hover:border-royal hover:text-royal transition-all cursor-pointer"
                  >
                    <span>{no}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {searchError && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-xs font-medium text-red-600 animate-in fade-in">
              <AlertCircle className="size-4 shrink-0" />
              <span>{searchError}</span>
            </div>
          )}
        </div>

        {/* Display Tracked Order (If searched) */}
        {trackedOrder && (
          <div className="mb-10 rounded-3xl border border-navy/10 bg-white p-6 md:p-8 shadow-xs animate-in fade-in">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
              <div>
                <span className="text-xs text-gray-400 font-medium block">
                  Kết quả tra cứu đơn hàng
                </span>
                <h3 className="text-lg md:text-xl font-bold text-navy flex items-center gap-2">
                  <span>{trackedOrder.orderNumber}</span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold ${
                      STATUS_CONFIG[trackedOrder.status].bg
                    } ${STATUS_CONFIG[trackedOrder.status].text}`}
                  >
                    {STATUS_CONFIG[trackedOrder.status].label}
                  </span>
                </h3>
              </div>

              {/* Cancel Button if eligible */}
              {(trackedOrder.status === "pending" || trackedOrder.status === "processing") && (
                <button
                  type="button"
                  onClick={() => openCancelModal(trackedOrder)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                >
                  <XCircle className="size-4" />
                  <span>Hủy đơn hàng này</span>
                </button>
              )}
            </div>

            {/* Stepper */}
            <div className="my-6">
              <StatusStepper status={trackedOrder.status} />
            </div>

            {/* Order Items List */}
            <div className="border-t border-gray-100 pt-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-navy/70 mb-3">
                Sản phẩm trong đơn ({trackedOrder.items.length})
              </h4>
              <div className="divide-y divide-gray-100">
                {trackedOrder.items.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="size-14 rounded-xl bg-gray-50 border border-gray-100 p-1 shrink-0 flex items-center justify-center">
                        {item.colorImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.colorImage}
                            alt={item.productName}
                            className="size-full object-contain"
                          />
                        ) : (
                          <Package className="size-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-navy">{item.productName}</p>
                        <p className="text-xs text-gray-500">
                          Màu: <span className="font-medium text-navy">{item.colorName}</span> | SL:{" "}
                          <span className="font-semibold text-navy">{item.quantity}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-royal">
                        {formatUsd(item.totalPrice)}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        {formatUsd(item.unitPrice)} / cái
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery & Payment Summary */}
            <div className="mt-6 rounded-2xl bg-[#fafbfc] border border-gray-100 p-4 sm:p-5 grid gap-4 sm:grid-cols-2 text-xs">
              <div>
                <span className="text-gray-400 font-medium block">Người nhận hàng</span>
                <span className="font-bold text-navy text-sm block">
                  {trackedOrder.customerName} - {trackedOrder.customerPhone}
                </span>
                <span className="text-gray-600 mt-1 block">
                  {trackedOrder.shippingAddress}, {trackedOrder.shippingDistrict},{" "}
                  {trackedOrder.shippingCity}
                </span>
                {trackedOrder.notes && (
                  <p className="mt-2 text-gray-500 italic">
                    Ghi chú: {trackedOrder.notes}
                  </p>
                )}
              </div>
              <div className="space-y-1 sm:text-right border-t sm:border-t-0 sm:border-l border-gray-200 pt-3 sm:pt-0 sm:pl-4">
                <div className="flex justify-between sm:justify-end gap-4 text-gray-500">
                  <span>Tạm tính:</span>
                  <span className="font-semibold text-navy">{formatUsd(trackedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between sm:justify-end gap-4 text-gray-500">
                  <span>Phí giao hàng:</span>
                  <span className="font-semibold text-navy">
                    {trackedOrder.shippingFee === 0 ? "Miễn phí" : formatUsd(trackedOrder.shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between sm:justify-end gap-4 text-sm font-bold pt-1 border-t border-gray-200">
                  <span className="text-navy">Tổng thanh toán:</span>
                  <span className="text-royal font-bold text-base">
                    {formatUsd(trackedOrder.totalAmount)}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 uppercase pt-1">
                  Phương thức: {trackedOrder.paymentMethod === "cod" ? "Thanh toán khi nhận hàng (COD)" : "Chuyển khoản QR"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Logged in Customer Order History */}
        {user ? (
          <div className="rounded-3xl border border-navy/10 bg-white p-6 md:p-8 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg md:text-xl font-bold text-navy">
                  Lịch sử đơn hàng của bạn
                </h3>
                <p className="text-xs text-gray-500">
                  Tài khoản: <span className="font-bold text-navy">{user.fullName}</span> ({user.email})
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (token) {
                    setIsLoadingMyOrders(true);
                    getMyOrders(token)
                      .then((orders) => setMyOrders(orders))
                      .finally(() => setIsLoadingMyOrders(false));
                  }
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-royal hover:underline"
              >
                <RefreshCw className="size-3.5" />
                <span>Làm mới danh sách</span>
              </button>
            </div>

            {isLoadingMyOrders ? (
              <div className="py-12 text-center text-sm text-gray-500">
                <RefreshCw className="mx-auto size-6 animate-spin text-royal mb-2" />
                Đang tải lịch sử đơn hàng...
              </div>
            ) : myOrders.length === 0 ? (
              <div className="py-12 text-center">
                <Package className="mx-auto size-12 text-gray-300 mb-3" />
                <p className="text-sm font-bold text-navy">Bạn chưa có đơn hàng nào</p>
                <p className="text-xs text-gray-500 mt-1">
                  Khám phá các sản phẩm công nghệ âm thanh thời thượng từ RYVO ngay hôm nay.
                </p>
                <Link
                  href="/collections/all"
                  className="mt-4 inline-flex h-10 items-center justify-center rounded-full bg-royal px-6 text-xs font-bold text-white hover:bg-[#2827cd] transition-colors"
                >
                  Mua sắm ngay
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 mt-4">
                {myOrders.map((order) => {
                  const statusInfo = STATUS_CONFIG[order.status];
                  const canCancel = order.status === "pending" || order.status === "processing";

                  return (
                    <div key={order.id} className="py-5">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-navy text-sm sm:text-base">
                            {order.orderNumber}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold ${statusInfo.bg} ${statusInfo.text}`}
                          >
                            {statusInfo.label}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      {/* Item thumbnail previews */}
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-2 rounded-xl bg-gray-50 border border-gray-100 p-2 pr-3 text-xs"
                          >
                            <div className="size-9 rounded-lg bg-white p-0.5 border border-gray-100 flex items-center justify-center overflow-hidden">
                              {item.colorImage ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={item.colorImage}
                                  alt={item.productName}
                                  className="size-full object-contain"
                                />
                              ) : (
                                <Package className="size-4 text-gray-400" />
                              )}
                            </div>
                            <span className="font-bold text-navy">{item.productName}</span>
                            <span className="text-gray-400">x{item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
                        <div className="text-gray-500">
                          Tổng cộng:{" "}
                          <span className="font-bold text-royal text-sm">
                            {formatUsd(order.totalAmount)}
                          </span>{" "}
                          ({order.paymentMethod.toUpperCase()})
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setTrackedOrder(order);
                              setSearchInput(order.orderNumber);
                              window.scrollTo({ top: 180, behavior: "smooth" });
                            }}
                            className="rounded-full border border-navy/20 px-3.5 py-1.5 font-bold text-navy hover:bg-navy/5 transition-colors cursor-pointer"
                          >
                            Xem chi tiết
                          </button>

                          {canCancel && (
                            <button
                              type="button"
                              onClick={() => openCancelModal(order)}
                              className="rounded-full border border-red-200 bg-red-50 px-3.5 py-1.5 font-bold text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                            >
                              Hủy đơn
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-8 text-center text-xs text-gray-500">
            <p className="font-bold text-navy text-sm">
              Bạn có tài khoản thành viên?
            </p>
            <p className="mt-1">
              Đăng nhập để tự động lưu trữ và xem toàn bộ lịch sử đơn hàng của bạn ở bất kỳ đâu.
            </p>
          </div>
        )}
      </div>

      {/* Cancel Order Modal */}
      {cancellingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 md:p-8 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <div className="flex items-center gap-2 text-rose-600">
                <AlertCircle className="size-5" />
                <h3 className="text-base font-bold text-navy">Xác nhận Hủy Đơn Hàng</h3>
              </div>
              <button
                type="button"
                onClick={() => setCancellingOrder(null)}
                className="text-gray-400 hover:text-navy"
              >
                <X className="size-5" />
              </button>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Bạn đang yêu cầu hủy đơn hàng{" "}
              <strong className="text-navy">{cancellingOrder.orderNumber}</strong>. Thao tác này
              không thể hoàn tác.
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-navy/70 uppercase mb-1">
                  Lý do hủy đơn *
                </label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 px-3 text-xs text-navy outline-none focus:border-royal focus:bg-white"
                >
                  {CANCEL_REASONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Guest Email confirmation field */}
              {!user && (
                <div>
                  <label className="block text-xs font-bold text-navy/70 uppercase mb-1">
                    Email đặt hàng (Xác nhận quyền sở hữu) *
                  </label>
                  <input
                    type="email"
                    required
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 px-3 text-xs text-navy outline-none focus:border-royal focus:bg-white"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">
                    Đã điền tự động từ thông tin người đặt.
                  </span>
                </div>
              )}

              {cancelError && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-600">
                  {cancelError}
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={isCancelling}
                onClick={() => setCancellingOrder(null)}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-navy hover:bg-gray-50 transition-colors"
              >
                Giữ lại đơn
              </button>
              <button
                type="button"
                disabled={isCancelling}
                onClick={handleConfirmCancel}
                className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isCancelling ? (
                  <>
                    <RefreshCw className="size-3.5 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  "Xác nhận hủy đơn"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OrdersLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#fafbfc] py-12">
      <div className="raycon-container max-w-4xl text-center">
        <RefreshCw className="mx-auto size-8 animate-spin text-royal mb-4" />
        <h2 className="text-lg font-bold text-navy">Đang tải thông tin đơn hàng...</h2>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<OrdersLoadingSkeleton />}>
      <OrdersContent />
    </Suspense>
  );
}

