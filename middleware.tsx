import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const path = req.nextUrl.pathname;
    const isProtected =
        path.startsWith("/projekty") || path.startsWith("/uzytkownicy");

    if (isProtected && !user) {
        const url = req.nextUrl.clone();
        url.pathname = "/konto/logowanie";
        url.searchParams.set("redirectTo", req.nextUrl.pathname + req.nextUrl.search);
        return NextResponse.redirect(url);
    }

    return res;
}

export const config = {
    matcher: ["/projekty/:path*", "/uzytkownicy/:path*"],
};
