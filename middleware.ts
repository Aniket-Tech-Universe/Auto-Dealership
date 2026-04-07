import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, decodeSession } from "@/lib/session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.includes(".") ||
    pathname === "/login" ||
    pathname === "/unauthorized"
  ) {
    return NextResponse.next();
  }

  const session = decodeSession(request.cookies.get(AUTH_COOKIE_NAME)?.value);

  const protectedPath =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/sales") ||
    pathname.startsWith("/vehicles") ||
    pathname.startsWith("/enquiries");

  if (protectedPath && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/admin") && session?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (pathname.startsWith("/sales") && session?.role !== "SALES") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
};
