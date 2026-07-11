import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the Supabase server client — auth-guard calls createClient() then .auth.getUser()
const mockGetUser = vi.fn();
vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({
    auth: { getUser: mockGetUser },
  }),
}));

import { requireAdmin, ADMIN_DENIED } from "@/lib/supabase/auth-guard";

beforeEach(() => {
  mockGetUser.mockReset();
});

describe("requireAdmin", () => {
  it("returns authorized:true when user has app_metadata.role === 'admin'", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "u1", app_metadata: { role: "admin" } } },
    });
    const guard = await requireAdmin();
    expect(guard.authorized).toBe(true);
  });

  it("returns authorized:false when user role is 'user' (not admin)", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "u1", app_metadata: { role: "user" } } },
    });
    const guard = await requireAdmin();
    expect(guard.authorized).toBe(false);
  });

  it("returns authorized:false when no user is logged in", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    const guard = await requireAdmin();
    expect(guard.authorized).toBe(false);
  });

  it("returns authorized:false when app_metadata is missing", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "u1" } }, // no app_metadata
    });
    const guard = await requireAdmin();
    expect(guard.authorized).toBe(false);
  });

  it("ADMIN_DENIED is a static denial object", () => {
    expect(ADMIN_DENIED).toEqual({ error: "İcazə yoxdur" });
  });
});
