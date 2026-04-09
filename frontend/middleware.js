import { NextResponse } from "next/server";

// Simple JWT decode without cryptographic verification (for role extraction only)
function decodeJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    // Use atob for base64 decoding (available in Edge Functions)
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch {
    return null;
  }
}

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

  // Decode JWT to check role
  const decoded = decodeJWT(token);
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
}

export const config = {
  matcher: ["/:path*"],
};