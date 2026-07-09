import { describe, it, expect } from "vitest";
import {
  APPLICATION_STATUSES,
  applicationStatusSchema,
} from "@/lib/validations/application.schema";

describe("applicationStatusSchema", () => {
  it("exports the 4 statuses defined in the DB migration (0003)", () => {
    expect(APPLICATION_STATUSES).toEqual(["yeni", "goruldu", "qebul_edildi", "imtina"]);
  });

  it.each(APPLICATION_STATUSES)("accepts valid status: %s", (status) => {
    expect(applicationStatusSchema.safeParse(status).success).toBe(true);
  });

  it("rejects an arbitrary string", () => {
    expect(applicationStatusSchema.safeParse("completed").success).toBe(false);
  });

  it("rejects an XSS-like payload", () => {
    expect(applicationStatusSchema.safeParse("<script>").success).toBe(false);
  });

  it("rejects empty string", () => {
    expect(applicationStatusSchema.safeParse("").success).toBe(false);
  });

  it("rejects non-string types", () => {
    expect(applicationStatusSchema.safeParse(42).success).toBe(false);
    expect(applicationStatusSchema.safeParse(null).success).toBe(false);
  });
});
