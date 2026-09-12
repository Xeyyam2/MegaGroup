import { describe, it, expect } from "vitest";
import { contactSchema, applicationFormSchema, buildAzPhone } from "@/lib/validations/contact.schema";

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

  it("accepts any 2-digit AZ operator code (məs. 010 — Azercell)", () => {
    const result = contactSchema.safeParse({
      full_name: "Kamilla",
      phone: "+994101234567",
      country_interest: "polsha",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a truncated AZ number (missing digits)", () => {
    const result = contactSchema.safeParse({
      full_name: "Kamilla",
      phone: "+994501633",
      country_interest: "polsha",
    });
    expect(result.success).toBe(false);
  });

  it("form parts: 010 + 7 digits builds a valid final number", () => {
    const form = applicationFormSchema.safeParse({
      full_name: "Kamilla",
      phone_code: "10",
      phone: "1234567",
      country_interest: "polsha",
    });
    expect(form.success).toBe(true);
    if (form.success) {
      expect(buildAzPhone(form.data.phone_code, form.data.phone)).toBe("+994101234567");
    }
  });

  it("form parts: manual prefix (12) + 7 digits builds a valid final number", () => {
    const form = applicationFormSchema.safeParse({
      full_name: "Kamilla",
      phone_code: "12",
      phone: "1234567",
      country_interest: "polsha",
    });
    expect(form.success).toBe(true);
    if (form.success) {
      expect(contactSchema.safeParse({ full_name: "Kamilla", phone: buildAzPhone(form.data.phone_code, form.data.phone), country_interest: "polsha" }).success).toBe(true);
    }
  });

  it("form parts: rejects a non-2-digit manual prefix", () => {
    const form = applicationFormSchema.safeParse({
      full_name: "Kamilla",
      phone_code: "123",
      phone: "1234567",
      country_interest: "polsha",
    });
    expect(form.success).toBe(false);
  });
});
