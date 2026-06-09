import { NextResponse, type NextRequest } from "next/server";

const allowedRoles = new Set(["Administrador", "Editor"]);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/admin") || pathname === "/admin/login") return NextResponse.next();

  const token = request.cookies.get("sb-access-token")?.value;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return redirectToLogin(request, "config");
  if (!token) return redirectToLogin(request, "session");

  const user = await getSupabaseUser({ url, key, token });
  if (!user?.id) return redirectToLogin(request, "session");

  const role = await getUserRole({ url, key, token, userId: user.id });
  if (!allowedRoles.has(role ?? "")) return redirectToLogin(request, "role");

  return NextResponse.next();
}

async function getSupabaseUser({ url, key, token }: { url: string; key: string; token: string }) {
  try {
    const response = await fetch(`${url}/auth/v1/user`, {
      headers: { apikey: key, Authorization: `Bearer ${token}` },
      cache: "no-store"
    });
    if (!response.ok) return null;
    return await response.json() as { id?: string };
  } catch {
    return null;
  }
}

async function getUserRole({ url, key, token, userId }: { url: string; key: string; token: string; userId: string }) {
  try {
    const response = await fetch(`${url}/rest/v1/profiles?select=role&id=eq.${encodeURIComponent(userId)}&limit=1`, {
      headers: { apikey: key, Authorization: `Bearer ${token}` },
      cache: "no-store"
    });
    if (!response.ok) return null;
    const rows = await response.json() as Array<{ role?: string }>;
    return rows[0]?.role ?? null;
  } catch {
    return null;
  }
}

function redirectToLogin(request: NextRequest, reason: "config" | "session" | "role" = "session") {
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.searchParams.set("redirectedFrom", request.nextUrl.pathname);
  loginUrl.searchParams.set("reason", reason);
  return NextResponse.redirect(loginUrl);
}

export const config = { matcher: ["/admin/:path*"] };
