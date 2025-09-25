import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const supabase = createRouteHandlerClient({ cookies });

  let email: string | null = null;
  let password: string | null = null;

  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const body = await request.json().catch(() => ({}));
    email = body?.email ?? null;
    password = body?.password ?? null;
  } else {
    const formData = await request.formData();
    email = (formData.get("email") as string) ?? null;
    password = (formData.get("password") as string) ?? null;
  }

  if (!email || !password) {
    return NextResponse.json({ error: "Email i hasło są wymagane" }, { status: 400 });
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${url.origin}/auth/callback` },
  });

  if (error) {
    return NextResponse.redirect(new URL(`/auth/login?error=${encodeURIComponent(error.message)}`, url), { status: 302 });
  }

  return NextResponse.redirect(new URL(`/auth/login?info=${encodeURIComponent("Sprawdź email, aby potwierdzić konto")}`, url), { status: 302 });
}
