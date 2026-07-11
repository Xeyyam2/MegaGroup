import { describe, it, expect, vi, beforeEach } from "vitest";
import { createMockSupabaseClient } from "../../helpers/mockSupabase";

// Mock auth-guard — requireAdmin returns a guard object we control per-test.
const mockRequireAdmin = vi.fn();
vi.mock("@/lib/supabase/auth-guard", () => ({
  requireAdmin: () => mockRequireAdmin(),
  ADMIN_DENIED: { error: "İcazə yoxdur" },
}));

// Mock admin client (used by the cached count query).
vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => createMockSupabaseClient({ result: { count: 0, error: null } }),
}));

// Mock next/cache so revalidatePath / revalidateTag / unstable_cache are no-ops.
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
  unstable_cache: (fn: () => Promise<unknown>) => fn,
}));

import { updateApplicationStatus, deleteApplication } from "@/app/admin/(cms)/muraciyyatler/actions";

beforeEach(() => {
  mockRequireAdmin.mockReset();
});

describe("updateApplicationStatus", () => {
  it("returns error for invalid status value", async () => {
    const res = await updateApplicationStatus("550e8400-e29b-41d4-a716-446655440000", "invalid-status");
    expect(res).toEqual({ error: "Yanlış status dəyəri" });
  });

  it("returns ADMIN_DENIED when user is not admin", async () => {
    mockRequireAdmin.mockResolvedValue({ authorized: false });
    const res = await updateApplicationStatus("550e8400-e29b-41d4-a716-446655440000", "goruldu");
    expect(res).toEqual({ error: "İcazə yoxdur" });
  });

  it("returns error for invalid UUID", async () => {
    mockRequireAdmin.mockResolvedValue({
      authorized: true,
      supabase: createMockSupabaseClient(),
    });
    const res = await updateApplicationStatus("not-a-uuid", "goruldu");
    expect(res).toEqual({ error: "Yanlış ID" });
  });

  it("returns success when admin updates a valid application", async () => {
    const mockClient = createMockSupabaseClient({ result: { data: null, error: null } });
    mockRequireAdmin.mockResolvedValue({ authorized: true, supabase: mockClient });
    const res = await updateApplicationStatus("550e8400-e29b-41d4-a716-446655440000", "goruldu");
    expect(res).toEqual({ success: true });
    expect(mockClient.from).toHaveBeenCalledWith("applications");
  });
});

describe("deleteApplication", () => {
  it("returns ADMIN_DENIED when user is not admin", async () => {
    mockRequireAdmin.mockResolvedValue({ authorized: false });
    const res = await deleteApplication("550e8400-e29b-41d4-a716-446655440000");
    expect(res).toEqual({ error: "İcazə yoxdur" });
  });

  it("returns error for invalid UUID", async () => {
    mockRequireAdmin.mockResolvedValue({
      authorized: true,
      supabase: createMockSupabaseClient(),
    });
    const res = await deleteApplication("bad-id");
    expect(res).toEqual({ error: "Yanlış ID" });
  });

  it("returns success when admin deletes a valid application", async () => {
    const mockClient = createMockSupabaseClient({ result: { data: null, error: null } });
    mockRequireAdmin.mockResolvedValue({ authorized: true, supabase: mockClient });
    const res = await deleteApplication("550e8400-e29b-41d4-a716-446655440000");
    expect(res).toEqual({ success: true });
  });
});
