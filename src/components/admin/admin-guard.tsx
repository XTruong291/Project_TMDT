"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/use-auth-store";
import { Loader2 } from "lucide-react";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    // Only check auth AFTER Zustand has completed rehydration from localStorage
    if (hasHydrated) {
      if (!user || user.role !== "admin") {
        router.replace("/admin/login");
      }
    }
  }, [hasHydrated, user, router]);

  // Prevent flash of unauthorized content and hydration mismatch
  if (!hasHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-royal" />
          <p className="text-sm font-medium text-gray-500">
            Đang khởi động phiên làm việc...
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
            Đang xác thực quyền Admin...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

