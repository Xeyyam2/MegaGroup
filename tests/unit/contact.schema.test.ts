import { describe, it, expect } from "vitest";
import { contactSchema } from "@/lib/validations/contact.schema";

describe("contactSchema", () => {
  it("passes with valid input", () => {
    const result = contactSchema.safeParse({
      full_name: "Aytən",
      phone: "+994501234567",
      country_interest: "turkiye",
    });
    expect(result.success).toBe(true);
  });

  it("fails when full_name is missing", () => {
    const result = contactSchema.safeParse({
      phone: "+994501234567",
      country_interest: "turkiye",
    });
    expect(result.success).toBe(false);
  });

  it("fails when full_name is too short", () => {
    const result = contactSchema.safeParse({
      full_name: "A",
      phone: "+994501234567",
      country_interest: "turkiye",
    });
    expect(result.success).toBe(false);
  });

  it("fails with an invalid phone number", () => {
    const result = contactSchema.safeParse({
      full_name: "Aytən",
      phone: "abc",
      country_interest: "turkiye",
    });
    expect(result.success).toBe(false);
  });

  it("passes with an empty email (optional)", () => {
    const result = contactSchema.safeParse({
      full_name: "Aytən",
      phone: "+994501234567",
      country_interest: "turkiye",
      email: "",
    });
    expect(result.success).toBe(true);
  });

  it("passes without attestat_avg (optional)", () => {
    const result = contactSchema.safeParse({
      full_name: "Aytən",
      phone: "+994501234567",
      country_interest: "turkiye",
    });
    expect(result.success).toBe(true);
  });

  it("fails when attestat_avg is below 40", () => {
    const result = contactSchema.safeParse({
      full_name: "Aytən",
      phone: "+994501234567",
      country_interest: "turkiye",
      attestat_avg: 30,
    });
    expect(result.success).toBe(false);
  });

  it("fails when attestat_avg is above 100", () => {
    const result = contactSchema.safeParse({
      full_name: "Aytən",
      phone: "+994501234567",
      country_interest: "turkiye",
      attestat_avg: 150,
    });
    expect(result.success).toBe(false);
  });

  it("passes when attestat_avg is in range", () => {
    const result = contactSchema.safeParse({
      full_name: "Aytən",
      phone: "+994501234567",
      country_interest: "turkiye",
      attestat_avg: 85,
    });
    expect(result.success).toBe(true);
  });
});
