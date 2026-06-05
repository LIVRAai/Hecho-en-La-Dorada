import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

function AdminLoginFallback() {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/10 px-6 py-4 text-sm font-bold text-white shadow-2xl backdrop-blur">
      Cargando acceso privado...
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_left,rgba(214,162,58,0.35),transparent_28rem),linear-gradient(135deg,#020617,#0f172a)] px-4 py-12">
      <Suspense fallback={<AdminLoginFallback />}>
        <AdminLoginForm />
      </Suspense>
    </main>
  );
}
