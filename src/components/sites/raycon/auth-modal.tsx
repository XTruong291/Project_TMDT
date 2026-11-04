"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, User as UserIcon, X, Shield, Sparkles } from "lucide-react";
import { loginUser, registerUser } from "@/lib/api";
import { useAuthStore } from "@/store/use-auth-store";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: "admin" | "customer";
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleLogin(targetEmail?: string, targetPassword?: string) {
    const finalEmail = targetEmail || email;
    const finalPassword = targetPassword || password;

    if (!finalEmail || !finalPassword) {
      setError("Vui lòng điền đầy đủ Email và Mật khẩu.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await loginUser(finalEmail, finalPassword);
      setAuth(res.user, res.accessToken);
      onClose();
      if (res.user.role === "admin") {
        router.push("/admin/products");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password || !fullName) {
      setError("Vui lòng điền đầy đủ các thông tin bắt buộc.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await registerUser(email, password, fullName, phone || undefined);
      // Auto login after register
      const res = await loginUser(email, password);
      setAuth(res.user, res.accessToken);
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Đăng ký tài khoản thất bại.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-navy text-white text-xs font-bold">
              RC
            </span>
            <h3 className="font-bold text-navy text-lg">
              {mode === "login" ? "Đăng nhập Raycon" : "Tạo tài khoản mới"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-navy transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Quick Demo Login Preset Buttons */}
          <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50/60 p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-royal mb-2">
              <Sparkles className="size-3.5 text-orange" />
              <span>ĐĂNG NHẬP NHANH (DEMO & TEST)</span>
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
                className="flex items-center justify-center gap-1.5 rounded-lg border border-purple-200 bg-white py-2 px-3 text-xs font-bold text-purple-700 shadow-sm hover:bg-purple-50 transition-colors"
              >
                <Shield className="size-3.5 text-purple-600" />
                Admin (Quản trị)
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail("user@raycon.local");
                  setPassword("user123");
                  handleLogin("user@raycon.local", "user123");
                }}
                disabled={loading}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-white py-2 px-3 text-xs font-bold text-royal shadow-sm hover:bg-blue-50 transition-colors"
              >
                <UserIcon className="size-3.5 text-royal" />
                Khách hàng
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-xs font-medium text-red-600 animate-in fade-in">
              {error}
            </div>
          )}

          {mode === "login" ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@raycon.local"
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
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-4 text-sm text-navy outline-none focus:border-navy focus:bg-white transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-navy py-3 text-sm font-bold text-white shadow-md hover:bg-navy/90 transition-all disabled:opacity-50"
              >
                {loading ? "Đang xác thực..." : "Đăng nhập"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1">
                  Họ và tên
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Xuân Trường"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2 px-3 text-sm text-navy outline-none focus:border-navy focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2 px-3 text-sm text-navy outline-none focus:border-navy focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1">
                  Số điện thoại (tùy chọn)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0912345678"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2 px-3 text-sm text-navy outline-none focus:border-navy focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2 px-3 text-sm text-navy outline-none focus:border-navy focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-royal py-3 text-sm font-bold text-white shadow-md hover:bg-royal/90 transition-all disabled:opacity-50"
              >
                {loading ? "Đang tạo tài khoản..." : "Đăng ký ngay"}
              </button>
            </form>
          )}

          {/* Toggle Login / Register */}
          <div className="mt-5 text-center text-xs text-gray-500">
            {mode === "login" ? (
              <p>
                Chưa có tài khoản?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setError(null);
                  }}
                  className="font-bold text-royal hover:underline"
                >
                  Đăng ký ngay
                </button>
              </p>
            ) : (
              <p>
                Đã có tài khoản?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError(null);
                  }}
                  className="font-bold text-navy hover:underline"
                >
                  Đăng nhập
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

