import { NextResponse } from "next/server";

export async function proxy(request) {
  const cookies = request.cookies.getAll();

  const authCookie = cookies.find(cookie =>
    cookie.name.endsWith("-auth-token")
  );

  const isLoggedIn = !!authCookie;

  const protectedRoutes = [
    "/dashboard",
    "/profile",
    "/settings",
  ];

  const guestRoutes = [
    "/login",
    "/signup",
  ];

  const pathname = request.nextUrl.pathname;

  const isProtected = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  const isGuest = guestRoutes.some(route =>
    pathname.startsWith(route)
  );

  if (!isLoggedIn && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isLoggedIn && isGuest) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/login",
    "/signup",
  ],
};