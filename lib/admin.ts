import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * Server-side admin check for /api/admin/* handlers.
 * Returns the RLS-bound client on success, or a ready-made 401 response.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: isAdmin } = await supabase.rpc("is_admin");
    if (isAdmin === true) return { supabase, error: null } as const;
  }

  return {
    supabase: null,
    error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
  } as const;
}
