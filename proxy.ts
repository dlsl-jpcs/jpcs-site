import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "./utils/supabase/middleware";

export async function proxy(request: NextRequest) {
  const { response, isAdmin } = await updateSession(request);
  const path = request.nextUrl.pathname;

  // Gate the admin pages. API routes under /api/admin re-check the role themselves
  // (lib/admin.ts) and the database enforces it again through RLS.
  if (path.startsWith("/admin") && !path.startsWith("/admin/login") && !isAdmin) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
