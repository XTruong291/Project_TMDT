"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Package,
  ShoppingBag,
  Users,
  ArrowLeft,
  LogOut,
  Shield,
  Layers,
} from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";
import { AdminGuard } from "@/components/admin/admin-guard";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    label: "Quản lý Sản phẩm",
    href: "/admin/products",
    icon: Package,
  },
  {
    label: "Quản lý Đơn hàng",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    label: "Quản lý Người dùng",
    href: "/admin/users",
    icon: Users,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  // Do not wrap login page with AdminGuard
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  function handleLogout() {
    logout();
    router.push("/admin/login");
  }

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-[#f8fafc]">
        {/* Sidebar */}
        <aside className="sticky top-0 h-screen w-64 shrink-0 border-r border-gray-200 bg-white flex flex-col justify-between">
          <div>
            {/* Logo */}
            <div className="flex h-16 items-center gap-2.5 border-b border-gray-100 px-6">
              <div className="flex size-8 items-center justify-center rounded-lg bg-navy text-white font-bold text-sm">
                <Layers className="size-4" />
              </div>
              <div>
                <span className="font-extrabold text-navy tracking-tight text-base block leading-tight">
                  RAYCON ADMIN
                </span>
                <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider block">
                  Store Control Center
                </span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-1.5">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all",
                      isActive
                        ? "bg-navy text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-100 hover:text-navy",
                    )}
                  >
                    <Icon className={cn("size-4", isActive ? "text-white" : "text-gray-400")} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom Actions */}
          <div className="border-t border-gray-100 p-4 space-y-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2 text-xs font-bold text-navy hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              <span>Xem Cửa hàng (Storefront)</span>
            </Link>

            <div className="flex items-center justify-between rounded-xl bg-purple-50/60 p-3 border border-purple-100">
              <div className="overflow-hidden">
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
                  <Shield className="size-3.5 text-purple-600 shrink-0" />
                  <span className="truncate">{user?.fullName || "Administrator"}</span>
                </div>
                <p className="text-[11px] text-purple-700/70 truncate mt-0.5">
                  {user?.email}
                </p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                aria-label="Logout"
                title="Đăng xuất"
                className="flex size-8 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-white hover:text-red-600 transition-colors"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </AdminGuard>
  );
}

