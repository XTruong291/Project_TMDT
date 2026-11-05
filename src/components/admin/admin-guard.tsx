"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/use-auth-store";
import { getProfile } from "@/lib/api";
import { Loader2 } from "lucide-react";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const setAuth = useAuthStore((state) => state.setAuth);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;

    async function checkAdmin() {
      if (!hasHydrated) return;

      if (!token) {
        if (active) router.replace("/admin/login");
        return;
      }

      // If user is already loaded as admin, allow immediately
      if (user && user.role === "admin") {
        if (active) setChecking(false);
        return;
      }

      // If user in localStorage does not show role admin yet, verify directly with MySQL /auth/me
      try {
        const fresh = await getProfile(token);
        if (fresh.role === "admin") {
          setAuth(fresh, token);
          if (active) setChecking(false);
        } else {
          if (active) router.replace("/admin/login");
        }
      } catch {
        if (active) router.replace("/admin/login");
      }
    }

    checkAdmin();

    return () => {
      active = false;
    };
  }, [hasHydrated, token, user, router, setAuth]);

  // Prevent flash of unauthorized content and hydration mismatch
  if (!hasHydrated || checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-purple-600" />
          <p className="text-sm font-medium text-gray-500">
            Đang xác thực quyền Quản trị viên...
          </p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-purple-600" />
          <p className="text-sm font-medium text-gray-500">
            Đang chuyển hướng về trang đăng nhập...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

