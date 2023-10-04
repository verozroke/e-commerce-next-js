import { authMiddleware } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
  publicRoutes: ['/api/:path*']
});

export const config = {
  matcher: ['/((?!.+\\.[  \\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  if (request.nextUrl.pathname.startsWith("/api")) {
    response.headers.append("Access-Control-Allow-Origin", "e-commerce-next-js-admin-six.vercel.app")
  }
  //...
  return response
}
