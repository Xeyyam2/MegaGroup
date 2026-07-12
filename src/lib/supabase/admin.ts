import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  const opts: any = { auth: { persistSession: false } };
  // Node.js < 22 needs ws for Supabase realtime
  if (typeof window === "undefined") {
    try {
      const ws = require("ws");
      opts.realtime = { transport: ws };
    } catch (e) {}
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    opts,
  );
}
