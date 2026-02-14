import { NextRequest, NextResponse } from "next/server";
import { getAuthToken, verifyToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Public routes that don't need authentication
  const publicRoutes = ["/auth/login", "/auth/register", "/"];

  // Check if route is public
  if (publicRoutes.some((route) => pathname === route)) {
    return NextResponse.next();
  }

  // Get auth token from cookie
  const token = await getAuthToken();

  // If no token and trying to access protected route, redirect to login
  if (!token) {
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin") || pathname.startsWith("/agent")) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    return NextResponse.next();
  }

  // Verify token
  const payload = await verifyToken(token);

  if (!payload) {
    // Token is invalid, redirect to login
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin") || pathname.startsWith("/agent")) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    return NextResponse.next();
  }

  // Role-based route protection
  if (pathname.startsWith("/admin")) {
    if (payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  if (pathname.startsWith("/agent")) {
    if (payload.role !== "ADMIN" && payload.role !== "AGENT") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/agent/:path*",
    "/auth/:path*",
  ],
};