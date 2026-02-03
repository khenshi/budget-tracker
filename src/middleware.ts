import { NextRequest, NextResponse } from "next/server";

const publicPaths = ["/", "/login", "/register"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isPublic = publicPaths.some((p) => p === pathname);
  
  if (isPublic) return NextResponse.next();
  
  // For protected routes, check for auth cookie
  const authCookie = req.cookies.get("__Secure-authjs.session-token")?.value || 
                      req.cookies.get("authjs.session-token")?.value;
  
  if (!authCookie) {
    const login = new URL("/login", req.nextUrl.origin);
    login.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(login);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
