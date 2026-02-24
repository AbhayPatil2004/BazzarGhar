// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

// export function middleware(req) {
//   const { pathname } = req.nextUrl;

//   // ✅ Exact public routes
//   const exactPublicPaths = [
//     "/",
//     "/auth/login",
//     "/auth/signup",
//     "/auth/forgotpassword",
//     "/verifyforgotpassword",
//     "/verifyemail",
//     "/store",
//     "/product",
    
    
//   ];

//   // ✅ Prefix-based public routes
//   const prefixPublicPaths = [
//     "/products",
//     "/stores",
//     "/sell-on-aurastore",
//   ];

//   if (
//     exactPublicPaths.includes(pathname) ||
//     prefixPublicPaths.some((path) => pathname.startsWith(path))
//   ) {
//     return NextResponse.next();
//   }

//   const token = req.cookies.get("token")?.value;

//   // 🔒 Protected routes need token
//   if (!token) {
//     return NextResponse.redirect(new URL("/auth/login", req.url));
//   }

//   try {
//     const decoded = jwt.decode(token);
//     const role = decoded?.role;

//     if (pathname.startsWith("/seller/dashboard") && role !== "seller") {
//       return NextResponse.redirect(new URL("/", req.url));
//     }

//     if (pathname.startsWith("/admin/dashboard") && role !== "admin") {
//       return NextResponse.redirect(new URL("/", req.url));
//     }

//     return NextResponse.next();
//   } catch {
//     return NextResponse.redirect(new URL("/auth/login", req.url));
//   }
// }

// export const config = {
//   matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
// };

// // export const config = {
// //   matcher: [
// //     "/((?!_next/static|_next/image|favicon.ico|.*\\.(jpg|jpeg|png|webp|avif|svg|gif)).*)",
// //   ],
// // };

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // ✅ Skip static files & images
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.match(/\.(jpg|jpeg|png|webp|avif|svg|gif)$/)
  ) {
    return NextResponse.next();
  }

  // ✅ Exact public routes
  const exactPublicPaths = [
    "/",
    "/auth/login",
    "/auth/signup",
    "/auth/forgotpassword",
    "/verifyforgotpassword",
    "/verifyemail",
    "/store",
    "/product",
  ];

  // ✅ Prefix public routes
  const prefixPublicPaths = [
    "/products",
    "/stores",
    "/sell-on-aurastore",
  ];

  if (
    exactPublicPaths.includes(pathname) ||
    prefixPublicPaths.some((path) => pathname.startsWith(path))
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  try {
    const decoded = jwt.decode(token);
    const role = decoded?.role;

    if (pathname.startsWith("/seller/dashboard") && role !== "seller") {
      return NextResponse.redirect(new URL("/", req.url));
    }

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