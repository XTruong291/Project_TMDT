"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Users,
  Search,
  Plus,
  Shield,
  User as UserIcon,
  X,
  Edit2,
  Trash2,
  Lock,
  Mail,
  Phone,
  Loader2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import {
  adminGetUsers,
  adminCreateUser,
  adminUpdateUser,
  adminToggleUserStatus,
  adminDeleteUser,
} from "@/lib/api";
import { useAuthStore } from "@/store/use-auth-store";
import type { User, UserRole } from "@/types/auth";

export default function AdminUsersPage() {
  const currentAdmin = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal Create / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form Data
  const [formData, setFormData] = useState<{
    email: string;
    fullName: string;
    phone: string;
    role: UserRole;
    password: string;
    isActive: boolean;
  }>({
    email: "",
    fullName: "",
    phone: "",
    role: "customer",
    password: "",
    isActive: true,
  });

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Toggle status loading
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const loadUsers = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await adminGetUsers(undefined, token);
      setUsers(data);
    } catch (err: unknown) {
      console.error("Failed to fetch users:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Không thể tải danh sách người dùng.");
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.fullName.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        (u.phone && u.phone.includes(search));
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && u.isActive) ||
        (statusFilter === "inactive" && !u.isActive);
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  function handleOpenCreate() {
    setEditingUser(null);
    setFormData({
      email: "",
      fullName: "",
      phone: "",
      role: "customer",
      password: "",
      isActive: true,
    });
    setFormError(null);
    setIsModalOpen(true);
  }

  function handleOpenEdit(user: User) {
    setEditingUser(user);
    setFormData({
      email: user.email,
      fullName: user.fullName,
      phone: user.phone || "",
      role: user.role,
      password: "", // Leave blank if not changing
      isActive: user.isActive,
    });
    setFormError(null);
    setIsModalOpen(true);
  }

  async function handleSubmitForm(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;

    if (!formData.email.trim() || !formData.fullName.trim()) {
      setFormError("Vui lòng điền đầy đủ Họ tên và Email.");
      return;
    }

    if (!editingUser && !formData.password.trim()) {
      setFormError("Vui lòng nhập mật khẩu khi tạo người dùng mới.");
      return;
    }

    setSaving(true);
    setFormError(null);

    try {
      if (editingUser) {
        const updatePayload: {
          email: string;
          fullName: string;
          phone?: string;
          role: string;
          isActive: boolean;
          password?: string;
        } = {
          email: formData.email.trim(),
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim() || undefined,
          role: formData.role,
          isActive: formData.isActive,
        };
        if (formData.password.trim()) {
          updatePayload.password = formData.password.trim();
        }
        await adminUpdateUser(editingUser.id, updatePayload, token);
      } else {
        await adminCreateUser(
          {
            email: formData.email.trim(),
            password: formData.password.trim(),
            fullName: formData.fullName.trim(),
            phone: formData.phone.trim() || undefined,
            role: formData.role,
            isActive: formData.isActive,
          },
          token,
        );
      }
      setIsModalOpen(false);
      await loadUsers();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError("Không thể lưu thông tin người dùng.");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleStatus(user: User) {
    if (!token) return;
    if (user.id === currentAdmin?.id && user.isActive) {
      alert("Bạn không thể khóa chính tài khoản Admin đang đăng nhập!");
      return;
    }

    setTogglingId(user.id);
    try {
      const updated = await adminToggleUserStatus(user.id, !user.isActive, token);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, isActive: updated.isActive } : u)),
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      }
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDeleteUser() {
    if (!deleteTarget || !token) return;
    setDeleting(true);
    try {
      await adminDeleteUser(deleteTarget.id, token);
      setDeleteTarget(null);
      await loadUsers();
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      }
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
            Quản lý Người dùng
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Tổng cộng: <strong className="text-royal font-bold">{users.length}</strong> tài khoản trong cơ sở dữ liệu MySQL
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-navy/90 transition-all cursor-pointer"
        >
          <Plus className="size-4" />
          <span>Thêm Người dùng Mới</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên, email, số điện thoại..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2 pl-10 pr-4 text-xs text-navy outline-none focus:border-navy focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-xs font-semibold text-navy outline-none focus:border-navy cursor-pointer"
          >
            <option value="all">Tất cả Vai trò</option>
            <option value="admin">Quản trị viên (Admin)</option>
            <option value="customer">Khách hàng (Customer)</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-xs font-semibold text-navy outline-none focus:border-navy cursor-pointer"
          >
            <option value="all">Tất cả Trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Đã khóa</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 flex items-center justify-between gap-3 text-xs text-red-700">
          <div>
            <strong>Lỗi kết nối:</strong> {error}
          </div>
          <button
            type="button"
            onClick={loadUsers}
            className="rounded-lg bg-red-600 px-3 py-1.5 font-bold text-white hover:bg-red-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Users Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="size-8 animate-spin text-royal" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Users className="size-12 text-gray-300 mb-3" />
            <p className="text-sm font-bold text-navy">Không tìm thấy người dùng nào</p>
            <p className="text-xs text-gray-400 mt-1">Hãy thử tìm từ khóa khác hoặc tạo tài khoản mới.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/75 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  <th className="py-3 px-4">Người dùng</th>
                  <th className="py-3 px-4">Số điện thoại</th>
                  <th className="py-3 px-4">Vai trò</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4">Ngày đăng ký</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs font-medium text-navy">
                {filteredUsers.map((user) => {
                  const isAdmin = user.role === "admin";
                  const isCurrent = user.id === currentAdmin?.id;
                  return (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                      {/* User Info */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`size-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            isAdmin ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-royal"
                          }`}>
                            {user.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="font-bold text-navy truncate">{user.fullName}</p>
                              {isCurrent && (
                                <span className="rounded bg-gray-200 px-1 py-0.2 text-[9px] font-extrabold text-gray-700">
                                  BẠN
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-gray-400 truncate flex items-center gap-1">
                              <Mail className="size-3" />
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-3 px-4 text-gray-600">
                        {user.phone ? (
                          <span className="flex items-center gap-1">
                            <Phone className="size-3 text-gray-400" />
                            {user.phone}
                          </span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>

                      {/* Role Badge */}
                      <td className="py-3 px-4">
                        {isAdmin ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 border border-purple-200 px-2.5 py-0.5 text-[10px] font-bold text-purple-700">
                            <Shield className="size-3 text-purple-600" />
                            Admin Quản trị
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[10px] font-bold text-royal">
                            <UserIcon className="size-3 text-royal" />
                            Khách hàng
                          </span>
                        )}
                      </td>

                      {/* Status Toggle */}
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(user)}
                          disabled={togglingId === user.id || isCurrent}
                          title={isCurrent ? "Không thể tự khóa tài khoản của bạn" : "Bấm để đổi trạng thái"}
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold transition-all ${
                            user.isActive
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                              : "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                          } ${isCurrent ? "cursor-not-allowed opacity-75" : "cursor-pointer"}`}
                        >
                          {togglingId === user.id ? (
                            <Loader2 className="size-3 animate-spin" />
                          ) : user.isActive ? (
                            <>
                              <ToggleRight className="size-3.5 text-emerald-600" />
                              <span>Hoạt động</span>
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="size-3.5 text-red-500" />
                              <span>Đã khóa</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Created Date */}
                      <td className="py-3 px-4 text-gray-500 text-[11px]">
                        {new Date(user.createdAt).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(user)}
                            title="Chỉnh sửa thông tin"
                            className="flex size-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-navy transition-colors cursor-pointer"
                          >
                            <Edit2 className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(user)}
                            disabled={isCurrent}
                            title={isCurrent ? "Không thể xóa chính tài khoản của bạn" : "Xóa tài khoản"}
                            className={`flex size-8 items-center justify-center rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors ${
                              isCurrent ? "opacity-30 cursor-not-allowed" : "cursor-pointer"
                            }`}
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

      {/* Modal Create & Edit User */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-gray-100 p-6 md:p-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-navy">
                  {editingUser ? "Chỉnh sửa Người dùng" : "Thêm Người dùng Mới"}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Quản lý thông tin tài khoản và quyền hạn trong hệ thống
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex size-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-navy"
              >
                <X className="size-4" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-600 flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitForm} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  placeholder="Nguyễn Văn A"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 px-3.5 text-xs text-navy outline-none focus:border-navy focus:bg-white"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1">
                  Địa chỉ Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="user@raycon.local"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 px-3.5 text-xs text-navy outline-none focus:border-navy focus:bg-white"
                />
              </div>

              {/* Phone & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="0912345678"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 px-3.5 text-xs text-navy outline-none focus:border-navy focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1">
                    Vai trò (Role)
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value as UserRole })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 px-3.5 text-xs text-navy outline-none focus:border-navy cursor-pointer"
                  >
                    <option value="customer">Khách hàng (Customer)</option>
                    <option value="admin">Quản trị viên (Admin)</option>
                  </select>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1">
                  {editingUser
                    ? "Đổi mật khẩu mới (Để trống nếu không đổi)"
                    : "Mật khẩu *"}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  <input
                    type="password"
                    required={!editingUser}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder={editingUser ? "•••••••• (Giữ nguyên)" : "Tối thiểu 6 ký tự"}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-4 text-xs text-navy outline-none focus:border-navy focus:bg-white"
                  />
                </div>
              </div>

              {/* Active status */}
              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-navy">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="size-4 rounded text-navy focus:ring-navy cursor-pointer"
                  />
                  <span>Tài khoản kích hoạt (Được phép đăng nhập)</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-gray-200 px-5 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-navy px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-navy/90 transition-all disabled:opacity-50"
                >
                  {saving ? "Đang lưu..." : editingUser ? "Cập nhật Người dùng" : "Tạo Người dùng"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-gray-100 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 mb-4">
              <Trash2 className="size-6" />
            </div>
            <h3 className="text-lg font-bold text-navy">Xác nhận Xóa Người dùng</h3>
            <p className="mt-1 text-xs text-gray-500">
              Bạn có chắc chắn muốn xóa tài khoản <strong className="text-navy">{deleteTarget.fullName}</strong> ({deleteTarget.email})? Hành động này sẽ xóa người dùng khỏi hệ thống.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={deleting}
                className="rounded-xl bg-red-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Đang xóa..." : "Xác nhận Xóa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
