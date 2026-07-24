# Admin Account Credentials — Self-Service Change

**Date:** 2026-07-24
**Status:** Approved (pending implementation)
**Scope:** MegaGroup CMS admin panel

## 1. Goal

Allow the logged-in admin to change their own login **email** and **password** from within the admin panel, without needing access to the Supabase Dashboard or re-running the seed script.

## 2. Requirements (decided)

- **Scope:** Single admin, own account only. No multi-admin user management.
- **Security level:** Current password is **NOT** required to change credentials (user's explicit choice). The `requireAdmin()` guard is the only auth barrier.
- **Email change behavior:** Immediate, no confirmation email (service-role override with `email_confirm: true`).
- **Password change behavior:** Immediate.

## 3. Non-goals (YAGNI)

- Multi-admin create/delete/list management.
- Current-password verification.
- Email confirmation flow.
- 2FA / additional auth factors.
- Audit-log integration (may be added later).

## 4. Architecture

New admin section `/admin/hesab` inside the existing `(cms)` route group, following the established conventions (`page.tsx` server component + `actions.ts` server actions + client form component + zod schema in `src/lib/validations/`).

### Mechanism: Approach A — service-role override

Credentials are updated via the service-role admin client, which bypasses the Supabase email-confirmation flow:

```
createAdminClient().auth.admin.updateUserById(userId, {
  email,                 // optional
  password,              // optional
  email_confirm: true,   // skip confirmation email
})
```

The `role: admin` value lives in `app_metadata`, which `updateUserById` does **not** touch, so admin access is preserved across credential changes.

## 5. Components / Files

| File | Type | Responsibility |
|------|------|----------------|
| `src/app/admin/(cms)/hesab/page.tsx` | Server Component | Render page; read current email via `requireAdmin()` + `getUser()`; render `<AccountForm email=... />` |
| `src/app/admin/(cms)/hesab/AccountForm.tsx` | Client Component | Two independent forms: "Email dəyiş" and "Parol dəyiş"; call server actions; show toasts / inline errors; `router.refresh()` after success |
| `src/app/admin/(cms)/hesab/actions.ts` | Server Actions | `updateEmail(formData)` and `updatePassword(formData)`; each gated by `requireAdmin()`; validate with zod; call `updateUserById` |
| `src/lib/validations/account.schema.ts` | Zod schema | `emailSchema` (valid email, non-empty), `passwordSchema` (min 8 chars) |
| `src/components/admin/Sidebar.tsx` | Edit | Add `{ href: "/admin/hesab", label: "Hesab", icon: Settings }` to `NAV` |

No new dependencies. Uses existing `sonner` (toast), `lucide-react` (`Settings`), and existing supabase clients.

## 6. Data Flow

```
AccountForm (client)
  └─> updateEmail / updatePassword (server action)
        ├─ requireAdmin()              // guard: app_metadata.role === "admin"
        ├─ getUser() on session client  // get current user.id
        ├─ zod safeParse(formData)
        ├─ createAdminClient()
        │     .auth.admin.updateUserById(user.id, { ... , email_confirm: true })
        └─ return { success: true } | { error: "az message" }
  └─< on success: toast.success + router.refresh()
  └─< on error: setError(message)
```

## 7. UI Layout

Single page, stacked cards (matches existing CMS `glass` card style):

1. **Page title:** "Hesab" (font-heading)
2. **Current email** display (read-only, small text)
3. **Card A — Email dəyiş**
   - Input: yeni email
   - Button: "Emaili dəyiş"
   - Warning note: "Emaili dəyişdikdən sonra yenidən daxil olarkən yeni email istifadə olunacaq."
4. **Card B — Parol dəyiş**
   - Input: yeni parol (type=password, min 8)
   - Input: parolu təkrar yaz (type=password, must match)
   - Button: "Parolu dəyiş"

Two separate forms so a mistake in one does not block the other, and so each calls a focused server action.

## 8. Validation

- **Email:** valid email format, non-empty. zod `z.string().email()`.
- **Password:** minimum 8 characters. zod `z.string().min(8)`.
- **Confirm password:** client-side equality check before submit; if mismatch, do not call action.
- New email equal to current email → allow Supabase to no-op / surface nothing problematic (not a hard error).

## 9. Error Handling

Server actions return `{ error: string }`. Source-specific messages mapped to short Azerbaijani-friendly text where possible:

| Supabase error | Display |
|----------------|---------|
| `User already registered` / duplicate email | "Bu email artıq istifadə olunur" |
| Invalid email | "Email formatı yanlışdır" |
| Password too short | "Parol ən azı 8 simvol olmalıdır" |
| Any other | raw `error.message` (fail-open, never silent) |

Unknown errors are surfaced (never swallowed) so the admin can report them.

## 10. Edge Cases

- **Email change → session:** The current session JWT is not auto-refreshed; `updateUserById` updates the user record directly. The page re-reads email server-side via `getUser()` (fresh fetch from GoTrue) and shows the new value after `router.refresh()`. The user stays logged in.
- **Re-login after email change:** Must use the NEW email. (Documented via the in-form warning.)
- **Single-admin lockout risk:** Because no current password is required, a compromised session could change credentials. Accepted risk per user decision. Mitigation note shown in UI.
- **Role preservation:** `app_metadata.role` is untouched by `updateUserById`'s email/password fields, so admin access survives.
- **Empty submissions:** zod rejects; action returns validation error without calling Supabase.

## 11. Testing

- Manual: change password → sign out → sign in with new password (from same and another computer).
- Manual: change email → page shows new email → sign out → sign in with new email.
- Validation: submit short password, mismatched confirm, invalid email → inline errors.
- TypeScript + ESLint must pass (`npx tsc --noEmit`, `npx eslint <files>`).

No automated test framework is currently wired for this repo beyond Playwright/Vitest configs; verification is manual + type/lint gates.

## 12. Out of scope / Future

- Audit-log entry on credential change (audit_log table exists via migration 0007).
- Optional "require current password" toggle.
- Rate limiting the credential-change actions (login already rate-limited).
