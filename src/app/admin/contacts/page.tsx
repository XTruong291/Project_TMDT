"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Inbox,
  Mail,
  Phone,
  MapPin,
  Trash2,
  Eye,
  X,
  Loader2,
  Search,
} from "lucide-react";
import {
  adminGetContacts,
  adminUpdateContactStatus,
  adminDeleteContact,
} from "@/lib/api";
import { useAuthStore } from "@/store/use-auth-store";
import type { Contact } from "@/types/contact";

const STATUS_LABELS: Record<string, { label: string; badgeClass: string }> = {
  unread: {
    label: "Chưa đọc",
    badgeClass: "bg-red-50 text-red-700 border-red-200",
  },
  read: {
    label: "Đã đọc",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
  },
  responded: {
    label: "Đã phản hồi",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
};

export default function AdminContactsPage() {
  const token = useAuthStore((state) => state.token);

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  // View modal state
  const [viewingContact, setViewingContact] = useState<Contact | null>(null);

  // Delete state
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadContacts = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await adminGetContacts(token, statusFilter);
      setContacts(data);
    } catch (err) {
      console.error("Failed to load contacts:", err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, token]);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const filteredContacts = contacts.filter((c) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      c.fullName.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone && c.phone.includes(q)) ||
      (c.subject && c.subject.toLowerCase().includes(q)) ||
      (c.address && c.address.toLowerCase().includes(q))
    );
  });

  async function handleStatusChange(id: number, newStatus: string) {
    if (!token) return;
    try {
      const updated = await adminUpdateContactStatus(id, newStatus, token);
      setContacts((prev) => prev.map((c) => (c.id === id ? updated : c)));
      if (viewingContact && viewingContact.id === id) {
        setViewingContact(updated);
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  }

  async function handleDelete() {
    if (!deleteId || !token) return;
    setDeleting(true);
    try {
      await adminDeleteContact(deleteId, token);
      setDeleteId(null);
      await loadContacts();
    } catch (err) {
      console.error("Failed to delete contact:", err);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy tracking-tight">
            Quản lý Hộp Thư Liên Hệ
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Tổng cộng: <strong className="text-royal font-bold">{contacts.length}</strong> thư liên hệ gửi từ khách hàng ngoài Storefront
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
            placeholder="Tìm theo họ tên, email, điện thoại, địa chỉ hoặc chủ đề..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2 pl-10 pr-4 text-xs text-navy outline-none focus:border-navy focus:bg-white transition-all"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2 text-xs font-semibold text-navy outline-none focus:border-navy cursor-pointer"
        >
          <option value="all">Tất cả Trạng thái</option>
          <option value="unread">Chưa đọc</option>
          <option value="read">Đã đọc</option>
          <option value="responded">Đã phản hồi</option>
        </select>
      </div>

      {/* Contacts Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="size-8 animate-spin text-royal" />
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Inbox className="size-12 text-gray-300 mb-3" />
            <p className="text-sm font-bold text-navy">Hộp thư liên hệ trống</p>
            <p className="text-xs text-gray-400 mt-1">
              Chưa có tin nhắn liên hệ nào khớp với điều kiện tìm kiếm.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/75 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  <th className="py-3 px-4">Khách hàng</th>
                  <th className="py-3 px-4">Địa chỉ cư trú</th>
                  <th className="py-3 px-4">Chủ đề & Nội dung</th>
                  <th className="py-3 px-4">Ngày gửi</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs font-medium text-navy">
                {filteredContacts.map((ct) => {
                  const statusInfo = STATUS_LABELS[ct.status] || {
                    label: ct.status,
                    badgeClass: "bg-gray-100 text-gray-700 border-gray-200",
                  };
                  const formattedDate = new Date(ct.createdAt).toLocaleDateString(
                    "vi-VN",
                    {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  );

                  return (
                    <tr
                      key={ct.id}
                      className={`hover:bg-gray-50/50 transition-colors ${
                        ct.status === "unread" ? "bg-amber-50/20 font-semibold" : ""
                      }`}
                    >
                      {/* Customer Info */}
                      <td className="py-3 px-4">
                        <p className="font-bold text-navy">{ct.fullName}</p>
                        <div className="space-y-0.5 mt-1 text-[11px] text-gray-500">
                          <p className="flex items-center gap-1">
                            <Mail className="size-3 text-gray-400" />
                            <span>{ct.email}</span>
                          </p>
                          {ct.phone && (
                            <p className="flex items-center gap-1">
                              <Phone className="size-3 text-gray-400" />
                              <span>{ct.phone}</span>
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Address */}
                      <td className="py-3 px-4 max-w-xs">
                        {ct.address ? (
                          <div className="flex items-start gap-1 text-[11px] text-gray-600">
                            <MapPin className="size-3 text-royal shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{ct.address}</span>
                          </div>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>

                      {/* Subject & Message snippet */}
                      <td className="py-3 px-4 max-w-sm">
                        <p className="font-bold text-navy truncate">
                          {ct.subject || "Thư liên hệ"}
                        </p>
                        <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">
                          {ct.message}
                        </p>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 text-gray-500 text-[11px] whitespace-nowrap">
                        {formattedDate}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <select
                          value={ct.status}
                          onChange={(e) =>
                            handleStatusChange(ct.id, e.target.value)
                          }
                          className={`rounded-lg border px-2 py-1 text-[10px] font-bold outline-none cursor-pointer ${statusInfo.badgeClass}`}
                        >
                          <option value="unread">Chưa đọc</option>
                          <option value="read">Đã đọc</option>
                          <option value="responded">Đã phản hồi</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setViewingContact(ct);
                              if (ct.status === "unread") {
                                handleStatusChange(ct.id, "read");
                              }
                            }}
                            title="Xem chi tiết thư"
                            className="flex size-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-navy transition-colors cursor-pointer"
                          >
                            <Eye className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteId(ct.id)}
                            title="Xóa thư liên hệ"
                            className="flex size-8 items-center justify-center rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Contact Detail Modal */}
      {viewingContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-gray-100 p-6 md:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-navy">
                  Chi Tiết Thư Liên Hệ #{viewingContact.id}
                </h3>
                <span className="text-[11px] text-gray-400">
                  {new Date(viewingContact.createdAt).toLocaleString("vi-VN")}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setViewingContact(null)}
                className="flex size-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-navy cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                <div>
                  <span className="text-gray-400 font-semibold block text-[10px] uppercase">
                    Họ và tên
                  </span>
                  <p className="font-bold text-navy text-sm mt-0.5">
                    {viewingContact.fullName}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400 font-semibold block text-[10px] uppercase">
                    Số điện thoại
                  </span>
                  <p className="font-bold text-navy mt-0.5">
                    {viewingContact.phone || "Chưa cung cấp"}
                  </p>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-400 font-semibold block text-[10px] uppercase">
                    Địa chỉ Email
                  </span>
                  <p className="font-bold text-royal mt-0.5">
                    {viewingContact.email}
                  </p>
                </div>
                {viewingContact.address && (
                  <div className="col-span-2">
                    <span className="text-gray-400 font-semibold block text-[10px] uppercase">
                      Địa chỉ cư trú
                    </span>
                    <p className="font-medium text-navy mt-0.5">
                      {viewingContact.address}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <span className="text-gray-400 font-bold block text-[10px] uppercase mb-1">
                  Chủ đề thư
                </span>
                <p className="font-bold text-navy text-sm">
                  {viewingContact.subject || "Thư liên hệ"}
                </p>
              </div>

              <div>
                <span className="text-gray-400 font-bold block text-[10px] uppercase mb-1">
                  Nội dung tin nhắn
                </span>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-navy/90 leading-relaxed whitespace-pre-line text-xs">
                  {viewingContact.message}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-semibold text-gray-500">
                  Cập nhật trạng thái:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleStatusChange(viewingContact.id, "read")
                    }
                    className={`px-3 py-1 text-[11px] font-bold rounded-lg border transition ${
                      viewingContact.status === "read"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    Đã đọc
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleStatusChange(viewingContact.id, "responded")
                    }
                    className={`px-3 py-1 text-[11px] font-bold rounded-lg border transition ${
                      viewingContact.status === "responded"
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    Đã phản hồi
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <a
                href={`mailto:${viewingContact.email}?subject=Phản hồi từ RYVO: ${encodeURIComponent(viewingContact.subject || "Thư liên hệ")}`}
                className="inline-flex items-center gap-2 rounded-xl bg-navy px-5 py-2.5 text-xs font-bold text-white hover:bg-navy/90 transition"
              >
                <Mail className="size-3.5" />
                <span>Gửi Email Phản Hồi Trực Tiếp</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-gray-100 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
              <Trash2 className="size-6" />
            </div>
            <h3 className="text-base font-bold text-navy">
              Xác nhận xóa thư liên hệ?
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Thư liên hệ này sẽ bị xóa vĩnh viễn khỏi cơ sở dữ liệu.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 cursor-pointer disabled:opacity-50"
              >
                {deleting ? "Đang xóa..." : "Xóa Thư"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

