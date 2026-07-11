import { vi } from "vitest";

/**
 * Factory for a chainable mock Supabase client.
 *
 * Supports the query builder pattern used by the admin actions:
 *   supabase.from("table").insert(data)               → awaitable { data, error }
 *   supabase.from("table").update(data).eq("id", id)  → awaitable { data, error }
 *   supabase.from("table").delete().eq("id", id)      → awaitable { data, error }
 *   supabase.from("table").upsert(data, opts)         → awaitable { data, error }
 *   supabase.from("table").select("...").eq(...).single() → { data, error }
 *   supabase.from("table").select("*",{count:"exact",head:true}).eq(...) → awaitable { count, error }
 *
 * Every chain method returns the same thenable, so both
 * `await supabase.from(...).insert(...)` and
 * `supabase.from(...).select(...).single()` work out of the box.
 */

export interface MockSupabaseOptions {
  /** Return value for insert/update/delete/upsert/select operations. */
  result?: { data?: unknown; error?: unknown; count?: number | null };
  /** Separate result for select().single() calls (defaults to `result`). */
  singleResult?: { data?: unknown; error?: unknown };
}

export function createMockSupabaseClient(opts: MockSupabaseOptions = {}) {
  const result = opts.result ?? { data: null, error: null, count: null };
  const singleResult = opts.singleResult ?? result;

  // The thenable chainable — returned by every chain method and by .from().
  const thenable: Record<string, unknown> = {
    data: result.data,
    error: result.error,
    count: result.count ?? null,
    then: (
      onFulfilled?: (v: unknown) => unknown,
      _onRejected?: (e: unknown) => unknown,
    ) =>
      Promise.resolve({
        data: result.data,
        error: result.error,
        count: result.count ?? null,
      }).then(onFulfilled),
  };

  // Chain methods that return the thenable itself.
  const chainMethods = [
    "insert",
    "update",
    "delete",
    "upsert",
    "select",
    "eq",
    "neq",
    "range",
    "order",
    "limit",
    "in",
    "or",
    "ilike",
  ];
  for (const method of chainMethods) {
    thenable[method] = vi.fn((..._args: unknown[]) => thenable);
  }
  // .single() returns a plain object (not thenable).
  thenable.single = vi.fn(() => ({
    data: singleResult.data,
    error: singleResult.error,
  }));

  const client = {
    from: vi.fn(() => thenable),
    auth: {
      getUser: vi.fn(),
      admin: {
        createUser: vi.fn(),
      },
    },
  };
  return client;
}

