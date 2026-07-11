import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

/**
 * RLS policy regression guard.
 *
 * Reads all migration files in order, builds the effective policy set
 * (honoring `drop policy if exists`), and asserts that every effective
 * write policy targeting `authenticated` uses the app_metadata role check.
 *
 * This catches regressions where someone adds a `using(true) with check(true)`
 * policy that bypasses the admin role requirement.
 */

const migrationsDir = resolve(process.cwd(), "supabase", "migrations");
const migrationFiles = readdirSync(migrationsDir)
  .filter((f) => f.endsWith(".sql"))
  .sort();

interface PolicyRecord {
  table: string;
  policyName: string;
  statement: string;
}

// Parse all statements from all migrations, in order.
// Track which policies are dropped so we can compute the effective set.
const allStatements: string[] = [];
for (const file of migrationFiles) {
  const sql = readFileSync(resolve(migrationsDir, file), "utf-8");
  // Split by semicolon (good enough for our migration files — no stored procs with ;)
  for (const stmt of sql.split(";")) {
    const trimmed = stmt.trim();
    if (trimmed) allStatements.push(trimmed);
  }
}

// Build effective policy set: drop removes, create adds/replaces.
const effectivePolicies = new Map<string, PolicyRecord>();
const droppedNames = new Set<string>();

for (const stmt of allStatements) {
  // Match: drop policy if exists "name" on public.table
  const dropMatch = stmt.match(
    /drop\s+policy\s+if\s+exists\s+["']([^"']+)["']\s+on\s+public\.(\w+)/i,
  );
  if (dropMatch) {
    const key = `${dropMatch[2]}:${dropMatch[1]}`;
    effectivePolicies.delete(key);
    droppedNames.add(key);
    continue;
  }

  // Match: create policy "name" on public.table ...
  const createMatch = stmt.match(
    /create\s+policy\s+["']([^"']+)["']\s+on\s+public\.(\w+)/i,
  );
  if (createMatch) {
    const key = `${createMatch[2]}:${createMatch[1]}`;
    effectivePolicies.set(key, {
      table: createMatch[2],
      policyName: createMatch[1],
      statement: stmt,
    });
  }
}

const CMS_TABLES = [
  "countries",
  "universities",
  "faculties",
  "university_fees",
  "faqs",
  "testimonials",
  "site_content",
] as const;

function getPoliciesForTable(table: string): PolicyRecord[] {
  return [...effectivePolicies.values()].filter((p) => p.table === table);
}

describe("RLS policy regression guard", () => {
  it("migration files are readable and sorted", () => {
    expect(migrationFiles.length).toBeGreaterThan(0);
  });

  it("effective policy set is non-empty after processing drops", () => {
    expect(effectivePolicies.size).toBeGreaterThan(0);
  });

  for (const table of CMS_TABLES) {
    describe(`table: ${table}`, () => {
      it("has at least one effective policy", () => {
        const policies = getPoliciesForTable(table);
        expect(policies.length).toBeGreaterThan(0);
      });

      it("every write policy targeting authenticated uses app_metadata role check", () => {
        const policies = getPoliciesForTable(table);
        for (const p of policies) {
          // Skip public read policies (FOR SELECT to anon or with using(true) on active rows)
          const isSelectToAnon = /for\s+select\s+to\s+(anon|public)/i.test(p.statement);
          if (isSelectToAnon) continue;

          // Check if this is a write policy targeting authenticated
          const targetsAuthenticated = /to\s+authenticated/i.test(p.statement);
          if (!targetsAuthenticated) continue;

          // This is a write policy for authenticated — must have role check
          const hasRoleCheck =
            /app_metadata/.test(p.statement) &&
            /role/.test(p.statement) &&
            /admin/.test(p.statement);
          expect(hasRoleCheck).toBe(true);
        }
      });

      it("no effective write policy uses bare using(true) with check(true)", () => {
        const policies = getPoliciesForTable(table);
        for (const p of policies) {
          const isSelectToAnon = /for\s+select\s+to\s+(anon|public)/i.test(p.statement);
          if (isSelectToAnon) continue;
          if (!/to\s+authenticated/i.test(p.statement)) continue;

          const wideOpen =
            /using\s*\(\s*true\s*\)/i.test(p.statement) &&
            /with\s*check\s*\(\s*true\s*\)/i.test(p.statement);
          expect(wideOpen).toBe(false);
        }
      });
    });
  }

  describe("table: applications", () => {
    it("has admin-only SELECT policy (authenticated, role check)", () => {
      const policies = getPoliciesForTable("applications");
      const selectPolicy = policies.find((p) => /for\s+select/i.test(p.statement));
      expect(selectPolicy).toBeDefined();
      expect(/app_metadata/.test(selectPolicy!.statement)).toBe(true);
      expect(/admin/.test(selectPolicy!.statement)).toBe(true);
    });

    it("has admin-only UPDATE policy (authenticated, role check in using + check)", () => {
      const policies = getPoliciesForTable("applications");
      const updatePolicy = policies.find((p) => /for\s+update/i.test(p.statement));
      expect(updatePolicy).toBeDefined();
      expect(/app_metadata/.test(updatePolicy!.statement)).toBe(true);
      expect(/admin/.test(updatePolicy!.statement)).toBe(true);
    });

    it("has admin-only DELETE policy (authenticated, role check)", () => {
      const policies = getPoliciesForTable("applications");
      const deletePolicy = policies.find((p) => /for\s+delete/i.test(p.statement));
      expect(deletePolicy).toBeDefined();
      expect(/app_metadata/.test(deletePolicy!.statement)).toBe(true);
      expect(/admin/.test(deletePolicy!.statement)).toBe(true);
    });
  });
});

