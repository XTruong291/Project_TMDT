"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Lock, Mail, ArrowLeft, Sparkles, User as UserIcon } from "lucide-react";
import { loginUser } from "@/lib/api";
import { useAuthStore } from "@/store/use-auth-store";

export default function AdminLoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState("admin@raycon.local");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(targetEmail?: string, targetPassword?: string) {
    const finalEmail = targetEmail || email;
    const finalPassword = targetPassword || password;

    if (!finalEmail || !finalPassword) {
      setError("Vui lòng nhập Email và Mật khẩu");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await loginUser(finalEmail, finalPassword);
      setAuth(res.user, res.accessToken);
      if (res.user.role === "admin") {
        router.push("/admin/products");
      } else {
        setError("Tài khoản của bạn không có quyền Quản trị viên (Admin).");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Đăng nhập thất bại. Kiểm tra lại thông tin.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] p-4">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-700 mb-3 shadow-inner">
            <Shield className="size-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-navy">
            Raycon Admin Portal
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Hệ thống quản lý sản phẩm và đơn hàng E-commerce
          </p>
        </div>

        {/* Quick Demo Login Preset Buttons */}
        <div className="mb-6 rounded-2xl border border-purple-100 bg-purple-50/50 p-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900 mb-2">
            <Sparkles className="size-3.5 text-orange" />
            <span>NÚT ĐĂNG NHẬP NHANH (DEMO)</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setEmail("admin@raycon.local");
                setPassword("admin123");
                handleLogin("admin@raycon.local", "admin123");
              }}
              disabled={loading}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-purple-300 bg-white py-2.5 px-3 text-xs font-bold text-purple-800 shadow-sm hover:bg-purple-100/50 transition-colors"
            >
              <Shield className="size-3.5 text-purple-700" />
              Admin Demo
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail("user@raycon.local");
                setPassword("user123");
                handleLogin("user@raycon.local", "user123");
              }}
              disabled={loading}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white py-2.5 px-3 text-xs font-bold text-gray-600 shadow-sm hover:bg-gray-50 transition-colors"
            >
              <UserIcon className="size-3.5 text-gray-500" />
              Customer Demo
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-600 animate-in fade-in">
            {error}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1.5">
              Email Quản trị
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-4 text-sm text-navy outline-none focus:border-navy focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1.5">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-4 text-sm text-navy outline-none focus:border-navy focus:bg-white transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-navy py-3 text-sm font-bold text-white shadow-md hover:bg-navy/90 transition-all disabled:opacity-50"
          >
            {loading ? "Đang xác thực..." : "Đăng nhập Quản trị viên"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-navy transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>Trở về Trang chủ Cửa hàng</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

