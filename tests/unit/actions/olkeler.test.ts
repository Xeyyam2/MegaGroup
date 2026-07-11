import { describe, it, expect, vi, beforeEach } from "vitest";
import { createMockSupabaseClient } from "../../helpers/mockSupabase";

// Mock auth-guard — requireAdmin returns a guard object we control per-test.
const mockRequireAdmin = vi.fn();
vi.mock("@/lib/supabase/auth-guard", () => ({
  requireAdmin: () => mockRequireAdmin(),
  ADMIN_DENIED: { error: "İcazə yoxdur" },
}));

// Mock next/cache so revalidatePath / revalidateTag are no-ops.
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

import { createCountry, deleteCountry, restoreCountry } from "@/app/admin/(cms)/olkeler/actions";

beforeEach(() => {
  mockRequireAdmin.mockReset();
});

describe("createCountry", () => {
  it("returns ADMIN_DENIED when user is not admin", async () => {
    mockRequireAdmin.mockResolvedValue({ authorized: false });
    const fd = new FormData();
    fd.append("slug", "turkiye");
    fd.append("name_az", "Türkiyə");
    const res = await createCountry(fd);
    expect(res).toEqual({ error: "İcazə yoxdur" });
  });

  it("returns zod error when slug is invalid (uppercase)", async () => {
    mockRequireAdmin.mockResolvedValue({
      authorized: true,
      supabase: createMockSupabaseClient(),
    });
    const fd = new FormData();
    fd.append("slug", "Turkiye");
    fd.append("name_az", "Türkiyə");
    const res = await createCountry(fd);
    expect("error" in res).toBe(true);
    expect(res).not.toHaveProperty("success");
  });

  it("returns zod error when name_az is empty", async () => {
    mockRequireAdmin.mockResolvedValue({
      authorized: true,
      supabase: createMockSupabaseClient(),
    });
    const fd = new FormData();
    fd.append("slug", "turkiye");
    fd.append("name_az", "");
    const res = await createCountry(fd);
    expect("error" in res).toBe(true);
    expect(res).not.toHaveProperty("success");
  });

  it("returns success for valid input", async () => {
    const mockClient = createMockSupabaseClient({ result: { data: null, error: null } });
    mockRequireAdmin.mockResolvedValue({ authorized: true, supabase: mockClient });
    const fd = new FormData();
    fd.append("slug", "turkiye");
    fd.append("name_az", "Türkiyə");
    const res = await createCountry(fd);
    expect(res).toEqual({ success: true });
    expect(mockClient.from).toHaveBeenCalledWith("countries");
  });
});

describe("deleteCountry", () => {
  it("returns error for invalid UUID", async () => {
    mockRequireAdmin.mockResolvedValue({
      authorized: true,
      supabase: createMockSupabaseClient(),
    });
    const res = await deleteCountry("not-a-uuid");
    expect(res).toEqual({ error: "Yanlış ID" });
  });

  it("soft-deletes (sets is_deleted=true) for valid UUID", async () => {
    const mockClient = createMockSupabaseClient({ result: { data: null, error: null } });
    mockRequireAdmin.mockResolvedValue({ authorized: true, supabase: mockClient });
    const res = await deleteCountry("550e8400-e29b-41d4-a716-446655440000");
    expect(res).toEqual({ success: true });
    expect(mockClient.from).toHaveBeenCalledWith("countries");
  });
});

describe("restoreCountry", () => {
  it("returns error for invalid UUID", async () => {
    mockRequireAdmin.mockResolvedValue({
      authorized: true,
      supabase: createMockSupabaseClient(),
    });
    const res = await restoreCountry("not-a-uuid");
    expect(res).toEqual({ error: "Yanlış ID" });
  });

  it("restores (sets is_deleted=false) for valid UUID", async () => {
    const mockClient = createMockSupabaseClient({ result: { data: null, error: null } });
    mockRequireAdmin.mockResolvedValue({ authorized: true, supabase: mockClient });
    const res = await restoreCountry("550e8400-e29b-41d4-a716-446655440000");
    expect(res).toEqual({ success: true });
  });
});
