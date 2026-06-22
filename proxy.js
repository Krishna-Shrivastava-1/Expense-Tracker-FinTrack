// import { NextResponse } from "next/server";

// export async function proxy(request) {
//   const cookies = request.cookies.getAll();

//   const authCookie = cookies.find(cookie =>
//     cookie.name.endsWith("-auth-token")
//   );

//   const isLoggedIn = !!authCookie;

//   const protectedRoutes = [
//     "/dashboard",
//     "/profile",
//     "/settings",
//   ];

//   const guestRoutes = [
//     "/login",
//     "/signup",
//   ];

//   const pathname = request.nextUrl.pathname;

//   const isProtected = protectedRoutes.some(route =>
//     pathname.startsWith(route)
//   );

//   const isGuest = guestRoutes.some(route =>
//     pathname.startsWith(route)
//   );

//   if (!isLoggedIn && isProtected) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   if (isLoggedIn && isGuest) {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/dashboard/:path*",
//     "/profile/:path*",
//     "/settings/:path*",
//     "/login",
//     "/signup",
//   ],
// };

import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

// 💡 FIXED: Changed function name from 'proxy' to 'middleware' so Next.js actually runs it
export async function proxy(request) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 1. Initialize Supabase Client in Middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll().map((cookie) => ({
            name: cookie.name,
            value: cookie.value,
          }));
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set({ name, value, ...options })
          );
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set({ name, value, ...options })
          );
        },
      },
    }
  );

  // 2. Get the authenticated user safely
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoggedIn = !!user;
  const pathname = request.nextUrl.pathname;

  const protectedRoutes = ["/dashboard", "/profile", "/settings"];
  const guestRoutes = ["/login", "/signup"];

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  const isGuest = guestRoutes.some((route) => pathname.startsWith(route));

  // 3. Evaluate Access
  if (!isLoggedIn && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isLoggedIn && isGuest) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

// 4. Standard middleware matcher mapping
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/login",
    "/signup",
  ],
};