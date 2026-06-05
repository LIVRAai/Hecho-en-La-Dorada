"use client";

import { usePathname } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    return <div className="min-h-screen bg-slate-950 text-white">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <AdminSidebar />
      <div className="min-h-screen lg:pl-72">
        <AdminHeader />
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
