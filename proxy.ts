import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "./utils/supabase/middleware";
import { ADMIN_LOGIN_PATH, ADMIN_PATH } from "./lib/adminPath";

/** Redirect that keeps the refreshed session cookies set by updateSession. */
function redirectTo(path: string, request: NextRequest, from: NextResponse) {
  const res = NextResponse.redirect(new URL(path, request.url));
  from.cookies.getAll().forEach((cookie) => res.cookies.set(cookie));
  return res;
}

export async function proxy(request: NextRequest) {
  const { response, isAdmin } = await updateSession(request);
  const path = request.nextUrl.pathname;
  const isAdminPage = path === ADMIN_PATH || path.startsWith(`${ADMIN_PATH}/`);
  const isLoginPage = path === ADMIN_LOGIN_PATH;

  // Gate the admin pages. API routes under /api/admin re-check the role themselves
  // (lib/admin.ts) and the database enforces it again through RLS.
  if (isAdminPage && !isLoginPage && !isAdmin) {
    return redirectTo(ADMIN_LOGIN_PATH, request, response);
  }
  // Already signed in: skip the login form.
  if (isLoginPage && isAdmin) {
    return redirectTo(ADMIN_PATH, request, response);
  }

  return response;
}

export const config = {
  matcher: ["/hehebawal/:path*", "/api/admin/:path*"],
};
