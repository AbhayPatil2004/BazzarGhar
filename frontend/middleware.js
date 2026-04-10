
import { NextResponse } from "next/server";

export function middleware(req) {
  // Allow all requests
  return NextResponse.next();
}