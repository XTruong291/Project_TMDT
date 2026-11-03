"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  XCircle,
  Eye,
  Loader2,
  X,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { adminGetOrders, adminUpdateOrderStatus } from "@/lib/api";
import { formatUsd } from "@/data/products";
import { useAuthStore } from "@/store/use-auth-store";
import type { Order, OrderStatus } from "@/types/order";

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; bg: string; icon: typeof Clock }
> = {
  pending: {
    label: "Chờ xác nhận",
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
    icon: Clock,
  },
  processing: {
    label: "Đang xử lý",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    icon: Package,
  },
  shipped: {
    label: "Đang giao hàng",
    color: "text-purple-700",
    bg: "bg-purple-50 border-purple-200",
    icon: Truck,
  },
  delivered: {
    label: "Đã giao thành công",
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Đã hủy",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    icon: XCircle,
  },
};

export default function AdminOrdersPage() {
  const token = useAuthStore((state) => state.token);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Selected Order for Detail Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const loadOrders = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await adminGetOrders(undefined, token);
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        o.customerName.toLowerCase().includes(search.toLowerCase()) ||
        o.customerPhone.includes(search) ||
        o.customerEmail.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  async function handleStatusChange(orderId: number, newStatus: OrderStatus) {
    if (!token) return;
    setUpdatingId(orderId);
    try {
      const updated = await adminUpdateOrderStatus(orderId, newStatus, token);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: updated.status } : o)),
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: updated.status } : null));
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy tracking-tight">
            Quản lý Đơn hàng
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Tổng cộng: <strong className="text-royal font-bold">{orders.length}</strong> đơn hàng đã ghi nhận từ khách hàng
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo mã đơn hàng, tên khách, số điện thoại..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2 pl-10 pr-4 text-xs text-navy outline-none focus:border-navy focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`rounded-xl px-3 py-2 text-xs font-bold transition-all shrink-0 cursor-pointer ${
                statusFilter === st
                  ? "bg-navy text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {st === "all" ? "Tất cả" : STATUS_CONFIG[st as OrderStatus]?.label || st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="size-8 animate-spin text-royal" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <ShoppingBag className="size-12 text-gray-300 mb-3" />
            <p className="text-sm font-bold text-navy">Chưa có đơn hàng nào phù hợp</p>
            <p className="text-xs text-gray-400 mt-1">Đơn hàng mới từ trang Checkout sẽ hiển thị tại đây.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/75 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  <th className="py-3 px-4">Mã đơn hàng</th>
                  <th className="py-3 px-4">Khách hàng</th>
                  <th className="py-3 px-4">Tổng tiền</th>
                  <th className="py-3 px-4">Ngày đặt</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4 text-right">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs font-medium text-navy">
                {filteredOrders.map((order) => {
                  const statusInfo = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                  return (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      {/* Order Number */}
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-royal">
                          {order.orderNumber}
                        </span>
                        <p className="text-[11px] text-gray-400">
                          {order.items.length} món đồ
                        </p>
                      </td>

                      {/* Customer Info */}
                      <td className="py-3 px-4">
                        <p className="font-bold text-navy">{order.customerName}</p>
                        <p className="text-[11px] text-gray-400">{order.customerPhone}</p>
                      </td>

                      {/* Total */}
                      <td className="py-3 px-4">
                        <span className="font-bold text-navy text-sm">
                          {formatUsd(order.totalAmount)}
                        </span>
                        <p className="text-[10px] text-gray-400 uppercase font-bold">
                          {order.paymentMethod}
                        </p>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </td>

                      {/* Status Selector */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={order.status}
                            disabled={updatingId === order.id}
                            onChange={(e) =>
                              handleStatusChange(
                                order.id,
                                e.target.value as OrderStatus,
                              )
                            }
                            className={`rounded-xl border px-2.5 py-1 text-xs font-bold outline-none cursor-pointer ${statusInfo.bg} ${statusInfo.color}`}
                          >
                            <option value="pending">Chờ xác nhận</option>
                            <option value="processing">Đang xử lý</option>
                            <option value="shipped">Đang giao hàng</option>
                            <option value="delivered">Đã giao thành công</option>
                            <option value="cancelled">Đã hủy đơn</option>
                          </select>
                          {updatingId === order.id && (
                            <Loader2 className="size-3 animate-spin text-gray-400" />
                          )}
                        </div>
                      </td>

                      {/* View Action */}
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex size-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-navy transition-colors cursor-pointer"
                          title="Xem chi tiết đơn hàng"
                        >
                          <Eye className="size-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-gray-100 p-6 md:p-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <div>
                <span className="text-[11px] font-bold text-royal uppercase tracking-wider font-mono">
                  {selectedOrder.orderNumber}
                </span>
                <h3 className="text-xl font-bold text-navy mt-0.5">
                  Chi tiết Đơn hàng
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="flex size-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-navy"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Customer Info Box */}
            <div className="rounded-2xl border border-gray-200 bg-gray-50/60 p-4 mb-6 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-navy">
                <MapPin className="size-4 text-royal shrink-0" />
                <span>
                  {selectedOrder.shippingAddress}, {selectedOrder.shippingDistrict},{" "}
                  {selectedOrder.shippingCity}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-600 pt-1">
                <div className="flex items-center gap-1.5">
                  <Phone className="size-3.5 text-gray-400" />
                  <span>{selectedOrder.customerPhone}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="size-3.5 text-gray-400" />
                  <span>{selectedOrder.customerEmail}</span>
                </div>
              </div>
              {selectedOrder.notes && (
                <div className="pt-2 text-xs text-amber-800 bg-amber-50/80 rounded-lg p-2 border border-amber-100">
                  <strong>Ghi chú:</strong> {selectedOrder.notes}
                </div>
              )}
            </div>

            {/* Items List */}
            <h4 className="text-xs font-bold uppercase tracking-wider text-navy/70 mb-3">
              Danh sách Sản phẩm ({selectedOrder.items.length})
            </h4>
            <div className="divide-y divide-gray-100 rounded-2xl border border-gray-200 overflow-hidden mb-6">
              {selectedOrder.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-white">
                  <div className="size-12 rounded-xl bg-[#e8f7ff] p-1 shrink-0 overflow-hidden border border-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.colorImage || "/sites/raycon/images/E25_BLA_IMG1.png"}
                      alt=""
                      className="size-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-navy truncate">
                      {item.productName}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      Màu: <strong className="text-navy">{item.colorName}</strong> × {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-royal">
                      {formatUsd(item.totalPrice)}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {formatUsd(item.unitPrice)}/cái
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="border-t border-gray-100 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính (Subtotal):</span>
                <span>{formatUsd(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển:</span>
                <span>
                  {selectedOrder.shippingFee === 0
                    ? "MIỄN PHÍ"
                    : formatUsd(selectedOrder.shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-navy pt-2 border-t border-gray-100">
                <span>Tổng thanh toán:</span>
                <span className="text-royal text-base">
                  {formatUsd(selectedOrder.totalAmount)}
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-xl bg-navy px-5 py-2.5 text-xs font-bold text-white hover:bg-navy/90"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
