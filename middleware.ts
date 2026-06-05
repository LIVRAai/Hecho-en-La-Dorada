import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/admin") || pathname === "/admin/login") return NextResponse.next();

  const token = request.cookies.get("sb-access-token")?.value;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!token || !url || !key) return redirectToLogin(request);

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return redirectToLogin(request);
  return NextResponse.next();
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.searchParams.set("redirectedFrom", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = { matcher: ["/admin/:path*"] };
