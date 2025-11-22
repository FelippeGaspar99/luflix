import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const role = req.nextauth.token?.role;

    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/employee", req.url));
    }

    if (pathname.startsWith("/employee") && role !== "EMPLOYEE") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    if (pathname.startsWith("/modules") && role !== "EMPLOYEE") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  },
);

export const config = {
  matcher: ["/admin/:path*", "/employee/:path*", "/modules/:path*", "/members/:path*"],
};
