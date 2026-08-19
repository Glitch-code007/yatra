import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { supabase, supabaseResponse } = await updateSession(request);

  // If Supabase is not configured yet, allow local browsing
  if (!supabase) {
    return supabaseResponse;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAppRoute = request.nextUrl.pathname.startsWith("/app");
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isAuthRoute =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register");

  // Redirect authenticated users away from auth routes
  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL("/app/dashboard", request.url));
  }

  // Protect /app routes
  if (isAppRoute && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Protect /admin routes
  if (isAdminRoute && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAdminRoute && user && user.email !== "admin@yatra.com") {
    return NextResponse.redirect(new URL("/app/dashboard", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
