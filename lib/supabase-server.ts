import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Missing Supabase environment variables");
  const cookieStore = await cookies();
  const token = cookieStore.get("sb-access-token")?.value;
  return createClient(url, key, {
    global: token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
    auth: { persistSession: false }
  });
}
