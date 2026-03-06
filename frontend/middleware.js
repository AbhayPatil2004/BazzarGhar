import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Skip static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.match(/\.(jpg|jpeg|png|webp|avif|svg|gif)$/)
  ) {
    return NextResponse.next();
  }

  const exactPublicPaths = [
    "/",
    "/auth/login",
    "/auth/signup",
    "/auth/forgotpassword",
    "/verifyemail",
    "/store",
    "/store/create",
    "/product",
    "/auth/verifyforgotpassword",
  ];

  const dynamicPublicPaths = [
    "/store/",
    "/product/",
  ];

  // check dynamic routes
  const isDynamicPublic = dynamicPublicPaths.some((path) =>
    pathname.startsWith(path)
  );

  // allow public routes
  if (exactPublicPaths.includes(pathname) || isDynamicPublic) {
    return NextResponse.next();
  }

  // check token
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/auth/signup", req.url));
  }

  try {
    const decoded = jwt.decode(token);
    const role = decoded?.role;

    // seller protection
    if (pathname.startsWith("/seller/dashboard") && role !== "seller") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // admin protection
    if (pathname.startsWith("/admin/dashboard") && role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
}

export const config = {
  matcher: ["/:path*"],
};