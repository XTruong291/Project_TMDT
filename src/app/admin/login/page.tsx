"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Lock, Mail, ArrowLeft } from "lucide-react";
import { loginUser } from "@/lib/api";
import { useAuthStore } from "@/store/use-auth-store";

export default function AdminLoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const finalEmail = email.trim().toLowerCase();
    const finalPassword = password;

    if (!finalEmail || !finalPassword) {
      setError("Vui lòng nhập đầy đủ Email và Mật khẩu Quản trị");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await loginUser(finalEmail, finalPassword);
      if (res.user.role !== "admin") {
        setError("Tài khoản của bạn không có quyền Quản trị viên (Admin).");
        return;
      }
      setAuth(res.user, res.accessToken);
      router.push("/admin/products");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Đăng nhập thất bại. Email hoặc mật khẩu không chính xác.");
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

