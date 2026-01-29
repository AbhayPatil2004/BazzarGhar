import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Public routes
  const publicPaths = ["/auth/login", "/auth/signup" , "/" , "/products" , "stores" , "sell on aurastore"];

  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  
  if (!token) {
    return NextResponse.redirect(
      new URL("/auth/signup", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
